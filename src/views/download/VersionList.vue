<template>
	<div class="version-list-container" ref="versionListRef">
		<transition name="fade-slide" mode="out-in">
			<div v-if="loading" class="loading">加载中...</div>

			<div v-else-if="error" class="error">
				{{ error }}
			</div>

			<div v-else class="version-items">
				<div v-for="version in filteredVersions" :key="version.id" class="version-item">
					<div class="version-info">
						<h3>{{ version.id }}</h3>
						<div class="version-meta">
							<span class="version-type" :class="version.type">{{
								version.type
							}}</span>
							<span class="version-date">发布日期: {{ version.releaseTime }}</span>
						</div>
					</div>
					<div class="version-actions">
						<button class="download-btn">下载</button>
						<router-link :to="`/download/${version.id}/more`" class="more-btn">
							额外选项
						</router-link>
					</div>
				</div>
			</div>
		</transition>
		<div class="search-container">
			<input type="text" placeholder="搜索版本..." v-model="searchQuery" />
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue';

const versions = ref([]);
const loading = ref(true);
const error = ref(null);
const versionListRef = ref(null);

// 从父组件注入当前分类和搜索查询
const currentCategory = inject('currentCategory');
const searchQuery = inject('searchQuery');

// 从 Mojang API 获取数据
const fetchVersions = async () => {
	try {
		loading.value = true;
		const response = await fetch(
			'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json'
		);
		if (!response.ok) throw new Error('Failed to fetch versions');

		const data = await response.json();
		versions.value = data.versions.map((v) => ({
			id: v.id,
			type: v.type,
			releaseTime: new Date(v.releaseTime).toLocaleString('zh-CN', { hour12: false }),
			url: v.url,
		}));
	} catch (err) {
		error.value = '获取版本数据失败: ' + err.message;
		console.error('Error fetching versions:', err);
	} finally {
		loading.value = false;
	}
};

const isVersionMatch = computed(() => {
	const cache = new Map();

	return (version) => {
		const cacheKey = `${version.id}-${version.type}-${currentCategory.value}`;
		if (cache.has(cacheKey)) {
			return cache.get(cacheKey);
		}

		const mainVersion = parseFloat(version.id.split('.')[0]);
		let result = false;

		switch (currentCategory.value) {
			case 'release':
				result = version.type === 'release' && mainVersion >= 1;
				break;
			case 'snapshot':
				result =
					(version.type === 'snapshot' ||
						version.type === 'pre_release' ||
						version.type === 'release_candidate') &&
					mainVersion >= 1;
				break;
			case 'old':
				result =
					mainVersion < 1 || version.type === 'old_alpha' || version.type === 'old_beta';
				break;
		}

		cache.set(cacheKey, result);
		return result;
	};
});

const filteredVersions = computed(() => {
	const query = searchQuery.value.toLowerCase();
	const matcher = isVersionMatch.value;

	return versions.value.filter(
		(version) => version.id.toLowerCase().includes(query) && matcher(version)
	);
});

onMounted(async () => {
	await fetchVersions();
});
</script>

<style scoped>
.version-list-container {
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	scrollbar-width: thin;
	scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
	padding: 1.5rem;
	padding-right: 1rem;
	background: var(--background-color);
	border-radius: 12px;
	scroll-behavior: smooth;
}

.version-items {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.version-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1.5rem;
	min-width: 0;
	background: var(--surface-color);
	border-radius: 12px;
	border: 1px solid rgba(128, 128, 128, 0.1);
	transition: all 0.3s ease;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.version-item:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 28px rgba(0, 0, 0, 0.2);
}

.version-info {
	flex: 1;
	min-width: 0;
}

.version-info h3 {
	margin: 0;
	font-size: 1.2rem;
	color: var(--text-color);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.version-meta {
	display: flex;
	gap: 1rem;
	align-items: center;
	margin-top: 0.5rem;
}

.version-type {
	font-size: 0.8rem;
	padding: 0.2rem 0.5rem;
	border-radius: 4px;
	text-transform: capitalize;
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

.version-date {
	color: var(--secondary-text);
	font-size: 0.9rem;
}

.version-actions {
	display: flex;
	gap: 0.5rem;
	margin-left: 1rem;
}

.download-btn,
.more-btn {
	padding: 0.75rem 1.25rem;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.3s ease;
	font-size: 0.95rem;
	text-decoration: none;
}

.download-btn {
	background: var(--theme-color);
	color: white;
}

.more-btn {
	background: rgba(128, 128, 128, 0.1);
	color: var(--text-color);
}

.download-btn:hover {
	filter: brightness(1.1);
}

.more-btn:hover {
	background: rgba(128, 128, 128, 0.2);
}

/* 加载和错误状态样式 */
.loading,
.error {
	text-align: center;
	padding: 2rem;
	color: var(--secondary-text);
	background: var(--surface-color);
	border-radius: 12px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.search-container {
	position: relative;
	width: 400px;
}

.search-container::before {
	content: '';
	position: absolute;
	left: 12px;
	top: 50%;
	transform: translateY(-50%);
	width: 16px;
	height: 16px;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.7)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	pointer-events: none;
}
</style>
