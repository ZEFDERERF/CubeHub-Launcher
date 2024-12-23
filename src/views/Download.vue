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
              <!-- 正式版图标 -->
              <svg v-if="type === 'release'" class="nav-icon" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17 15.245v6.872a.5.5 0 0 1-.757.429L12 20l-4.243 2.546a.5.5 0 0 1-.757-.43v-6.87a8 8 0 1 1 10 0M12 15a6 6 0 1 0 0-12a6 6 0 0 0 0 12m0-2a4 4 0 1 1 0-8a4 4 0 0 1 0 8"/>
              </svg>
              <!-- 预览版图标 -->
              <svg v-else-if="type === 'snapshot'" class="nav-icon" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17 15.245v6.872a.5.5 0 0 1-.757.429L12 20l-4.243 2.546a.5.5 0 0 1-.757-.43v-6.87a8 8 0 1 1 10 0M9 16.42v3.049l3-1.8l3 1.8v-3.05A8 8 0 0 1 12 17a8 8 0 0 1-3-.581M12 15a6 6 0 1 0 0-12a6 6 0 0 0 0 12"/>
              </svg>
              <!-- 远古版图标 -->
              <svg v-else-if="type === 'old_alpha'" class="nav-icon" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 3.107a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1zm-8.811 10.158L5 14.355v4.752h7.218zM19 5.107h-7.219l2.468 14H19zm-9.25 0H5v7.218l5.842-1.03z"/>
              </svg>
              <!-- 愚人节版图标 -->
              <svg v-else-if="type === 'april_fools'" class="nav-icon" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16m-4-7h8a4 4 0 0 1-8 0m0-2a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m8 0a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3"/>
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
          <div v-if="loading" class="loading-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" class="loading-svg">
              <path
                fill="none"
                stroke="currentColor"
                stroke-dasharray="16"
                stroke-dashoffset="16"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3c4.97 0 9 4.03 9 9"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.2s"
                  values="16;0"
                />
                <animateTransform
                  attributeName="transform"
                  dur="1.5s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;360 12 12"
                />
              </path>
            </svg>
            <span class="loading-text">正在加载版本列表...</span>
          </div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else-if="filteredVersions.length === 0" class="no-results">
            没有找到匹配的版本
          </div>
          <div
            v-else
            class="version-list"
          >
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
                <span class="version-type">{{ getVersionTypeName(version.type) }}</span>
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

<style lang="scss" scoped>
$animation-curve: cubic-bezier(0.34, 1.56, 0.64, 1);

.page-container {
	height: 100%;
	display: flex;
}

.download-container {
	display: flex;
	width: 100%;
	height: 100%;
}

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

.main-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 2rem;
	gap: 1rem;
	background: var(--background-color);
}

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
  animation: slideIn 0.5s $animation-curve backwards;
  animation-delay: calc(var(--index) * 0.05s);
  transition: transform 0.5s $animation-curve,
              box-shadow 0.5s $animation-curve,
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

.version-actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0.8;
  transition: all 0.3s $animation-curve;
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
  transition: all 0.3s $animation-curve;

  &::before {
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

  &:hover {
    transform: translateX(8px);

    &::before {
      opacity: 0.1;
    }
  }

  &.active {
    color: white;
    transform: translateX(8px);

    &::before {
      opacity: 1;
    }

    // 发光效果
    box-shadow:
      0 0 20px rgba(var(--theme-color-rgb), 0.3),
      0 0 40px rgba(var(--theme-color-rgb), 0.1),
      inset 0 0 10px rgba(255, 255, 255, 0.2);

    // 内部光晕
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.1),
        rgba(255, 255, 255, 0.2)
      );
      z-index: 1;
      opacity: 0.5;
    }

    .version-count {
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
    }

    .nav-icon {
      filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
    }
  }
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
  z-index: 2;
}

.icon-label {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	flex: 1;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: all 0.3s $animation-curve;
  flex-shrink: 0;
}

.version-nav-btn:hover .nav-icon {
	transform: scale(1.2) rotate(5deg);
}

.version-nav-btn.active .nav-icon {
	transform: scale(1.2);
	filter: brightness(1.2);
}

.version-label,
.version-count {
  position: relative;
  z-index: 2;
}

.version-count {
  background: rgba(var(--theme-color-rgb), 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

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

.version-list-enter-active,
.version-list-leave-active {
  transition: all 0.3s $animation-curve;
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
  transition: transform 0.5s $animation-curve;
}

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

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 2rem;
  color: var(--theme-color);
  animation: fadeIn 0.3s ease;
}

.loading-svg {
  color: var(--theme-color);
  opacity: 0.8;
  filter: drop-shadow(0 0 8px rgba(var(--theme-color-rgb), 0.3));
}

.loading-text {
  font-size: 1.1rem;
  color: var(--text-color);
  opacity: 0.8;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.5;
  }
}

/* 错误状态样式 */
.error {
  text-align: center;
  padding: 2rem;
  color: #ff4d4f;
  font-size: 1.1rem;
  background: rgba(255, 77, 79, 0.1);
  border-radius: 12px;
  margin: 2rem;
  animation: fadeIn 0.3s ease;
}

/* 无结果状态样式 */
.no-results {
  text-align: center;
  padding: 2rem;
  color: var(--text-color);
  font-size: 1.1rem;
  background: rgba(var(--theme-color-rgb), 0.1);
  border-radius: 12px;
  margin: 2rem;
  animation: fadeIn 0.3s ease;
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { downloadManager } from '../services/downloadManager'

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
