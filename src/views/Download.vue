<template>
	<div class="page-container">
		<div class="download-container">
			<!-- 左侧版本切换侧边栏 -->
			<nav class="version-sidebar">
				<button
					v-for="(count, type) in versionCounts"
					:key="type"
					class="version-nav-btn"
					:class="{ active: currentCategory === type }"
					@click="handleCategoryChange(type)"
					:disabled="isAnimating"
				>
					<div class="btn-content">
						<div class="icon-label">
							<!-- 正式版图标 - 钻石图标代表稳定版本 -->
							<svg v-if="type === 'release'" class="nav-icon" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M18.9 6.5L12 2L5.1 6.5l2.5 7.9L12 19.8l4.4-5.4l2.5-7.9M12 4.3l4.5 2.9l-1.6 5l-2.9-.6l-2.9.6l-1.6-5L12 4.3m0 13.1l-2.6-3.2l2.6.6l2.6-.6l-2.6 3.2z"
								/>
							</svg>
							<!-- 预览版图标 - 实验室烧杯图标代表测试版本 -->
							<svg
								v-else-if="type === 'snapshot'"
								class="nav-icon"
								viewBox="0 0 24 24"
							>
								<path
									fill="currentColor"
									d="M6,22A3,3 0 0,1 3,19C3,18.4 3.18,17.84 3.5,17.37L9,7.81V6A1,1 0 0,1 8,5V4A2,2 0 0,1 10,2H14A2,2 0 0,1 16,4V5A1,1 0 0,1 15,6V7.81L20.5,17.37C20.82,17.84 21,18.4 21,19A3,3 0 0,1 18,22H6M5,19A1,1 0 0,0 6,20H18A1,1 0 0,0 19,19C19,18.79 18.93,18.59 18.82,18.43L16.53,14.47L14,17L8.93,11.93L5.18,18.43C5.07,18.59 5,18.79 5,19M13,10A1,1 0 0,0 12,9A1,1 0 0,0 11,10A1,1 0 0,0 12,11A1,1 0 0,0 13,10Z"
								/>
							</svg>
							<!-- 远古版图标 - 化石图标代表老版本 -->
							<svg
								v-else-if="type === 'old_alpha'"
								class="nav-icon"
								viewBox="0 0 24 24"
							>
								<path
									fill="currentColor"
									d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z M8.83,7.67C9.03,7.67 9.23,7.73 9.4,7.87L10.5,8.63L11.6,7.87C11.77,7.73 11.97,7.67 12.17,7.67A1,1 0 0,1 13.17,8.67C13.17,8.87 13.1,9.07 12.97,9.23L11.9,10.33L12.97,11.43C13.1,11.6 13.17,11.8 13.17,12A1,1 0 0,1 12.17,13C11.97,13 11.77,12.93 11.6,12.8L10.5,12.03L9.4,12.8C9.23,12.93 9.03,13 8.83,13A1,1 0 0,1 7.83,12C7.83,11.8 7.9,11.6 8.03,11.43L9.1,10.33L8.03,9.23C7.9,9.07 7.83,8.87 7.83,8.67A1,1 0 0,1 8.83,7.67Z"
								/>
							</svg>
							<!-- 愚人节版图标 - 笑脸图标代表趣味版本 -->
							<svg
								v-else-if="type === 'april_fools'"
								class="nav-icon"
								viewBox="0 0 24 24"
							>
								<path
									fill="currentColor"
									d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23M15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5C17,10.3 16.3,11 15.5,11Z"
								/>
							</svg>
							<span class="version-label">{{ getTabName(type) }}</span>
						</div>
						<span class="version-count">{{ count }}</span>
					</div>
				</button>
			</nav>

			<!-- 主内容区域 -->
			<div class="main-content">
				<!-- 搜索栏 -->
				<div class="search-bar">
					<div class="search-wrapper">
						<input
							v-model="searchQuery"
							type="text"
							placeholder="搜索版本..."
							class="search-input"
						/>
					</div>
				</div>

				<!-- 版本列表 -->
				<div class="version-list-container">
					<div v-if="loading" class="loading">加载中...</div>
					<div v-else-if="error" class="error">{{ error }}</div>
					<div v-else-if="filteredVersions.length === 0" class="no-results">
						没有找到匹配的版本
					</div>
					<div v-else class="version-list">
						<div
							v-for="(version, index) in filteredVersions"
							:key="version.id"
							class="version-item"
							:class="{ selected: selectedVersion === version.id }"
							:style="{ '--index': index }"
							@click="handleVersionClick(version)"
						>
							<div class="version-id">{{ version.id }}</div>
							<div class="version-info">
								<span class="version-type">{{
									getVersionTypeName(version.type)
								}}</span>
								<span class="version-date">{{ version.releaseTime }}</span>
							</div>
							<div class="version-actions">
								<button
									class="download-btn"
									@click.stop="startDownload(version.id, 'vanilla')"
								>
									下载
								</button>
								<router-link
									:to="`/download/${version.id}/more`"
									class="more-btn"
									@click.stop
								>
									更多选项
								</router-link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* 基础布局 */
