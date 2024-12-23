<template>
  <div class="titlebar" data-tauri-drag-region :style="titlebarStyle">
    <div class="resize-handle top"></div>
    <div class="resize-handle right"></div>
    <div class="resize-handle bottom"></div>
    <div class="resize-handle left"></div>
    <div class="resize-handle top-left"></div>
    <div class="resize-handle top-right"></div>
    <div class="resize-handle bottom-left"></div>
    <div class="resize-handle bottom-right"></div>
    <div class="titlebar-left" data-tauri-drag-region>
      <div class="title-section">
        <h1>
          CHL
        </h1>
        <svg class="logo-icon" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path stroke-dasharray="64" stroke-dashoffset="64" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">
              <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/>
            </path>
            <path stroke-dasharray="8" stroke-dashoffset="8" d="M12 12h-5.5">
              <animate fill="freeze" attributeName="stroke-dashoffset" begin="1.3s" dur="0.2s" values="8;0"/>
              <animateTransform attributeName="transform" begin="1.3s" dur="15s" repeatCount="indefinite" type="rotate" values="0 12 12;15 12 12;165 12 12;65 12 12;115 12 12;165 12 12;165 12 12;165 12 12;90 12 12;115 12 12;115 12 12;15 12 12;0 12 12"/>
            </path>
          </g>
          <g fill="currentColor">
            <path fill-opacity="0" d="M12 21C9.41 21 7.15 20.79 5.94 19L12 21L18.06 19C16.85 20.79 14.59 21 12 21Z">
              <animate fill="freeze" attributeName="d" begin="0.6s" dur="0.4s" values="M12 21C9.41 21 7.15 20.79 5.94 19L12 21L18.06 19C16.85 20.79 14.59 21 12 21Z;M12 16C9.41 16 7.15 17.21 5.94 19L12 21L18.06 19C16.85 17.21 14.59 16 12 16Z"/>
              <set fill="freeze" attributeName="fill-opacity" begin="0.6s" to="1"/>
            </path>
            <circle cx="7" cy="12" r="0" transform="rotate(15 12 12)">
              <animate fill="freeze" attributeName="r" begin="0.9s" dur="0.2s" values="0;1"/>
            </circle>
            <circle cx="7" cy="12" r="0" transform="rotate(65 12 12)">
              <animate fill="freeze" attributeName="r" begin="0.95s" dur="0.2s" values="0;1"/>
            </circle>
            <circle cx="7" cy="12" r="0" transform="rotate(115 12 12)">
              <animate fill="freeze" attributeName="r" begin="1s" dur="0.2s" values="0;1"/>
            </circle>
            <circle cx="7" cy="12" r="0" transform="rotate(165 12 12)">
              <animate fill="freeze" attributeName="r" begin="1.05s" dur="0.2s" values="0;1"/>
            </circle>
            <circle cx="12" cy="12" r="0">
              <animate fill="freeze" attributeName="r" begin="1.3s" dur="0.2s" values="0;2"/>
            </circle>
          </g>
        </svg>
      </div>
    </div>

    <div class="titlebar-center">
      <nav class="nav-links">
        <a 
          class="nav-link" 
          :class="{ 'router-link-active': currentPath === '/' }"
          @click="navigateTo('/')"
        >
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"/>
            <path d="M9 22V12h6v10" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"/>
          </svg>
          <span class="nav-text">开始</span>
        </a>
        <a 
          class="nav-link" 
          :class="{ 'router-link-active': currentPath.startsWith('/download') }"
          @click="navigateTo('/download')"
        >
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"/>
            <path d="M7 10l5 5 5-5" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"/>
            <path d="M12 15V3" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"/>
          </svg>
          <span class="nav-text">下载</span>
        </a>
        <a 
          class="nav-link" 
          :class="{ 'router-link-active': currentPath === '/settings' }"
          @click="navigateTo('/settings')"
        >
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"/>
          </svg>
          <span class="nav-text">设置</span>
        </a>
      </nav>
    </div>

    <div class="titlebar-controls">
      <button class="titlebar-button" @click="minimize">
        <svg width="10" height="2" viewBox="0 0 10 2">
          <path d="M0 0h10v1H0z" fill="currentColor" />
        </svg>
      </button>
      <button class="titlebar-button" @click="toggleMaximize">
        <svg v-if="!isMaximized" width="10" height="10" viewBox="0 0 10 10">
          <path d="M0 0v10h10V0H0zm1 1h8v8H1V1z" fill="currentColor" />
        </svg>
        <svg v-else width="10" height="10" viewBox="0 0 10 10">
          <path d="M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z" fill="currentColor" />
        </svg>
      </button>
      <button class="titlebar-button close" @click="close">
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M0 0l10 10m0-10L0 10" stroke="currentColor" stroke-width="1.5" />
        </svg>
      </button>
    </div>
    <div class="titlebar-color-layer"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 定义 emit
