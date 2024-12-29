<template>
	<div class="page-container">
		<transition name="content-transition" mode="out-in">
			<div class="version-more-container">
				<div class="version-header">
					<h2>{{ versionId }} 详细信息</h2>
					<div class="version-meta" v-if="versionData">
						<span class="version-type" :class="versionData.type">
							{{ getVersionTypeName(versionData.type) }}
						</span>
						<span class="version-date">{{ versionData.releaseTime }}</span>
					</div>
				</div>

				<div class="version-content" v-if="versionData">
					<div class="download-options">
						<h3>下载选项</h3>
						<div class="option-grid">
							<div class="download-option">
								<h4>原版客户端</h4>
								<button class="download-btn" @click="startDownload('vanilla')">
									下载客户端
								</button>
							</div>
							<div class="download-option">
								<h4>服务端</h4>
								<button class="download-btn" @click="startDownload('server')">
									下载服务端
								</button>
							</div>
						</div>
					</div>
				</div>

				<div v-if="loading" class="loading">加载中...</div>
				<div v-if="error" class="error">{{ error }}</div>

				<div class="back-section">
					<button class="back-btn" @click="handleBack">
						<span class="back-icon">←</span>
						返回版本列表
					</button>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 定义 props
const props = defineProps({
	version: {
		type: String,
		required: true
	}
});

const route = useRoute();
const router = useRouter();
const versionId = ref(route.params.version);
const versionData = ref(null);
const loading = ref(true);
const error = ref(null);

console.log('VersionDetail mounted with props:', props);
console.log('VersionDetail mounted with route:', {
	path: route.path,
	params: route.params,
	name: route.name,
	fullPath: route.fullPath
});

const getVersionTypeName = (type) => {
	const typeNames = {
		release: '正式版',
		snapshot: '快照版',
		pre_release: '预发布版',
		release_candidate: '候选版',
		old_alpha: '远古版本(Alpha)',
		old_beta: '远古版本(Beta)',
	};
	return typeNames[type] || type;
};

const fetchVersionData = async () => {
	try {
		loading.value = true;
		console.log('Fetching data for version:', versionId.value);
		const response = await fetch(
			'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json'
		);
		if (!response.ok) throw new Error('Failed to fetch version data');

		const data = await response.json();
		const versionInfo = data.versions.find((v) => v.id === versionId.value);

		if (!versionInfo) {
			throw new Error('Version not found');
		}

		// 获取具体版本信息
		const versionResponse = await fetch(versionInfo.url);
		if (!versionResponse.ok) throw new Error('Failed to fetch version details');

		const versionDetails = await versionResponse.json();
		console.log('Version details:', versionDetails);

		versionData.value = {
			...versionInfo,
			...versionDetails,
			releaseTime: new Date(versionInfo.releaseTime).toLocaleString('zh-CN', {
				hour12: false,
			}),
		};
	} catch (err) {
		error.value = '获取版本信息失败: ' + err.message;
		console.error('Error fetching version data:', err);
	} finally {
		loading.value = false;
	}
};

const startDownload = async (type) => {
	console.log('Starting download:', type);
	// 这里添加下载逻辑
};

const handleBack = () => {
	try {
		router.push({ name: 'Download' });
	} catch (error) {
		console.error('Navigation error:', error);
	}
};

onMounted(() => {
	console.log('VersionDetail mounted with version:', versionId.value);
	if (!versionId.value) {
		console.error('No version parameter found');
		error.value = '未找到版本参数';
		router.push({ name: 'Download' });
		return;
	}
	fetchVersionData();
});

// 监听 props 变化
watch(() => props.version, (newVersion) => {
	console.log('Version prop changed:', newVersion);
	if (newVersion) {
		versionId.value = newVersion;
		fetchVersionData();
	}
});
</script>

<style scoped>
.page-container {
	height: 100vh;
	width: 100%;
	padding: 2rem;
	background: var(--background-color);
	overflow-y: auto;
}

.version-more-container {
	max-width: 1200px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.version-header {
	background: var(--surface-color);
	padding: 2rem;
	border-radius: 12px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.version-header h2 {
	margin: 0 0 1rem 0;
	color: var(--text-color);
	font-size: 2rem;
}

.version-meta {
	display: flex;
	gap: 1rem;
	align-items: center;
}

.version-type {
	font-size: 1rem;
	padding: 0.5rem 1rem;
	border-radius: 6px;
	text-transform: capitalize;
	background: rgba(var(--theme-color-rgb), 0.1);
	color: var(--theme-color);
}

.version-content {
	background: var(--surface-color);
	border-radius: 12px;
	padding: 2rem;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.download-options h3 {
	margin: 0 0 1.5rem 0;
	font-size: 1.5rem;
	color: var(--text-color);
}

.option-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 2rem;
}

.download-option {
	background: rgba(var(--theme-color-rgb), 0.05);
	padding: 2rem;
	border-radius: 12px;
	transition: all 0.3s ease;
}

.download-option:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 24px rgba(var(--theme-color-rgb), 0.15);
}

.download-option h4 {
	margin: 0 0 1rem 0;
	font-size: 1.2rem;
	color: var(--text-color);
}

.download-btn {
	width: 100%;
	padding: 1rem;
	border: none;
	border-radius: 8px;
	background: var(--theme-color);
	color: white;
	font-size: 1rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.download-btn:hover {
	filter: brightness(1.1);
	transform: translateY(-2px);
}

.back-section {
	margin-top: 2rem;
}

.back-btn {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 1rem 2rem;
	border: none;
	border-radius: 8px;
	background: var(--theme-color);
	color: white;
	font-size: 1rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.back-btn:hover {
	filter: brightness(1.1);
	transform: translateY(-2px);
}

.loading,
.error {
	text-align: center;
	padding: 3rem;
	background: var(--surface-color);
	border-radius: 12px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	font-size: 1.2rem;
}

.error {
	color: #ff4d4f;
	background: rgba(255, 77, 79, 0.1);
}

/* 过渡动画 */
.content-transition-enter-active,
.content-transition-leave-active {
	transition: all 0.3s ease;
}

.content-transition-enter-from,
.content-transition-leave-to {
	opacity: 0;
	transform: translateY(20px);
}

@media (max-width: 768px) {
	.page-container {
		padding: 1rem;
	}

	.version-header,
	.version-content {
		padding: 1.5rem;
	}

	.option-grid {
		grid-template-columns: 1fr;
	}
}
</style>
