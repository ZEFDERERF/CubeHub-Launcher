<template>
  <div class="settings-page">
    <div class="settings-main">
      <div class="settings-sidebar">
        <button 
          v-for="menu in menuItems" 
          :key="menu.id"
          class="sidebar-btn"
          :class="{ active: currentSection === menu.id }"
          @click="currentSection = menu.id"
        >
          <span class="menu-icon">{{ menu.icon }}</span>
          {{ menu.label }}
        </button>
      </div>

      <div class="settings-content">
        <div class="scrollable-content">
          <!-- 个性化设置 -->
          <div v-show="currentSection === 'personalization'" class="settings-section">
            <h2>主题设置</h2>
            <div class="setting-item">
              <div class="theme-color-header">
                <label>主题色</label>
                <button 
                  class="rgb-btn" 
                  :class="{ active: isRGBMode }"
                  @click="toggleRGBMode"
                >
                  {{ isRGBMode ? '关闭' : '开启' }}颜色循环
                </button>
              </div>
              <div class="color-picker">
                <div 
                  v-for="color in presetColors"
                  :key="color.value"
                  :class="[ 'color-option', { active: primaryColor === color.value, disabled: isRGBMode } ]"
                  :style="{ backgroundColor: color.value }"
                  :title="color.label"
                  @click="!isRGBMode && setPrimaryColor(color.value)"
                ></div>
              </div>
            </div>
          </div>

          <!-- 游戏设置 -->
          <div v-show="currentSection === 'game'" class="settings-section">
            <h2>游戏目录</h2>
            <div class="setting-item">
              <div class="game-dir-input">
                <input 
                  type="text" 
                  v-model="gamePath"
                  readonly
                  class="path-input"
                  :title="gamePath"
                >
                <button class="primary-btn" @click="browseGamePath">选择目录</button>
              </div>
              <button class="secondary-btn" @click="resetToDefaultDir">重置为默认目录</button>
            </div>

            <h2>Java 设置</h2>
            <div class="setting-item">
              <div class="game-dir-input">
                <input 
                  type="text" 
                  v-model="javaPath"
                  readonly
                  class="path-input"
                  :title="javaPath"
                >
                <button class="primary-btn" @click="browseJavaPath">选择Java</button>
              </div>
            </div>

            <h2>内存设置</h2>
            <div class="setting-item">
              <div class="memory-sliders">
                <div class="slider-group">
                  <span>最小内存: {{ minMemory }}GB</span>
                  <input 
                    type="range" 
                    v-model="minMemory" 
                    min="1" 
                    max="16" 
                    step="0.5"
                  >
                </div>
                <div class="slider-group">
                  <span>最大内存: {{ maxMemory }}GB</span>
                  <input 
                    type="range" 
                    v-model="maxMemory" 
                    min="1" 
                    max="16" 
                    step="0.5"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- 启动器设置 -->
          <div v-show="currentSection === 'launcher'" class="settings-section">
            <h2>启动器设置</h2>
            <div class="setting-item">
              <label>语言</label>
              <select v-model="language">
                <option value="zh">简体中文</option>
                <option value="en">English</option>
              </select>
            </div>

            <h2>下载设置</h2>
            <div class="setting-item">
              <label>下载源</label>
              <select v-model="downloadSource">
                <option value="official">官方源</option>
                <option value="bmclapi">BMCLAPI (国内加速)</option>
              </select>
              <div class="source-info">
                {{ getSourceDescription }}
              </div>
            </div>
            
            <div class="setting-item">
              <label>并行下载数</label>
              <div class="slider-with-input">
                <input 
                  type="range" 
                  v-model.number="maxDownloads" 
                  min="1" 
                  max="32"
                  class="slider-input"
                >
                <div class="number-input-wrapper">
                  <input 
                    type="number" 
                    v-model.number="maxDownloads" 
                    min="1" 
                    max="32"
                    class="number-input"
                  >
                  <span class="unit">线程</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, inject } from 'vue'
import { open } from '@tauri-apps/api/dialog'
import { appDir } from '@tauri-apps/api/path'
import { exists, createDir } from '@tauri-apps/api/fs'

// 定义事件发射器
const emit = defineEmits(['update-background'])

// 注入主题
const theme = inject('theme', ref({
  isRGBMode: false,
  isDarkMode: false,
  currentColor: '#4CAF50',
  currentTheme: 'light'
}))
const isRGBMode = computed(() => theme.value.isRGBMode)