const emit = defineEmits(['update-background'])

const route = useRoute()
const router = useRouter()
const isMaximized = ref(false)
const currentThemeColor = ref('')
const currentPath = computed(() => route.path)

// Props 定义
const props = defineProps({
  theme: {
    type: Object,
    required: true,
    default: () => ({
      isRGBMode: false,
      isDarkMode: false,
      currentColor: '#4CAF50',
      currentTheme: 'light'
    })
  },
  backgroundStyle: {
    type: Number,
    default: 1
  }
})

// 导航函数
const navigateTo = async (path) => {
  try {
    if (currentPath.value !== path) {
      await router.push(path)
    }
  } catch (err) {
    if (!err.message.includes('Navigation cancelled')) {
      console.error('导航错误:', err)
    }
  }
}

// 计算属性
const themeColor = computed(() => {
  return getComputedStyle(document.documentElement).getPropertyValue('--theme-color').trim()
})

const backgroundImage = computed(() => {
  return getComputedStyle(document.documentElement).getPropertyValue('--background-image').trim()
})

const titlebarStyle = computed(() => ({
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
}))

// 窗口控制函数
const minimize = async () => {
  try {
    const { appWindow } = await import('@tauri-apps/api/window')
    await appWindow.minimize()
  } catch (error) {
    console.warn('窗口最小化失败:', error)
  }
}

const toggleMaximize = async () => {
  try {
    const { appWindow } = await import('@tauri-apps/api/window')
    if (isMaximized.value) {
      await appWindow.unmaximize()
    } else {
      await appWindow.maximize()
    }
    isMaximized.value = !isMaximized.value
  } catch (error) {
    console.warn('窗口最大化/还原失败:', error)
  }
}

const close = async () => {
  try {
    const { appWindow } = await import('@tauri-apps/api/window')
    await appWindow.close()
  } catch (error) {
    console.warn('窗口关闭失败:', error)
  }
}

// 监听器
watch(themeColor, (newColor) => {
  currentThemeColor.value = newColor
}, { immediate: true })

watch(() => props.backgroundStyle, (newStyle) => {
  console.log('TitleBar - 背景样式变化:', newStyle)
  emit('update-background', newStyle)
}, { immediate: true })

// MutationObserver
const observer = new MutationObserver(() => {
  const newColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-color').trim()
  if (newColor !== currentThemeColor.value) {
    currentThemeColor.value = newColor
  }
})

// 生命周期钩子
onMounted(async () => {
  currentThemeColor.value = themeColor.value
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['style', 'data-theme']
  })

  try {
    const { appWindow } = await import('@tauri-apps/api/window')
    const maximized = await appWindow.isMaximized()
    isMaximized.value = maximized

    await appWindow.onResized(async () => {
      try {
        isMaximized.value = await appWindow.isMaximized()
      } catch (error) {
        console.warn('获取窗口状态失败:', error)
      }
    })
  } catch (error) {
    console.warn('Tauri API 不可用:', error)
  }
})

onUnmounted(() => {
  observer.disconnect()
})
</script>

<style>
:root {
  /* 默认主题色（浅色） */
  --theme-color: #4CAF50;
  --theme-color-light: #81C784;
  --theme-color-dark: #388E3C;
  
  /* 深色主题变量 */
  --titlebar-bg-dark: linear-gradient(to bottom, rgba(40, 40, 40, 0.95), rgba(30, 30, 30, 0.95));
  --nav-bg-dark: rgba(255, 255, 255, 0.05);
  --nav-hover-dark: rgba(255, 255, 255, 0.1);
  --nav-active-dark: rgba(255, 255, 255, 0.15);
  
  /* 浅色主题变量 */
  --titlebar-bg-light: linear-gradient(to bottom, rgba(245, 245, 245, 0.95), rgba(235, 235, 235, 0.95));
  --nav-bg-light: rgba(0, 0, 0, 0.05);
  --nav-hover-light: rgba(0, 0, 0, 0.1);
  --nav-active-light: rgba(0, 0, 0, 0.15);
}

/* 修改标题栏的过渡效果 */
.titlebar {
  /* 移除或修改原有的过渡效果 */
  transition: all 0.2s ease;
}

.titlebar::after {
  /* 确保背景颜色层的过渡效果与主题色同步 */
  transition: all 0.2s ease;
}

