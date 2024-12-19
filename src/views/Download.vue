<template>
  <div class="download-container">
    <DownloadProgress
      v-if="isDownloading"
      :version="currentDownload.version"
      :isDownloading="isDownloading"
      @cancel="cancelDownload"
    />
    <div class="top-section">
      <div class="top-bar">
        <nav class="version-nav">
          <div class="version-tabs">
            <button 
              v-for="(count, type) in versionCounts" 
              :key="type"
              class="version-tab"
              :class="{ active: currentCategory === type }"
              @click="currentCategory = type"
            >
              {{ getTabName(type) }} ({{ count }})
            </button>
          </div>
        </nav>
        
        <div class="search-bar">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索版本..."
            class="search-input"
          />
        </div>
      </div>
    </div>

    <div class="version-list-container" ref="versionListRef">
      <div v-if="loading" class="loading">
        正在加载版本列表...
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      <div v-else-if="filteredVersions.length === 0" class="no-results">
        没有找到匹配的版本
      </div>
      <div v-else class="version-items">
        <div v-for="version in filteredVersions" 
             :key="version.id" 
             class="version-item">
          <div class="version-info">
            <h3>{{ version.id }}</h3>
            <div class="version-meta">
              <span class="version-type" :class="version.type">
                {{ getVersionTypeName(version.type) }}
              </span>
              <span class="version-date">{{ version.releaseTime }}</span>
            </div>
          </div>
          <div class="version-actions">
            <button class="download-btn" @click="startDownload(version.id, 'vanilla')">
              下载
            </button>
            <router-link 
              :to="`/download/${version.id}/more`"
              class="more-btn"
            >
              更多选项
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { downloadManager } from '../services/DownloadManager'
import DownloadProgress from '../components/DownloadProgress.vue'

const currentCategory = ref('release')
const searchQuery = ref('')
const versions = ref([])
const loading = ref(true)
const error = ref(null)
const versionListRef = ref(null)
const isDownloading = ref(false)
const currentDownload = ref({
  version: '',
  type: ''
})

// 获取版本类型的显示名称
const getVersionTypeName = (type) => {
  const typeNames = {
    release: '正式版',
    snapshot: '快照版',
    pre_release: '预发布版',
    release_candidate: '候选版',
    old_alpha: '远古版本(Alpha)',
    old_beta: '远古版本(Beta)'
  }
  return typeNames[type] || type
}

const getTabName = (type) => {
  const names = {
    release: '正式版',
    snapshot: '预览版',
    old: '远古版本'
  }
  return names[type] || type
}

// 从 Mojang API 获取数据
const fetchVersions = async () => {
  try {
    loading.value = true
    const response = await fetch('https://piston-meta.mojang.com/mc/game/version_manifest_v2.json')
    if (!response.ok) throw new Error('Failed to fetch versions')
    
    const data = await response.json()
    console.log('Fetched versions:', data.versions)
    
    versions.value = data.versions.map(v => ({
      id: v.id,
      type: v.type,
      releaseTime: new Date(v.releaseTime).toLocaleString('zh-CN', { hour12: false }),
      url: v.url
    }))
    
    console.log('Processed versions:', versions.value)
  } catch (err) {
    error.value = '获取版本列表失败: ' + err.message
    console.error('Error fetching versions:', err)
  } finally {
    loading.value = false
  }
}

// 计算版本数量
const versionCounts = computed(() => {
  const counts = { release: 0, snapshot: 0, old: 0 }
  versions.value.forEach(version => {
    const mainVersion = parseFloat(version.id.split('.')[0])
    if (version.type === 'release' && mainVersion >= 1) {
      counts.release++
    } else if ((version.type === 'snapshot' || version.type === 'pre_release' || 
               version.type === 'release_candidate') && mainVersion >= 1) {
      counts.snapshot++
    } else if (mainVersion < 1 || version.type === 'old_alpha' || 
               version.type === 'old_beta') {
      counts.old++
    }
  })
  return counts
})

// 版本匹配逻辑
const isVersionMatch = (version) => {
  const mainVersion = parseFloat(version.id.split('.')[0])
  
  switch (currentCategory.value) {
    case 'release':
      return version.type === 'release' && mainVersion >= 1
    case 'snapshot':
      return (version.type === 'snapshot' || 
              version.type === 'pre_release' || 
              version.type === 'release_candidate') && mainVersion >= 1
    case 'old':
      return mainVersion < 1 || 
             version.type === 'old_alpha' || 
             version.type === 'old_beta'
    default:
      return true
  }
}

// 过滤版本列表
const filteredVersions = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return versions.value.filter(version => 
    version.id.toLowerCase().includes(query) && 
    isVersionMatch(version)
  )
})

