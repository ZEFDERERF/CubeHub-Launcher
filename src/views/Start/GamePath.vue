<template>
  <div class="game-path-container">
    <h1 class="title">游戏目录设置</h1>
    <div class="settings-box">
      <div class="form-group">
        <label>游戏目录</label>
        <div class="input-group">
          <input 
            type="text" 
            v-model="gamePath"
            placeholder="请选择游戏目录"
            readonly
          >
          <button class="browse-button" @click="selectGamePath">
            浏览
          </button>
        </div>
        <p class="path-info">
          默认目录：{{ defaultGamePath }}
        </p>
      </div>

      <div class="storage-info">
        <h3>存储信息</h3>
        <div class="storage-bar">
          <div 
            class="storage-used"
            :style="{ width: `${storageUsedPercent}%` }"
          ></div>
        </div>
        <p>可用空间：{{ availableStorage }}GB</p>
        <p>建议预留至少 2GB 空间用于游戏文件</p>
      </div>
    </div>

    <div class="actions">
      <button class="back-button" @click="router.push('/start/java')">
        返回
      </button>
      <button 
        class="next-button"
        :disabled="!canProceed"
        @click="handleNext"
      >
        完成设置
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { configManager } from '../../utils/config'

const router = useRouter()
const gamePath = ref('')
const defaultGamePath = ref('C:\\Users\\Username\\AppData\\Roaming\\.minecraft')
const availableStorage = ref(100) // GB
const totalStorage = ref(500) // GB

const storageUsedPercent = computed(() => {
  return ((totalStorage.value - availableStorage.value) / totalStorage.value) * 100
})

const canProceed = computed(() => {
  return true  // 暂时允许跳过游戏路径设置
})

const selectGamePath = async () => {
  // 使用 Tauri 的文件选择 API
  gamePath.value = defaultGamePath.value // 示例路径
  // 如果用户没有选择，使用默认路径
  if (!gamePath.value) {
    gamePath.value = defaultGamePath.value
  }
}

const handleNext = async () => {
  if (canProceed.value) {
    await configManager.updateConfig('game', {
      directory: gamePath.value
    })
    router.push('/start/complete')
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'CubeHub';
  src: url('../../assets/Fonts/Font.ttf') format('truetype');
}

.game-path-container {
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
  gap: 1rem;
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

.browse-button {
  padding: 0 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'CubeHub', sans-serif;
}

.path-info {
  margin-top: 0.5rem;
  color: var(--secondary-text-color);
  font-size: 0.9rem;
}

.storage-info {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.storage-info h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.storage-bar {
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.storage-used {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.storage-info p {
  color: var(--secondary-text-color);
  margin-bottom: 0.5rem;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-button,
.next-button {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'CubeHub', sans-serif;
  transition: all 0.3s;
}

.back-button {
  background: var(--border-color);
  color: var(--text-color);
}

.next-button {
  background: var(--primary-color);
  color: white;
}

.next-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-button:hover,
.next-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style> 