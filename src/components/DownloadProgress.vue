<template>
  <div class="download-progress" v-if="isDownloading">
    <div class="progress-card">
      <div class="progress-header">
        <h3>{{ version }} 安装</h3>
        <button class="close-btn" @click="handleCancel">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      <div class="progress-content">
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: `${totalProgress}%` }"></div>
        </div>
        <div class="progress-info">
          <span class="progress-percentage">{{ totalProgress.toFixed(2) }}%</span>
          <span class="download-speed">{{ downloadSpeed }}</span>
        </div>
        
        <div class="task-list">
          <div v-for="(task, index) in tasks" :key="index" class="task-item">
            <span class="task-status" :class="task.status">
              <svg v-if="task.status === 'completed'" viewBox="0 0 24 24" width="16" height="16">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
              </svg>
              <span v-else-if="task.status === 'downloading'" class="loading-dot"></span>
              <span v-else>•</span>
            </span>
            <span class="task-name">{{ task.name }}</span>
            <span class="task-progress" v-if="task.status === 'downloading'">
              {{ task.progress }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  version: string
  isDownloading: boolean
}>()

const emit = defineEmits(['cancel'])

const tasks = ref<Array<{
  name: string
  status: 'pending' | 'downloading' | 'completed' | 'error'
  progress: number
}>>([
  { name: '下载原版 json 文件', status: 'completed', progress: 100 },
  { name: '下载原版支持库文件', status: 'downloading', progress: 0 },
  { name: '下载原版资源文件', status: 'pending', progress: 0 },
  { name: '安装游戏', status: 'pending', progress: 0 }
])

const totalProgress = computed(() => {
  const completed = tasks.value.filter(t => t.status === 'completed').length
  const downloading = tasks.value.find(t => t.status === 'downloading')
  return (completed * 100 + (downloading?.progress || 0)) / tasks.value.length
})

const downloadSpeed = ref('23.1 K/s')

const handleCancel = () => {
  if (confirm('确定要取消下载吗？')) {
    emit('cancel')
  }
}

const updateTaskProgress = (taskIndex: number, progress: number) => {
  if (tasks.value[taskIndex]) {
    tasks.value[taskIndex].progress = progress
    if (progress >= 100) {
      tasks.value[taskIndex].status = 'completed'
      startNextTask()
    }
  }
}

const startNextTask = () => {
  const nextTask = tasks.value.find(task => task.status === 'pending')
  if (nextTask) {
    nextTask.status = 'downloading'
  }
}
</script>

<style scoped>
.download-progress {
  position: fixed;
  top: var(--titlebar-height);
  right: 20px;
  width: 400px;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.progress-card {
  background: var(--background-color);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--text-color);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-color);
  opacity: 0.7;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

.progress-content {
  padding: 16px;
}

.progress-bar-container {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  background: var(--theme-color);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--text-color);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-color);
}

.task-status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}

.task-status.completed {
  color: #4CAF50;
}

.task-status.downloading {
  color: var(--theme-color);
}

.loading-dot {
  width: 8px;
  height: 8px;
  background: currentColor;
  border-radius: 50%;
  animation: pulse 1s infinite;
}

.task-name {
  flex: 1;
  opacity: 0.8;
}

.task-progress {
  min-width: 45px;
  text-align: right;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.5; }
}
</style> 