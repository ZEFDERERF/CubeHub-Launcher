<template>
	<div class="java-settings-container">
		<h1 class="title">Java 设置</h1>
		<div class="settings-box">
			<div class="form-group">
				<label>Java 路径</label>
				<div class="input-group">
					<select v-model="selectedJava" class="java-select" @change="handleJavaSelect">
						<option :value="null">请选择 Java 版本</option>
						<option v-for="java in javaList" :key="java.path" :value="java">
							Java {{ java.version }} ({{ java.is_64bit ? '64位' : '32位' }})
						</option>
					</select>
					<button class="browse-button" @click="browseJava" :disabled="isRefreshing">
						{{ isRefreshing ? '检测中...' : '手动导入' }}
					</button>
					<button class="search-button" @click="refreshJavaList" :disabled="isRefreshing">
						{{ isRefreshing ? '搜索中...' : '自动搜索' }}
					</button>
				</div>
				<p class="path-display" v-if="selectedJava">路径: {{ selectedJava.path }}</p>
				<p class="error-message" v-if="errorMessage">
					{{ errorMessage }}
				</p>
				<p class="info-message" v-if="!javaList.length">
					未检测到 Java 安装，请手动导入或点击自动搜索
				</p>
			</div>

			<div class="form-group">
				<label>内存设置</label>
				<div class="memory-slider">
					<input type="range" v-model="memory" min="1024" max="8192" step="512" />
					<div class="memory-value">{{ (memory / 1024).toFixed(1) }}GB</div>
				</div>
			</div>

			<div class="java-info">
				<h3>系统信息</h3>
				<p>可用内存：{{ systemMemory }}GB</p>
				<p>推荐内存：{{ recommendedMemory }}GB</p>
			</div>
		</div>

		<div class="actions">
			<button class="back-button" @click="router.push('/start/login')">返回</button>
			<button class="next-button" :disabled="!canProceed" @click="handleNext">下一步</button>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { configManager } from '../../utils/config';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';

const router = useRouter();
const javaList = ref([]);
const selectedJava = ref(null);
const memory = ref(2048);
const systemMemory = ref(8);
const recommendedMemory = computed(() => Math.min(systemMemory.value / 2, 4));
const isRefreshing = ref(false);
const errorMessage = ref('');
const isTauriReady = ref(false);

const canProceed = computed(() => selectedJava.value && selectedJava.value.path);

const handleJavaSelect = () => {
	errorMessage.value = '';
	console.log('选择的 Java:', selectedJava.value);
};

const waitForTauri = async () => {
	if (isTauriReady.value) return;

	try {
		// 尝试调用一个简单的 Tauri API 来检查是否已初始化
		await appWindow.label();
		isTauriReady.value = true;
	} catch (error) {
		console.warn('Tauri 未就绪，等待中...');
		await new Promise((resolve) => setTimeout(resolve, 100));
		await waitForTauri();
	}
};

const browseJava = async () => {
	try {
		isRefreshing.value = true;
		errorMessage.value = '';

		// 确保 Tauri 已初始化
		await waitForTauri();

		const filePath = await open({
			multiple: false,
			filters: [
				{
					name: 'Java 可执行文件',
					extensions: ['exe'],
				},
			],
			defaultPath: 'C:\\Program Files\\Java',
			title: '选择 javaw.exe',
		});

		if (!filePath) return;

		const fileName = filePath.toLowerCase();
		if (!fileName.endsWith('javaw.exe')) {
			errorMessage.value = '请选择 javaw.exe 文件';
			return;
		}

		const javaExePath = filePath.replace(/javaw\.exe$/i, 'java.exe');
		const javaInfo = await invoke('get_java_info', {
			path: javaExePath, // 移除 convertFileSrc，因为这是后端调用
		});

		if (javaInfo) {
			javaInfo.path = filePath; // 使用原始路径
			const exists = javaList.value.find((j) => j.path === javaInfo.path);
			if (!exists) {
				javaList.value = [javaInfo, ...javaList.value];
			}
			selectedJava.value = javaInfo;
			console.log('手动导入的 Java:', javaInfo);
			await configManager.setJavaPath(javaInfo.path);
		}
	} catch (error) {
		console.error('导入 Java 失败:', error);
		errorMessage.value = error.toString();
	} finally {
		isRefreshing.value = false;
	}
};

const refreshJavaList = async () => {
	try {
		isRefreshing.value = true;
		errorMessage.value = '';

		await waitForTauri();
		const installations = await invoke('detect_java_installations');
		console.log('检测到的 Java 安装:', installations);

		const newList = [
			...javaList.value,
			...installations.filter((java) => !javaList.value.some((j) => j.path === java.path)),
		];

		newList.sort((a, b) => {
			const aIsJava8 = a.version.startsWith('1.8.');
			const bIsJava8 = b.version.startsWith('1.8.');
			if (aIsJava8 && !bIsJava8) return -1;
			if (!aIsJava8 && bIsJava8) return 1;
			if (a.is_64bit && !b.is_64bit) return -1;
			if (!a.is_64bit && b.is_64bit) return 1;
			return b.version.localeCompare(a.version);
		});

		javaList.value = newList;

		if (!selectedJava.value && newList.length > 0) {
			const java8_64 = newList.find(
				(java) => java.version.startsWith('1.8.') && java.is_64bit
			);
			selectedJava.value = java8_64 || newList[0];
			console.log('自动选择的 Java:', selectedJava.value);
		}

		if (!newList.length) {
			errorMessage.value = '未在默认位置检测到 Java，请手动选择或安装 Java 8 或更高版本';
		}
	} catch (error) {
		console.error('获取 Java 安装列表失败:', error);
		errorMessage.value = '检测 Java 失败，请手动选择 Java 路径';
	} finally {
		isRefreshing.value = false;
	}
};