.page-container {
	height: 100%;
	display: flex;
}

.download-container {
	display: flex;
	width: 100%;
	height: 100%;
}

/* 侧边栏样式 */
.version-sidebar {
	width: 200px;
	background: var(--surface-color);
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	border-right: 1px solid rgba(128, 128, 128, 0.1);
	box-shadow: 4px 0 16px rgba(0, 0, 0, 0.05);
	padding: 1rem 0;
}

/* 主内容区域 */
.main-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 2rem;
	gap: 1rem;
	background: var(--background-color);
}

/* 搜索栏 */
.search-bar {
	background: var(--surface-color);
	border-radius: 8px;
	padding: 0.5rem;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	margin-bottom: 1rem;
}

.search-wrapper {
	position: relative;
	display: flex;
	align-items: center;
}

.search-input {
	width: 100%;
	padding: 0.75rem 1rem;
	border: none;
	border-radius: 6px;
	background: var(--background-color);
	color: var(--text-color);
	font-size: 0.95rem;
	transition: all 0.3s ease;
}

/* 版本列表容器 */
.version-list-container {
	flex: 1;
	overflow-y: auto;
	padding: 1rem;
	height: calc(100vh - 160px);
	position: relative;
}

.version-list {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 0.5rem;
	position: relative;
	min-height: 200px;
}

/* 版本卡片基础样式 */
.version-item {
	background: var(--surface-color);
	border-radius: 12px;
	padding: 1rem 1.25rem;
	display: flex;
	align-items: center;
	gap: 1.5rem;
	position: relative;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	border: 1px solid rgba(var(--theme-color-rgb), 0.1);
	cursor: pointer;
	margin-top: -4px;
	will-change: transform, box-shadow, opacity;
	animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
	animation-delay: calc(var(--index) * 0.05s);
	transition:
		transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
		box-shadow 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
		border-color 0.3s ease;
}

@keyframes slideIn {
	0% {
		opacity: 0;
		transform: translateX(-50px) scale(0.9);
	}
	100% {
		opacity: 1;
		transform: translateX(0) scale(1);
	}
}

/* 卡片悬浮和选中效果 */
.version-item:hover {
	transform: translateX(-8px) scale(1.02);
	box-shadow: 0 8px 24px rgba(var(--theme-color-rgb), 0.15);
	z-index: 2;
}

.version-item.selected {
	transform: translateX(-16px) scale(1.03);
	box-shadow: 0 12px 32px rgba(var(--theme-color-rgb), 0.2);
	border-color: var(--theme-color);
	border-width: 2px;
	z-index: 3;
}

.version-item.selected:hover {
	transform: translateX(-20px) scale(1.04);
	box-shadow: 0 16px 40px rgba(var(--theme-color-rgb), 0.25);
}

/* 版本信息样式 */
.version-id {
	font-size: 1.1rem;
	font-weight: 500;
	color: var(--theme-color);
	min-width: 100px;
	transition: transform 0.3s ease;
}

.version-item.selected .version-id {
	transform: scale(1.05);
}

.version-info {
	flex: 1;
	display: flex;
	gap: 1rem;
	align-items: center;
	transition: transform 0.3s ease;
}