// 状态管理
const currentSection = ref('personalization')
const primaryColor = ref(localStorage.getItem('primaryColor') || '#4CAF50')
const gamePath = ref(localStorage.getItem('gamePath') || '')
const javaPath = ref(localStorage.getItem('javaPath') || '')
const minMemory = ref(Number(localStorage.getItem('minMemory')) || 2)
const maxMemory = ref(Number(localStorage.getItem('maxMemory')) || 4)
const language = ref(localStorage.getItem('language') || 'zh')
const downloadSource = ref(localStorage.getItem('downloadSource') || 'official')
const maxDownloads = ref(Number(localStorage.getItem('maxDownloads')) || 16)
const currentStyle = ref(parseInt(localStorage.getItem('backgroundStyle')) || 1)

// 菜单配置
const menuItems = [
  { id: 'game', label: '游戏', icon: '🎮' },
  { id: 'personalization', label: '个性化', icon: '🎨' },
  { id: 'launcher', label: '启动器', icon: '⚙️' }
]

// 预设颜色
const presetColors = [
  // 绿色系
  { value: '#4CAF50', label: '绿色' },
  { value: '#81C784', label: '浅绿' },
  { value: '#2E7D32', label: '深绿' },
  { value: '#66BB6A', label: '青绿' },
  { value: '#00C853', label: '翠绿' },
  
  // 蓝色系
  { value: '#2196F3', label: '蓝色' },
  { value: '#64B5F6', label: '浅蓝' },
  { value: '#1976D2', label: '深蓝' },
  { value: '#0D47A1', label: '靛蓝' },
  { value: '#00B0FF', label: '天蓝' },
  
  // 紫色系
  { value: '#9C27B0', label: '紫色' },
  { value: '#BA68C8', label: '浅紫' },
  { value: '#7B1FA2', label: '深紫' },
  { value: '#6A1B9A', label: '暗紫' },
  { value: '#E040FB', label: '亮紫' },
  
  // 红色系
  { value: '#E91E63', label: '粉红' },
  { value: '#F48FB1', label: '浅粉' },
  { value: '#C2185B', label: '深粉' },
  { value: '#F44336', label: '红色' },
  { value: '#EF5350', label: '亮红' },
  
  // 橙色系
  { value: '#FF9800', label: '橙色' },
  { value: '#FFB74D', label: '浅橙' },
  { value: '#F57C00', label: '橙' },
  { value: '#FF5722', label: '橘红' },
  { value: '#FFB300', label: '金橙' },
  
  // 青色系
  { value: '#00BCD4', label: '青色' },
  { value: '#4DD0E1', label: '浅青' },
  { value: '#0097A7', label: '深青' },
  { value: '#00838F', label: '墨青' },
  { value: '#00E5FF', label: '亮青' },
  
  // 棕色系
  { value: '#795548', label: '棕色' },
  { value: '#A1887F', label: '浅棕' },
  { value: '#5D4037', label: '深棕' },
  { value: '#4E342E', label: '赭棕' },
  { value: '#8D6E63', label: '褐棕' },
  
  // 灰色系
  { value: '#607D8B', label: '蓝灰' },
  { value: '#90A4AE', label: '浅灰' },
  { value: '#455A64', label: '深灰' },
  { value: '#37474F', label: '暗灰' },
  { value: '#78909C', label: '亮灰' },
  
  // 黑白系
  { value: '#000000', label: '黑色' },
  { value: '#424242', label: '炭黑' }
]

// 计算属性
const getSourceDescription = computed(() => {
  const descriptions = {
    official: '官方下载源，速度可能较慢',
    bmclapi: '使用BMCLAPI下载源，国内用户推荐使用'
  }
  return descriptions[downloadSource.value]
})

const getCurrentColorName = computed(() => {
  const currentColor = presetColors.find(color => color.value === primaryColor.value)
  return currentColor ? currentColor.label : ''
})

// 主题相关方法
const setPrimaryColor = (color) => {
  if (!isRGBMode.value) {
    theme.value.currentColor = color
    document.documentElement.style.setProperty('--theme-color', color)
    localStorage.setItem('primaryColor', color)
  }
}

const toggleRGBMode = () => {
  const newValue = !isRGBMode.value
  theme.value.isRGBMode = newValue
  if (!newValue) {
    const savedColor = localStorage.getItem('primaryColor') || '#4CAF50'
    setPrimaryColor(savedColor)
  }
  localStorage.setItem('isRGBMode', newValue)
  if (newValue) {
    startRGBMode()
  }
}

let rgbInterval = null

const startRGBMode = () => {
  if (rgbInterval) clearInterval(rgbInterval)
  
  rgbInterval = setInterval(() => {
    if (!isRGBMode.value) {
      clearInterval(rgbInterval)
      return
    }
    
    const hue = Math.floor(Math.random() * 360)
    const color = `hsl(${hue}, 60%, 45%)`
    document.documentElement.style.setProperty('--theme-color', color)
  }, 3000)
}

const stopRGBMode = () => {
  if (rgbInterval) {
    clearInterval(rgbInterval)
    rgbInterval = null
  }
}

