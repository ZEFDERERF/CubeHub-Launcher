<template>
  <div id="app" :data-theme="currentTheme">
    <TitleBar :theme="theme" />
    <div class="app-container">
      <div class="background-image"></div>
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import TitleBar from './components/TitleBar.vue'

const theme = ref({
  isRGBMode: false,
  isDarkMode: false,
  currentColor: '#4CAF50',
  currentTheme: 'light'
})

// 提供主题给所有子组件
provide('theme', theme)

// 监听主题变化
const updateTheme = (newTheme) => {
  theme.value = { ...theme.value, ...newTheme }
  document.documentElement.style.setProperty('--theme-color', theme.value.currentColor)
  document.documentElement.setAttribute('data-theme', theme.value.currentTheme)
}

// 初始化主题
updateTheme(theme.value)
</script>

<style>
:root {
  --theme-color: #4CAF50;
  --theme-color-light: #81C784;
  --theme-color-dark: #2E7D32;
  --background-color: #1a1a1a;
  --surface-color: #2d2d2d;
  --text-color: #ffffff;
  --secondary-text: rgba(255, 255, 255, 0.7);
  --window-border-radius: 8px;
}

/* 亮色主题 */
[data-theme="light"] {
  --background-color: #f5f5f5;
  --surface-color: #ffffff;
  --text-color: #333333;
  --secondary-text: rgba(0, 0, 0, 0.7);
}

#app {
  border-radius: var(--window-border-radius, 8px);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  background: var(--background-color);
  color: var(--text-color);
  overflow: hidden !important;
  position: relative;
  transition: background-color 0.3s ease, color 0.3s ease;
}

html, body {
  overflow: hidden !important;
  height: 100vh;
}

.app-container {
  padding-top: 48px;
  height: calc(100vh - 48px);
  overflow: auto;
  position: relative;
  z-index: 1;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  z-index: -1;
  transition: opacity 0.3s ease;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style> 