.version-item.selected .version-info {
	transform: translateX(4px);
}

.version-type {
	padding: 0.25rem 0.75rem;
	background: rgba(var(--theme-color-rgb), 0.1);
	color: var(--theme-color);
	border-radius: 8px;
	font-size: 0.9rem;
	transition: background-color 0.3s ease;
}

.version-item.selected .version-type {
	background: rgba(var(--theme-color-rgb), 0.2);
}

.version-date {
	color: var(--secondary-text);
	font-size: 0.9rem;
}

/* 按钮样式 */
.version-actions {
	display: flex;
	gap: 0.5rem;
	opacity: 0.8;
	transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.version-item:hover .version-actions {
	opacity: 1;
	transform: scale(1.02);
}

.version-item.selected .version-actions {
	opacity: 1;
	transform: scale(1.05);
}

.download-btn,
.more-btn {
	padding: 0.5rem 1rem;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 0.9rem;
	transition: all 0.3s ease;
	white-space: nowrap;
}

.download-btn {
	background: var(--theme-color);
	color: white;
}

.download-btn:hover {
	filter: brightness(1.1);
}

.more-btn {
	background: rgba(var(--theme-color-rgb), 0.1);
	color: var(--theme-color);
	text-decoration: none;
}

.more-btn:hover {
	background: rgba(var(--theme-color-rgb), 0.15);
}

/* 侧边栏按钮样式 */
.version-nav-btn {
	padding: 0.75rem 2rem;
	border: none;
	background: transparent;
	color: var(--text-color);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 0.95rem;
	position: relative;
	overflow: hidden;
	transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.version-nav-btn::before {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: var(--theme-color);
	opacity: 0;
	transition: opacity 0.3s ease;
	z-index: 0;
}

.version-nav-btn:hover::before {
	opacity: 0.1;
}

.version-nav-btn.active::before {
	opacity: 1;
}

.version-nav-btn:hover {
	transform: translateX(8px);
}

.version-nav-btn.active {
	color: white;
	transform: translateX(8px);
}

/* 按钮内容布局 */
.btn-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	position: relative;
	z-index: 1;
}

.icon-label {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	flex: 1;
}

/* 图标样式 */
.nav-icon {
	width: 1.25rem;
	height: 1.25rem;
	transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	flex-shrink: 0;
}

.version-nav-btn:hover .nav-icon {
	transform: scale(1.2) rotate(5deg);
}

.version-nav-btn.active .nav-icon {
	transform: scale(1.2);
	filter: brightness(1.2);
}

/* 版本标签和计数 */
.version-label,
.version-count {
	position: relative;
	z-index: 1;
}

.version-count {
	background: rgba(var(--theme-color-rgb), 0.1);
	padding: 0.2rem 0.6rem;
	border-radius: 12px;
	font-size: 0.85rem;
}

.version-nav-btn.active .version-count {
	background: rgba(255, 255, 255, 0.2);
}

/* 列表动画 */
.version-list-enter-active,
.version-list-leave-active {
	transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	position: absolute;
	width: 100%;
}

.version-list-enter-from {
	opacity: 0;
	transform: translateX(-30px);
}

.version-list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}