/* 导航链接的过渡效果 */
.nav-link {
  transition: all 0.2s ease;
}

.nav-link.router-link-active {
  transition: all 0.2s ease;
}

/* 确保所有使用主题色的元素都使用相同的过渡时间 */
:root {
  --transition-speed: 0.2s;
}

/* 使用CSS变量统一过渡时间 */
.titlebar,
.titlebar::after,
.nav-link,
.nav-link.router-link-active,
.sidebar-btn.active {
  transition: all var(--transition-speed) ease;
}
</style>

<style scoped>
.titlebar {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  user-select: none;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideDown 0.5s ease-out;
  border-radius: var(--window-border-radius, 8px) var(--window-border-radius, 8px) 0 0;
}

/* 修改阴影效果 */
.titlebar::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -10px;
  height: 10px;
  background: linear-gradient(to bottom, 
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  pointer-events: none;
  z-index: 99;
}

/* 颜色层 */
.titlebar-color-layer {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--theme-color);
  opacity: 1;
  z-index: -1;
  backdrop-filter: blur(8px);
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.titlebar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 220px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.titlebar-text {
  font-size: 18px;
  font-weight: 500;
  font-family: 'CubeHub', sans-serif;
  opacity: 0;
  letter-spacing: 0.5px;
  animation: fadeInText 0.5s ease-out 0.3s forwards;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

@keyframes fadeInText {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 0.95;
    transform: translateX(0);
  }
}

.titlebar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  animation: fadeInUp 0.5s ease-out 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.nav-links {
  display: flex;
  gap: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-links:hover {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.nav-link {
  padding: 6px 16px;
  text-decoration: none;
  color: white;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.85;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  min-width: 90px;
  justify-content: center;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.nav-link:hover::before {
  width: 300px;
  height: 300px;
}

.nav-link:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
  font-weight: 500;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.nav-icon {
  width: 16px;
  height: 16px;
  transition: all 0.3s ease;
}

.nav-link:hover .nav-icon {
  transform: scale(1.2);
}

.nav-text {
  font-weight: 500;
  letter-spacing: 0.5px;
  position: relative;
  transition: all 0.3s ease;
}

.nav-link:hover .nav-text {
  transform: translateX(2px);
}

.titlebar-controls {
  display: flex;
  align-items: center;
  min-width: 220px;
  justify-content: flex-end;
  animation: fadeIn 0.5s ease-out 0.4s both;
  z-index: 10000;
}

.titlebar-button {
  width: 48px;
  height: 48px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.85;
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}

.titlebar-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.titlebar-button:hover::before {
  width: 32px;
  height: 32px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.titlebar-button svg {
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.titlebar-button:hover svg {
  transform: scale(1.1);
}

.titlebar-button.close {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 50%;
  margin-left: 4px;
}

.titlebar-button.close::before {
  background: rgba(232, 17, 35, 0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.titlebar-button.close:hover {
  background: transparent;
}

.titlebar-button.close:hover::before {
  background: rgba(232, 17, 35, 0.9);
  width: 32px;
  height: 32px;
  box-shadow: 0 0 10px rgba(232, 17, 35, 0.3);
}

.titlebar-button.close svg {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.titlebar-button.close:hover svg {
  transform: rotate(180deg) scale(1.1);
  transition-duration: 0.5s;
  filter: brightness(1.2);
}

[data-tauri-drag-region] {
  cursor: move;
}

@keyframes glow {
  0% { box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1); }
  50% { box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2); }
  100% { box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1); }
}

.resize-handle {
  position: fixed;
  z-index: 9999;
}

.resize-handle.top {
  top: 0;
  left: 8px;
  right: 8px;
  height: 4px;
  cursor: n-resize;
}

.resize-handle.right {
  top: 8px;
  right: 0;
  bottom: 8px;
  width: 4px;
  cursor: e-resize;
}

.resize-handle.bottom {
  bottom: 0;
  left: 8px;
  right: 8px;
  height: 4px;
  cursor: s-resize;
}

.resize-handle.left {
  top: 8px;
  left: 0;
  bottom: 8px;
  width: 4px;
  cursor: w-resize;
}

.resize-handle.top-left {
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  cursor: nw-resize;
}

.resize-handle.top-right {
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  cursor: ne-resize;
}

.resize-handle.bottom-left {
  bottom: 0;
  left: 0;
  width: 8px;
  height: 8px;
  cursor: sw-resize;
}

.resize-handle.bottom-right {
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  cursor: se-resize;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-section h1 {
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}

.logo-icon {
  width: 24px;
  height: 24px;
  color: white;
  margin-left: 0.25rem;
}
</style> 