// 文件选择方法
const browseGamePath = async () => {
  try {
    const selected = await open({
      directory: true,
      multiple: false,
      title: '选择游戏目录'
    })
    if (selected) {
      gamePath.value = selected
      localStorage.setItem('gamePath', selected)
    }
  } catch (err) {
    console.error('选择目录失败:', err)
  }
}

const browseJavaPath = async () => {
  try {
    const selected = await open({
      filters: [
        {
          name: 'Java',
          extensions: ['exe']
        }
      ],
      multiple: false,
      title: '选择Java可执行件'
    })
    if (selected) {
      javaPath.value = selected
      localStorage.setItem('javaPath', selected)
    }
  } catch (err) {
    console.error('选择文件失败:', err)
  }
}

const resetToDefaultDir = async () => {
  try {
    const defaultDir = await appDir()
    gamePath.value = defaultDir
    localStorage.setItem('gamePath', defaultDir)
  } catch (err) {
    console.error('重置目录失败:', err)
  }
}

// 监听值变化并存
watch([minMemory, maxMemory, language, downloadSource, maxDownloads], ([newMin, newMax, newLang, newSource, newDownloads]) => {
  localStorage.setItem('minMemory', newMin)
  localStorage.setItem('maxMemory', newMax)
  localStorage.setItem('language', newLang)
  localStorage.setItem('downloadSource', newSource)
  localStorage.setItem('maxDownloads', newDownloads)
})

// 生命周期钩子
onMounted(() => {
  // 初始化主题色
  const savedColor = localStorage.getItem('primaryColor') || '#4CAF50'
  setPrimaryColor(savedColor)
  
  // 初始化 RGB 模式
  if (isRGBMode.value) {
    startRGBMode()
  }

  // 初始化背景样式
  const savedStyle = parseInt(localStorage.getItem('backgroundStyle')) || 1
  console.log('Settings - 初始化背景样式:', savedStyle)
  currentStyle.value = savedStyle
  emit('update-background', savedStyle)
})

onUnmounted(() => {
  stopRGBMode()
  if (rgbInterval) clearInterval(rgbInterval)
})

const applyTheme = () => {
  const isDark = theme.value.isDarkMode || 
    (theme.value.isDarkMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
}

const setBackgroundStyle = (styleNumber) => {
  console.log('Settings - 设置背景样式:', styleNumber)
  currentStyle.value = styleNumber
  localStorage.setItem('backgroundStyle', styleNumber.toString())
  // 发出更新背景的事件
  emit('update-background', styleNumber)
}
</script>

<style scoped>
.settings-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}

.settings-main {
  flex: 1;
  display: flex;
  min-height: 0;
  background: var(--background-color);
}

.settings-sidebar {
  width: 200px;
  padding: 2rem 1rem;
  background: var(--surface-color);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
}

.sidebar-btn {
  padding: 0.75rem 1rem;
  border-radius: 4px;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
}

.sidebar-btn::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease-out, height 0.6s ease-out;
}

.sidebar-btn:hover::after {
  width: 150%;
  height: 150%;
}

.sidebar-btn.active {
  background: var(--theme-color);
  color: white;
  transform: scale(1.02);
}

.menu-icon {
  font-size: 1.2rem;
}

.settings-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: var(--background-color);
}

.settings-section {
  background: var(--surface-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  animation: sectionFadeIn 0.3s ease-out;
  transform-origin: top;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

@keyframes sectionFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.settings-section h2 {
  margin: 0 0 1.5rem 0;
  color: var(--text-color);
  font-size: 1.5rem;
}

.setting-item {
  margin-bottom: 2rem;
  animation: settingItemFadeIn 0.5s ease-out;
  animation-fill-mode: both;
}

@keyframes settingItemFadeIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.setting-item:nth-child(1) { animation-delay: 0.1s; }
.setting-item:nth-child(2) { animation-delay: 0.2s; }
.setting-item:nth-child(3) { animation-delay: 0.3s; }
.setting-item:nth-child(4) { animation-delay: 0.4s; }

.setting-item label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

/* 颜色选择器 */
.theme-color-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.theme-color-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-color-name {
  color: var(--secondary-text);
  font-size: 0.9rem;
  opacity: 0;
  animation: fadeSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.rgb-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: transparent;
  color: #333;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.rgb-btn::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  background: rgba(var(--theme-color-rgb), 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease-out, height 0.6s ease-out;
}

.rgb-btn:hover::after {
  width: 300%;
  height: 300%;
}

.rgb-btn.active {
  background: var(--theme-color);
  color: white;
  border-color: var(--theme-color);
  animation: rgbPulse 2s infinite;
}

@keyframes rgbPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--theme-color-rgb), 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--theme-color-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--theme-color-rgb), 0);
  }
}