.version-list-move {
	transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 滚动条样式 */
.version-list-container::-webkit-scrollbar {
	width: 8px;
}

.version-list-container::-webkit-scrollbar-track {
	background: transparent;
}

.version-list-container::-webkit-scrollbar-thumb {
	background: rgba(var(--theme-color-rgb), 0.2);
	border-radius: 4px;
}

.version-list-container::-webkit-scrollbar-thumb:hover {
	background: rgba(var(--theme-color-rgb), 0.3);
}
</style>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { downloadManager } from '../services/DownloadManager';

// 版本类型和计数
const currentCategory = ref('release');
const versionCounts = ref({
	release: 91,
	snapshot: 631,
	old_alpha: 61,
	april_fools: 8,
});

// 搜索和版本表态
const searchQuery = ref('');
const versions = ref([]);
const loading = ref(true);
const error = ref(null);

// 下载状态
const isDownloading = ref(false);
const currentDownload = ref({
	version: '',
	type: '',
});

// 获取版本类型的显示名称
const getTabName = (type) => {
	const names = {
		release: '正式版',
		snapshot: '预览版',
		old_alpha: '远古版',
		april_fools: '愚人节版本',
	};
	return names[type];
};

// 获取版本类型的显示名称
const getVersionTypeName = (type) => {
	const typeNames = {
		release: '正式版',
		snapshot: '快照版',
		pre_release: '预发布版',
		release_candidate: '候选版',
		old_alpha: '远古版本(Alpha)',
		old_beta: '远古版本(Beta)',
		april_fools: '愚人节版本',
	};
	return typeNames[type] || type;
};

// 修改版本匹配逻辑
const isVersionMatch = (version) => {
	const releaseDate = new Date(version.releaseTime);
	const isAprilFools = releaseDate.getMonth() === 3 && releaseDate.getDate() === 1;

	// 如果是愚人节版本，优先归类到愚人节分类
	if (currentCategory.value === 'april_fools') {
		return isAprilFools;
	}

	// 如果是愚人节版本，在其他分类中不显示
	if (isAprilFools) {
		return false;
	}

	switch (currentCategory.value) {
		case 'release':
			return version.type === 'release';
		case 'snapshot':
			return (
				version.type === 'snapshot' ||
				version.type === 'pre_release' ||
				version.type === 'release_candidate'
			);
		case 'old_alpha':
			return (
				version.type === 'old_alpha' ||
				version.type === 'old_beta' ||
				version.id.toLowerCase().startsWith('a') ||
				version.id.toLowerCase().startsWith('b')
			);
		default:
			return true;
	}
};

// 过滤版本列表
const filteredVersions = computed(() => {
	const filtered = versions.value
		.filter((version) => isVersionMatch(version))
		.filter((version) => version.id.toLowerCase().includes(searchQuery.value.toLowerCase()));
	return filtered;
});

// 获取版本列表
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

		updateVersionCounts();
	} catch (err) {
		error.value = '获取版本列表失败: ' + err.message;
		console.error('Error fetching versions:', err);
	} finally {
		loading.value = false;
	}
};

// 更新版本计数逻辑
const updateVersionCounts = () => {
	const counts = {
		release: 0,
		snapshot: 0,
		old_alpha: 0,
		april_fools: 0,
	};

	versions.value.forEach((version) => {
		const releaseDate = new Date(version.releaseTime);
		const isAprilFools = releaseDate.getMonth() === 3 && releaseDate.getDate() === 1;

		if (isAprilFools) {
			counts.april_fools++;
			return; // 愚人节版本只计入愚人节分类
		}

		if (version.type === 'release') {
			counts.release++;
		} else if (
			version.type === 'snapshot' ||
			version.type === 'pre_release' ||
			version.type === 'release_candidate'
		) {
			counts.snapshot++;
		} else if (
			version.type === 'old_alpha' ||
			version.type === 'old_beta' ||
			version.id.toLowerCase().startsWith('a') ||
			version.id.toLowerCase().startsWith('b')
		) {
			counts.old_alpha++;
		}
	});

	versionCounts.value = counts;
};

// 开始下载
const startDownload = (version, type) => {
	isDownloading.value = true;
	currentDownload.value = { version, type };
	downloadManager.startDownload(version, type);
};

// 取消下载
const cancelDownload = () => {
	isDownloading.value = false;
	currentDownload.value = { version: '', type: '' };
	downloadManager.cancelDownload();
};

// 初始化
fetchVersions();

// 添加动画状态控制
const isAnimating = ref(false);

// 修改版本切换处理
const handleCategoryChange = async (type) => {
	if (currentCategory.value === type) return;
	currentCategory.value = type;

	// 重置滚动位置
	const container = document.querySelector('.version-list-container');
	if (container) {
		container.scrollTop = 0;
	}

	// 触发重新动画
	versions.value = [...versions.value];
};

// 添加选中状态
const selectedVersion = ref(null);

// 修改版本点击处理
const handleVersionClick = (version) => {
	selectedVersion.value = version.id === selectedVersion.value ? null : version.id;
};
</script>