// 滚动到顶部
const scrollToTop = () => {
  if (versionListRef.value) {
    versionListRef.value.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

// 监听分类和搜索变化
watch([currentCategory, searchQuery], async () => {
  await nextTick()
  scrollToTop()
})

// 初始化
onMounted(async () => {
  await fetchVersions()
})

// 下载相关方法
const startDownload = async (version, type) => {
  try {
    isDownloading.value = true
    currentDownload.value = { version, type }
    await downloadManager.downloadVersion(version, type)
  } catch (error) {
    console.error('下载失败:', error)
  } finally {
    isDownloading.value = false
  }
}

const cancelDownload = () => {
  downloadManager.cancelDownload(currentDownload.value.version)
  isDownloading.value = false
}
</script>

<style scoped>
.download-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--background-color);
  position: relative;
}

.top-section {
  padding: 1.5rem;
  padding-bottom: 0;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.5rem;
  background: rgba(128, 128, 128, 0.1);
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  position: relative;
}

.version-nav {
  display: flex;
  gap: 8px;
  width: fit-content;
  animation: navSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  margin-right: auto;
}

.version-tab {
  padding: 0.75rem 1.25rem;
  text-decoration: none;
  color: var(--text-color);
  font-size: 0.95rem;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: transparent;
  font-weight: 500;
  border: none;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.version-tab:hover:not(.active) {
  background: rgba(128, 128, 128, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.version-tab.active {
  background: var(--theme-color);
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(var(--theme-color-rgb), 0.3);
}

.version-tab.active:hover {
  background: var(--theme-color);
  filter: brightness(1.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--theme-color-rgb), 0.4);
}

.router-view-wrapper {
  position: relative;
  flex: 1;
  overflow: hidden;
}

/* 动画相关样式 */
.version-tab-enter-active,
.version-tab-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
  will-change: opacity, transform;
}

.version-tab-enter-from,
.version-tab-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.version-list-enter-active,
.version-list-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
  will-change: opacity, transform;
}

.version-list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.version-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

@keyframes containerFadeIn {
  from { 
    opacity: 0;
    transform: translateZ(0);
  }
  to { 
    opacity: 1;
    transform: translateZ(0);
  }
}

@keyframes navSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.version-list-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 1.5rem;
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
  background: var(--background-color);
  scroll-behavior: smooth;
  transform: translateZ(0);
  perspective: 1000px;
  backface-visibility: hidden;
}

/* 自定义滚动条样式 */
.version-list-container::-webkit-scrollbar {
  width: 6px;
}

.version-list-container::-webkit-scrollbar-track {
  background: rgba(128, 128, 128, 0.05);
  border-radius: 4px;
  margin: 2px;
}

.version-list-container::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 4px;
  transition: all 0.3s ease;
  min-height: 40px;
}

.version-list-container::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
}

.version-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transform: translateZ(0);
  will-change: transform;
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
  position: relative;
  z-index: 1;
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
  animation: itemSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) backwards;
}

.version-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.2);
  background: var(--surface-color);
}

.version-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.version-info h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-display: swap;
}

.version-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.version-type {
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: capitalize;
  background: rgba(128, 128, 128, 0.15);
  color: var(--text-color);
}

.version-type.release {
  background: rgba(76, 175, 80, 0.15);
  color: #4CAF50;
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

.version-type.pre_release,
.version-type.release_candidate {
  background: rgba(255, 152, 0, 0.15);
  color: #ff9800;
}

.version-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
  flex-shrink: 0;
}

.download-btn,
.more-btn {
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.download-btn {
  background: var(--theme-color);
  color: white;
}

.more-btn {
  background: rgba(128, 128, 128, 0.1);
  color: var(--text-color);
  text-decoration: none;
}

.download-btn:hover {
  filter: brightness(1.1);
}

.more-btn:hover {
  background: rgba(128, 128, 128, 0.2);
}

.search-bar {
  position: relative;
  min-width: 300px;
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem;
  background: var(--surface-color);
  border-radius: 8px;
  font-size: 1rem;
  color: var(--text-color);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  border: 1px solid rgba(128, 128, 128, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgba(128, 128, 128, 0.1);
  }
}

.search-input:focus {
  outline: none;
  border-color: var(--theme-color);
  background: var(--surface-color);
  box-shadow: 0 6px 20px rgba(var(--theme-color-rgb), 0.25);
  transform: translateY(-1px);
}

.search-input::placeholder {
  color: var(--secondary-text);
}

.search-bar::before {
  content: '';
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  opacity: 0.5;
  pointer-events: none;
  transition: all 0.3s ease;
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.search-bar:focus-within::before {
  opacity: 0.7;
}

@media (max-width: 768px) {
  .top-bar {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .search-bar {
    position: relative;
    left: auto;
    transform: none;
    width: 100%;
  }
  
  .version-nav {
    margin-right: 0;
    width: 100%;
    justify-content: center;
  }
}

/* 调整加载和错误状态的阴影 */
.loading, .error {
  text-align: center;
  padding: 2rem;
  color: var(--secondary-text);
  background: var(--surface-color);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* 页面切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
  will-change: opacity, transform;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 添加版本标签的样式 */
.version-tabs {
  display: flex;
  gap: 0.5rem;
}
</style> 