.color-picker {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
  gap: 1rem;
  padding: 1rem;
  max-width: 800px;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15),
              inset 0 2px 4px rgba(255, 255, 255, 0.2);
}

.color-option:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25),
              inset 0 2px 4px rgba(255, 255, 255, 0.2);
}

.color-option.active {
  box-shadow: 0 0 0 2px var(--background-color),
              0 0 0 4px var(--theme-color),
              0 4px 12px rgba(0, 0, 0, 0.25),
              inset 0 2px 4px rgba(255, 255, 255, 0.2);
}

.color-option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.color-option.disabled:hover {
  transform: none;
  box-shadow: none;
}

/* 游戏设置 */
.game-dir-input {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.path-input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: var(--background-color);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  color: var(--text-color);
  font-family: inherit;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.path-input:hover {
  border-color: rgba(var(--theme-color-rgb), 0.3);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05),
              0 2px 8px rgba(var(--theme-color-rgb), 0.1);
}

.path-input:focus {
  border-color: var(--theme-color);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05),
              0 0 0 3px rgba(var(--theme-color-rgb), 0.2);
  background: white;
}

.primary-btn,
.secondary-btn {
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.primary-btn {
  background: var(--theme-color);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(var(--theme-color-rgb), 0.3);
}

.primary-btn:hover {
  filter: brightness(1.1);
  box-shadow: 0 6px 16px rgba(var(--theme-color-rgb), 0.4);
  transform: translateY(-2px);
}

.secondary-btn {
  background: rgba(var(--theme-color-rgb), 0.1);
  border: 1px solid var(--theme-color);
  color: var(--theme-color);
}

.secondary-btn:hover {
  background: rgba(var(--theme-color-rgb), 0.15);
  box-shadow: 0 4px 12px rgba(var(--theme-color-rgb), 0.2);
  transform: translateY(-2px);
}

.primary-btn:active,
.secondary-btn:active {
  transform: translateY(1px);
}

.slider-with-input {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.number-input-wrapper {
  position: relative;
}

.number-input {
  width: 60px;
  padding: 0.75rem;
  background: var(--background-color);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  color: var(--text-color);
  font-family: inherit;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.number-input:hover {
  border-color: rgba(var(--theme-color-rgb), 0.3);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05),
              0 2px 8px rgba(var(--theme-color-rgb), 0.1);
  transform: translateY(-1px);
}

.number-input:focus {
  border-color: var(--theme-color);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05),
              0 0 0 3px rgba(var(--theme-color-rgb), 0.2);
  background: white;
}

.number-input:focus + .unit {
  color: var(--theme-color);
}

.unit {
  color: var(--secondary-text);
  transition: all 0.3s ease;
}

.number-input:focus + .unit {
  color: var(--theme-color);
}

/* 内存块 */
.memory-sliders {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.slider-group {
  background: var(--surface-color);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.slider-group span {
  color: #333;
}

input[type="range"] {
  width: 100%;
  height: 6px;
  background: #ddd;
  border-radius: 3px;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: var(--theme-color);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 2px 8px rgba(var(--theme-color-rgb), 0.4);
}

/* 下载设置 */
select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--background-color);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  color: var(--text-color);
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

select:hover {
  border-color: rgba(var(--theme-color-rgb), 0.3);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05),
              0 2px 8px rgba(var(--theme-color-rgb), 0.1);
}

select:focus {
  border-color: var(--theme-color);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05),
              0 0 0 3px rgba(var(--theme-color-rgb), 0.2);
  background: white;
}

.source-info {
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.slider-with-input {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.number-input-wrapper {
  position: relative;
}

.number-input {
  width: 60px;
  padding: 0.75rem;
  background: var(--background-color);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  color: var(--text-color);
  font-family: inherit;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.number-input:hover {
  border-color: rgba(var(--theme-color-rgb), 0.3);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05),
              0 2px 8px rgba(var(--theme-color-rgb), 0.1);
  transform: translateY(-1px);
}

.number-input:focus {
  border-color: var(--theme-color);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05),
              0 0 0 3px rgba(var(--theme-color-rgb), 0.2);
  background: white;
}

.number-input:focus + .unit {
  color: var(--theme-color);
}

.theme-style-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.style-picker {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.style-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--surface-color);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  position: relative;
  overflow: hidden;
}

.style-btn::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  background: rgba(var(--theme-color-rgb), 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease-out, height 0.6s ease-out;
}

.style-btn:hover::after {
  width: 300%;
  height: 300%;
}

.style-btn:hover {
  border-color: var(--theme-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--theme-color-rgb), 0.2);
}

.style-btn.active {
  background: var(--theme-color);
  color: white;
  border-color: var(--theme-color);
  box-shadow: 0 4px 12px rgba(var(--theme-color-rgb), 0.3);
}
</style> 