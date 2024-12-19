<template>
  <div class="home-container">
    <div class="welcome-section">
      <h1>欢迎使用 CubeHub Launcher</h1>
      <p>一个现代化的 Minecraft 启动器</p>
      <div class="version-badge">
        您正在使用 CubeHub Launcher Beta 版
      </div>
    </div>

    <div class="quick-actions">
      <div class="action-card">
        <h3>快速开始</h3>
        <button class="action-button" @click="startGame">
          启动游戏
        </button>
      </div>

      <div class="action-card">
        <h3>最近游戏</h3>
        <div class="recent-list" v-if="recentVersions.length">
          <div v-for="version in recentVersions" :key="version.id" class="recent-item">
            <span class="version-name">{{ version.name }}</span>
            <span class="version-time">{{ version.lastPlayed }}</span>
          </div>
        </div>
        <p v-else class="empty-text">暂无游戏记录</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const recentVersions = ref([])

const startGame = () => {
  // 实现启动游戏的逻辑
  console.log('启动游戏')
}
</script>

<style scoped>
.home-container {
  padding: 1.5rem;
  background: var(--background-color);
  height: calc(100vh - 48px);
  position: relative;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
  padding-top: 15vh;
  position: fixed;
  width: calc(100% - 3rem);
  top: 48px;
  left: 1.5rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: var(--surface-color);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.welcome-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.2);
}

.welcome-section h1 {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  color: var(--text-color);
}

.welcome-section p {
  font-size: 1.2rem;
  color: var(--secondary-text);
  margin-bottom: 0.75rem;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem;
  padding: 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  height: 160px;
  overflow: hidden;
}

.action-card {
  background: var(--surface-color);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  border: 1px solid rgba(128, 128, 128, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.2);
}

.action-card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
  font-size: 1.2rem;
}

.action-button {
  width: 100%;
  padding: 0.75rem;
  background: var(--theme-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(var(--theme-color-rgb), 0.3);
}

.action-button:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--theme-color-rgb), 0.4);
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: hidden;
  flex: 1;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--surface-color);
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid rgba(128, 128, 128, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.recent-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.version-name {
  color: var(--text-color);
  font-weight: 500;
}

.version-time {
  color: var(--secondary-text);
  font-size: 0.9rem;
}

.empty-text {
  color: var(--secondary-text);
  text-align: center;
  padding: 1rem;
  background: var(--surface-color);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.version-badge {
  font-size: 0.9rem;
  color: #ff9800;
  background: rgba(255, 152, 0, 0.1);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  display: inline-block;
  margin-top: 0.75rem;
  border: 1px solid rgba(255, 152, 0, 0.2);
  backdrop-filter: blur(4px);
  animation: badgeFadeIn 0.6s ease-out forwards;
  position: relative;
}

.version-badge::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: rgba(255, 152, 0, 0.1);
  border-radius: 22px;
  z-index: -1;
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.02);
  }
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
}

@keyframes badgeFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.recent-item:nth-child(n+4) {
  display: none;
}
</style> 