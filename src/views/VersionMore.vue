<template>
	<div class="version-more-container">
		<div class="version-header">
			<h2>{{ version }} 详细信息</h2>
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
		<div v-if="error" class="error">
			{{ error }}
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { downloadManager } from '../services/DownloadManager';

const route = useRoute();
const version = computed(() => route.params.version);
const versionData = ref(null);
const loading = ref(true);
const error = ref(null);

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
		const response = await fetch(
			'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json'
		);
		if (!response.ok) throw new Error('Failed to fetch version data');

		const data = await response.json();
		const versionInfo = data.versions.find((v) => v.id === version.value);

		if (!versionInfo) {
			throw new Error('Version not found');
		}

		versionData.value = {
			...versionInfo,
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
	try {
		await downloadManager.downloadVersion(version.value, type);
	} catch (error) {
		console.error('下载失败:', error);
	}
};

onMounted(() => {
	console.log('VersionMore mounted, version:', version);
	console.log('Route params:', route.params);
	fetchVersionData();
});
</script>

<style scoped>
.version-more-container {
	padding: 2rem;
	max-width: 1200px;
	margin: 0 auto;
}

.version-header {
	margin-bottom: 2rem;
}

.version-header h2 {
	margin: 0;
	font-size: 2rem;
	color: var(--text-color);
}

.version-meta {
	margin-top: 1rem;
	display: flex;
	gap: 1rem;
	align-items: center;
}

.version-type {
	font-size: 0.9rem;
	padding: 0.3rem 0.8rem;
	border-radius: 4px;
	text-transform: capitalize;
	background: rgba(128, 128, 128, 0.15);
	color: var(--text-color);
}

.version-type.release {
	background: rgba(76, 175, 80, 0.15);
	color: #4caf50;
}

.version-type.snapshot {
	background: rgba(255, 152, 0, 0.15);
	color: #ff9800;
}

.version-type.old_alpha,
.version-type.old_beta {
	background: rgba(156, 39, 176, 0.15);
	color: #9c27b0;
}

.version-content {
	background: var(--surface-color);
	border-radius: 12px;
	padding: 2rem;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.download-options h3 {
	margin-top: 0;
	margin-bottom: 1.5rem;
	color: var(--text-color);
}

.option-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 1.5rem;
}

.download-option {
	background: rgba(128, 128, 128, 0.05);
	padding: 1.5rem;
	border-radius: 8px;
	transition: all 0.3s ease;
}

.download-option:hover {
	background: rgba(128, 128, 128, 0.1);
	transform: translateY(-2px);
}

.download-option h4 {
	margin: 0 0 1rem 0;
	color: var(--text-color);
}

.download-btn {
	width: 100%;
	padding: 0.75rem 1.25rem;
	border: none;
	border-radius: 8px;
	background: var(--theme-color);
	color: white;
	cursor: pointer;
	transition: all 0.3s ease;
	font-size: 0.95rem;
}

.download-btn:hover {
	filter: brightness(1.1);
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(var(--theme-color-rgb), 0.4);
}

.loading,
.error {
	text-align: center;
	padding: 2rem;
	color: var(--secondary-text);
}

.error {
	color: #f44336;
}

@media (max-width: 768px) {
	.version-more-container {
		padding: 1rem;
	}

	.version-content {
		padding: 1.5rem;
	}

	.option-grid {
		grid-template-columns: 1fr;
	}
}
</style>