const handleNext = async () => {
	try {
		errorMessage.value = '';
		if (!selectedJava.value || !selectedJava.value.path) {
			errorMessage.value = '请选择一个 Java 版本';
			return;
		}

		await configManager.setJavaPath(selectedJava.value.path);
		await configManager.setMaxMemory(memory.value);

		router.push('/start/game-path');
	} catch (error) {
		console.error('保存 Java 设置失败:', error);
		errorMessage.value = '保存设置失败: ' + error.message;
	}
};

const loadLastUsedJava = async () => {
	try {
		const lastJavaPath = await configManager.getJavaPath();
		if (lastJavaPath) {
			try {
				await waitForTauri();
				const javaInfo = await invoke('get_java_info', { path: lastJavaPath });
				if (javaInfo) {
					javaList.value = [javaInfo];
					selectedJava.value = javaInfo;
					console.log('使用上次的 Java:', javaInfo);
				}
			} catch (error) {
				console.warn('上次的 Java 路径无效:', error);
			}
		}
	} catch (error) {
		console.error('加载上次使用的 Java 失败:', error);
	}
};

onMounted(async () => {
	try {
		await waitForTauri();
		await loadLastUsedJava();
	} catch (error) {
		console.error('初始化失败:', error);
		errorMessage.value = '初始化失败: ' + error.message;
	}
});
</script>

<style scoped>
@font-face {
	font-family: 'CubeHub';
	src: url('../../assets/Fonts/Font.ttf') format('truetype');
}

.java-settings-container {
	padding: 2rem;
	max-width: 800px;
	margin: 0 auto;
	font-family: 'CubeHub', sans-serif;
}

.title {
	color: var(--text-color);
	text-align: center;
	margin-bottom: 2rem;
	font-size: 2.5rem;
}

.settings-box {
	background: var(--surface-color);
	border-radius: 8px;
	padding: 2rem;
	margin-bottom: 2rem;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
	margin-bottom: 1.5rem;
}

.form-group label {
	display: block;
	margin-bottom: 0.5rem;
	color: var(--text-color);
}

.input-group {
	display: flex;
	gap: 0.5rem;
}

.input-group input {
	flex: 1;
	padding: 0.8rem;
	border: 1px solid var(--border-color);
	border-radius: 4px;
	background: var(--background-color);
	color: var(--text-color);
	font-family: 'CubeHub', sans-serif;
}

.browse-button,
.search-button {
	padding: 0 1rem;
	background: var(--primary-color);
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-family: 'CubeHub', sans-serif;
	transition: all 0.3s;
	white-space: nowrap;
	min-width: 90px;
}

.search-button {
	background: var(--secondary-color, #4caf50);
}

.browse-button:hover:not(:disabled),
.search-button:hover:not(:disabled) {
	filter: brightness(1.1);
}

.browse-button:active:not(:disabled),
.search-button:active:not(:disabled) {
	transform: translateY(1px);
}

.browse-button:disabled,
.search-button:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}

.memory-slider {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.memory-slider input[type='range'] {
	flex: 1;
	height: 4px;
	background: var(--border-color);
	border-radius: 2px;
	outline: none;
}

.memory-value {
	min-width: 60px;
	color: var(--text-color);
}

.java-info {
	margin-top: 2rem;
	padding-top: 1rem;
	border-top: 1px solid var(--border-color);
}

.java-info h3 {
	color: var(--text-color);
	margin-bottom: 1rem;
}

.java-info p {
	color: var(--secondary-text-color);
	margin-bottom: 0.5rem;
}

.actions {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 2rem;
	gap: 1rem;
}

.back-button,
.next-button {
	padding: 0.8rem 2rem;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-family: 'CubeHub', sans-serif;
	transition: all 0.3s;
	min-width: 120px;
	font-size: 1rem;
}

.back-button {
	background: var(--surface-color);
	color: var(--text-color);
	border: 1px solid var(--border-color);
}

.next-button {
	background: var(--primary-color);
	color: white;
}

.next-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.back-button:hover {
	background: var(--hover-color);
}

.next-button:hover:not(:disabled) {
	filter: brightness(1.1);
}

.back-button:active,
.next-button:active:not(:disabled) {
	transform: translateY(1px);
}

.java-select {
	flex: 1;
	padding: 0.8rem;
	border: 1px solid var(--border-color);
	border-radius: 4px;
	background: var(--background-color);
	color: var(--text-color);
	font-family: 'CubeHub', sans-serif;
	cursor: pointer;
}

.path-display {
	margin-top: 0.5rem;
	font-size: 0.9rem;
	color: var(--secondary-text-color);
	word-break: break-all;
}

.error-message {
	color: #ff4444;
	margin-top: 0.5rem;
	font-size: 0.9rem;
}

.info-message {
	color: #666;
	margin-top: 0.5rem;
	font-size: 0.9rem;
}
</style>
