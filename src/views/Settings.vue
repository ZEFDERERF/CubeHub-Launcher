<template>
  <div class="page-container">
    <transition name="content-transition" mode="out-in">
      <div class="settings-page">
        <div class="settings-main">
          <transition 
            name="sidebar"
            appear
          >
            <div class="settings-sidebar">
              <button 
                v-for="menu in menuItems" 
                :key="menu.id"
                class="sidebar-btn"
                :class="{ active: currentSection === menu.id }"
                @click="currentSection = menu.id"
              >
                <span class="icon" v-html="menu.icon"></span>
                <span class="label">{{ menu.label }}</span>
              </button>
            </div>
          </transition>

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
                  
                  <div class="color-picker" :class="{ disabled: isRGBMode }">
                    <div 
                      v-for="color in presetColors"
                      :key="color.value"
                      :class="[ 'color-option', { active: primaryColor === color.value, disabled: isRGBMode } ]"
                      :style="{ backgroundColor: color.value }"
                      :title="color.label"
                      @click="!isRGBMode && setPrimaryColor(color.value)"
                    ></div>
                  </div>

                  <div class="color-custom-section" :class="{ disabled: isRGBMode }">
                    <div class="color-preview-container">
                      <div 
                        class="color-preview" 
                        :style="{ backgroundColor: customColorHex }"
                      ></div>
                      <input 
                        type="text" 
                        v-model="customColorHex"
                        @input="handleHexInput"
                        placeholder="#RRGGBB"
                        class="hex-input"
                        maxlength="7"
                        :disabled="isRGBMode"
                      >
                    </div>
                    
                    <div class="rgb-sliders">
                      <div class="slider-group">
                        <div class="slider-content">
                          <label>R</label>
                          <div class="slider-container">
                            <input 
                              type="range" 
                              v-model.number="rgbValues.r" 
                              min="0" 
                              max="255"
                              @input="updateFromRGB"
                              :disabled="isRGBMode"
                            >
                            <div class="slider-track" 
                                 :style="{ 
                                   width: `calc(${(rgbValues.r / 255) * 100}% - 16px)`,
                                   backgroundColor: '#ff5252',
                                   left: '8px'
                                 }"
                            ></div>
                          </div>
                          <span class="value">{{ rgbValues.r }}</span>
                        </div>
                      </div>
                      <div class="slider-group">
                        <div class="slider-content">
                          <label>G</label>
                          <div class="slider-container">
                            <input 
                              type="range" 
                              v-model.number="rgbValues.g" 
                              min="0" 
                              max="255"
                              @input="updateFromRGB"
                              :disabled="isRGBMode"
                            >
                            <div class="slider-track" 
                                 :style="{ 
                                   width: `calc(${(rgbValues.g / 255) * 100}% - 16px)`,
                                   backgroundColor: '#4caf50',
                                   left: '8px'
                                 }"
                            ></div>
                          </div>
                          <span class="value">{{ rgbValues.g }}</span>
                        </div>
                      </div>
                      <div class="slider-group">
                        <div class="slider-content">
                          <label>B</label>
                          <div class="slider-container">
                            <input 
                              type="range" 
                              v-model.number="rgbValues.b" 
                              min="0" 
                              max="255"
                              @input="updateFromRGB"
                              :disabled="isRGBMode"
                            >
                            <div class="slider-track" 
                                 :style="{ 
                                   width: `calc(${(rgbValues.b / 255) * 100}% - 16px)`,
                                   backgroundColor: '#2196f3',
                                   left: '8px'
                                 }"
                            ></div>
                          </div>
                          <span class="value">{{ rgbValues.b }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="control-settings">
    <h3>控件设定</h3>
    <div class="setting-row">
      <div class="setting-label">欢迎公告</div>
      <button 
        class="toggle-btn"
        :class="{ active: homeSettings.showWelcome.value }"
        @click="toggleWelcome"
      >
        {{ homeSettings.showWelcome.value ? '隐藏' : '显示' }}
      </button>
    </div>
    
    <div class="setting-row">
      <div class="setting-label">最近游戏</div>
      <button 
        class="toggle-btn"
        :class="{ active: homeSettings.showRecentGames.value }"
        @click="toggleRecentGames"
      >
        {{ homeSettings.showRecentGames.value ? '隐藏' : '显示' }}
      </button>
    </div>
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
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, inject, provide } from 'vue'
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
  { 
    id: 'game', 
    label: '游戏',
    icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M3 12h18M12 3v18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  { 
    id: 'personalization', 
    label: '个性化',
    icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M9.953 5.64a6.737 6.737 0 0 1 2.094-2.093m-1.35 13.3a6.737 6.737 0 0 1-2.093 2.093m10.8-2.093a6.737 6.737 0 0 1-2.094 2.093m2.093-10.8a6.737 6.737 0 0 1-2.093-2.094M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  { 
    id: 'launcher', 
    label: '启动器',
    icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 6v12m-6-6h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="2"/></svg>`
  }
]

// 设颜色
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
    // 移除过渡效果，实现即时切换
    document.documentElement.style.setProperty('transition', 'none')
    
    // 更新所有颜色
    theme.value.currentColor = color
    document.documentElement.style.setProperty('--theme-color', color)
    document.documentElement.style.setProperty('--primary-color', color)
    localStorage.setItem('primaryColor', color)
    customColorHex.value = color
    
    const rgb = hexToRgb(color)
    if (rgb) {
      rgbValues.value = rgb
      document.documentElement.style.setProperty('--theme-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`)
    }

    // 在下一帧恢复过渡效果（为颜色循环准备）
    requestAnimationFrame(() => {
      document.documentElement.style.removeProperty('transition')
    })
  }
}

const toggleRGBMode = () => {
  const newValue = !isRGBMode.value
  theme.value.isRGBMode = newValue
  localStorage.setItem('isRGBMode', String(newValue))
  
  if (newValue) {
    startRGBMode()
  } else {
    stopRGBMode()
    // 恢复保存的颜色
    const savedColor = localStorage.getItem('primaryColor') || '#4CAF50'
    setPrimaryColor(savedColor)
  }
}

const rgbInterval = ref(null)

// 添加预设颜色数组（只包含要循环的颜色）
const cycleColors = [
  '#4CAF50', // 绿色
  '#81C784', // 浅绿
  '#2E7D32', // 深绿
  '#66BB6A', // 青绿
  '#00C853', // 翠绿
  '#2196F3', // 蓝色
  '#64B5F6', // 浅蓝
  '#1976D2', // 深蓝
  '#0D47A1', // 靛蓝
  '#00B0FF', // 天蓝
  '#9C27B0', // 紫色
  '#BA68C8', // 浅紫
  '#7B1FA2', // 深紫
  '#E91E63', // 粉红
  '#F44336', // 红色
  '#FF9800', // 橙色
  '#FFB74D', // 浅橙
  '#00BCD4', // 青色
  '#4DD0E1', // 浅青
  '#607D8B', // 蓝灰
  '#90A4AE'  // 浅灰
]

// 修改 startRGBMode 函数，添加过渡效果
const startRGBMode = () => {
  if (rgbInterval.value) {
    cancelAnimationFrame(rgbInterval.value)
  }
  
  // 为颜色循环添加过渡效果
  document.documentElement.style.setProperty('transition', 'all 0.2s ease')
  
  let currentIndex = 0
  let progress = 0
  const transitionDuration = 100
  
  const generateColor = () => {
    // 计算当前颜色和下一个颜色
    const currentColor = cycleColors[currentIndex]
    const nextColor = cycleColors[(currentIndex + 1) % cycleColors.length]
    
    // 使用 progress 在两个颜色之间进行插值
    const color = interpolateColors(currentColor, nextColor, progress / transitionDuration)
    
    // 更新颜色
    theme.value.currentColor = color
    document.documentElement.style.setProperty('--theme-color', color)
    document.documentElement.style.setProperty('--primary-color', color)
    
    // 更新 RGB 值
    const rgb = hexToRgb(color)
    if (rgb) {
      document.documentElement.style.setProperty('--theme-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`)
    }
    
    // 更新进度
    progress++
    if (progress >= transitionDuration) {
      progress = 0
      currentIndex = (currentIndex + 1) % cycleColors.length
    }
  }

  const animate = () => {
    generateColor()
    if (isRGBMode.value) {
      rgbInterval.value = requestAnimationFrame(animate)
    }
  }

  animate()
}

// 添加颜色插值函数
const interpolateColors = (color1, color2, factor) => {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  if (!rgb1 || !rgb2) return color1
  
  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor)
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor)
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor)
  
  return rgbToHex(r, g, b)
}

// 添加 RGB 转 Hex 函数
const rgbToHex = (r, g, b) => {
  const toHex = (n) => {
    const hex = n.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// 修改 stopRGBMode 函数
const stopRGBMode = () => {
  if (rgbInterval.value) {
    cancelAnimationFrame(rgbInterval.value)
    rgbInterval.value = null
    
    // 停止颜色循环时移除过渡效果
    document.documentElement.style.setProperty('transition', 'none')
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
      title: '选择Java执行件'
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
  const savedRGBMode = localStorage.getItem('isRGBMode') === 'true'
  theme.value.isRGBMode = savedRGBMode
  if (savedRGBMode) {
    startRGBMode()
  }

  // 初始化背景样式
  const savedStyle = parseInt(localStorage.getItem('backgroundStyle')) || 1
  console.log('Settings - 初始化背景样式:', savedStyle)
  currentStyle.value = savedStyle
  emit('update-background', savedStyle)

  addTransitionStyle()
})

onUnmounted(() => {
  stopRGBMode()
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
  // 发出新背景的事件
  emit('update-background', styleNumber)
}

// 添加 CSS 变量过渡效果
const addTransitionStyle = () => {
  const style = document.createElement('style')
  style.textContent = `
    :root {
      transition: --theme-color 0.3s linear;
    }
  `
  document.head.appendChild(style)
}

// 添加自定义颜色相关的响应式变量
const customColorHex = ref(localStorage.getItem('primaryColor') || '#4CAF50')
const rgbValues = ref({ r: 76, g: 175, b: 80 }) // 默认绿色的 RGB 值

// RGB 转 Hex
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// 处理 RGB 滑块变化
const updateFromRGB = () => {
  const hex = rgbToHex(rgbValues.value.r, rgbValues.value.g, rgbValues.value.b)
  customColorHex.value = hex
  setPrimaryColor(hex)
}

// 处理十六进制输入
const handleHexInput = () => {
  const hex = customColorHex.value
  if (/^#[0-9A-F]{6}$/i.test(hex)) {
    const rgb = hexToRgb(hex)
    if (rgb) {
      rgbValues.value = rgb
      setPrimaryColor(hex)
    }
  }
}

// 注入主页设置
const homeSettings = inject('homeSettings')

// 切换方法
const toggleWelcome = () => {
  homeSettings.showWelcome.value = !homeSettings.showWelcome.value
  localStorage.setItem('showWelcome', homeSettings.showWelcome.value.toString())
}

const toggleRecentGames = () => {
  homeSettings.showRecentGames.value = !homeSettings.showRecentGames.value
  localStorage.setItem('showRecentGames', homeSettings.showRecentGames.value.toString())
}

</script>

<style scoped>
/* 添加字体声明 */
@font-face {
  font-family: 'CubeHub';
  src: url('../assets/Fonts/Font.ttf') format('truetype');
}

/* 修改全局体 */
.settings-page {
  font-family: 'CubeHub', sans-serif;
}

/* 修改选择框样式，同步主题色 */
.slider-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--theme-color); /* 改为使用主题色 */
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  transform: translateY(-50%);
  position: relative;
  top: 50%;
}

.slider-group input[type="range"]::-webkit-slider-thumb:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 2px 8px rgba(var(--theme-color-rgb), 0.3);
  background: var(--theme-color); /* 保持主题色 */
}

.slider-group input[type="range"]:active::-webkit-slider-thumb {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 2px 6px rgba(var(--theme-color-rgb), 0.4);
  background: var(--theme-color); /* 保持主题色 */
}

/* 确保所有文本元素使用 CubeHub 字体 */
.slider-content label,
.value,
.hex-input,
.settings-section h2,
.setting-item label,
.sidebar-btn,
button,
input {
  font-family: 'CubeHub', sans-serif;
}

/* 修改数值显示的样式 */
.value {
  font-family: 'CubeHub', monospace; /* 使用 CubeHub 字体但保持等宽效果 */
  color: var(--text-color);
  font-size: 0.9rem;
  min-width: 35px;
  text-align: right;
  opacity: 0.9;
  background: var(--background-color);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(var(--theme-color-rgb), 0.1);
}

/* 修改十六进制输入框样式 */
.hex-input {
  font-family: 'CubeHub', monospace;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(var(--theme-color-rgb), 0.15);
  border-radius: 8px;
  width: 100px;
  text-align: center;
  background: var(--background-color);
  color: var(--text-color);
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.settings-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--background-color);
  flex: 1;
}

.settings-main {
  flex: 1;
  display: flex;
  min-height: 0;
  background: var(--background-color);
  overflow: hidden;
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
  flex-shrink: 0;
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
  min-width: 0;
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

/* 颜色选择 */
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
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 8px;
  background: transparent;
  outline: none;
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

/* 控件设定样式 */
.control-settings {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--background-color);
  border-radius: 12px;
  border: 1px solid rgba(var(--theme-color-rgb), 0.1);
}

.control-settings h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(128, 128, 128, 0.1);
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: 0.95rem;
  color: var(--text-color);
}

.toggle-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(var(--theme-color-rgb), 0.2);
  background: transparent;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
  font-family: inherit;
}

.toggle-btn.active {
  background: var(--theme-color);
  color: white;
  border-color: var(--theme-color);
  box-shadow: 0 2px 8px rgba(var(--theme-color-rgb), 0.2);
}

.toggle-btn:hover {
  background: rgba(var(--theme-color-rgb), 0.1);
  transform: translateY(-1px);
}

.toggle-btn.active:hover {
  background: var(--theme-color);
  filter: brightness(1.1);
  transform: translateY(-1px);
}

/* 添加自定义颜色输入相关样式 */
.color-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.custom-color-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--surface-color);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(128, 128, 128, 0.2);
}

.custom-color-input input[type="color"] {
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: none;
}

.custom-color-input input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

.custom-color-input input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.color-value {
  font-size: 0.9rem;
  color: var(--secondary-text);
  font-family: monospace;
}

.color-picker.disabled {
  opacity: 0.7;
  pointer-events: none;
}

/* 添加新的样式 */
.color-custom-section {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.02);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(128, 128, 128, 0.1);
}

.color-preview-container {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-preview {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.hex-input {
  padding: 0.75rem 1rem;
  border: 1px solid rgba(128, 128, 128, 0.15);
  border-radius: 8px;
  font-family: 'Monaco', monospace;
  width: 100px;
  text-align: center;
  background: var(--background-color);
  color: var(--text-color);
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.hex-input:focus {
  border-color: var(--theme-color);
  box-shadow: 0 0 0 2px rgba(var(--theme-color-rgb), 0.1);
  outline: none;
}

.rgb-sliders {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.slider-group {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 8px;
  background: transparent;
  outline: none;
}

.slider-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0.5rem;
  position: relative;
}

.slider-content label {
  font-weight: 600;
  color: var(--text-color);
  font-size: 1rem;
  min-width: 20px;
  text-align: center;
}

.slider-container {
  position: relative;
  flex: 1;
  height: 16px;
  background: rgba(128, 128, 128, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0 8px;
  overflow: hidden;
}

.slider-track {
  position: absolute;
  height: 4px;
  left: 8px;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 2px;
  pointer-events: none;
  background: rgba(128, 128, 128, 0.15);
  max-width: calc(100% - 16px);
}

.slider-group input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 16px;
  background: transparent;
  position: relative;
  z-index: 1;
  cursor: pointer;
  margin: 0;
  padding: 0;
  outline: none;
}

.slider-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #e0e0e0;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.slider-group input[type="range"]::-webkit-slider-thumb:hover {
  background: #d0d0d0;
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.slider-group input[type="range"]:active::-webkit-slider-thumb {
  background: #c0c0c0;
  transform: scale(1.1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.slider-content,
.slider-content label,
.slider-content .value {
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.value {
  font-family: 'Monaco', monospace;
  color: var(--text-color);
  font-size: 0.9rem;
  min-width: 40px;
  text-align: right;
  padding: 0.25rem 0.5rem;
  background: var(--background-color);
  border-radius: 4px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 修改禁用状态的样式 */
.color-custom-section.disabled {
  opacity: 0.7;
  pointer-events: none;
}

.color-custom-section.disabled input[type="range"] {
  cursor: not-allowed;
}

.color-custom-section.disabled .slider-group input[type="range"]::-webkit-slider-thumb {
  cursor: not-allowed;
}

/* 移除全局过渡效果 */
:root {
  transition: none;
}

.slider-group input[type="range"]:disabled {
  opacity: 0.7;
}

.hex-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 优化过渡效果 */
:root {
  transition: --theme-color 0.3s ease, --primary-color 0.3s ease;
}

:root {
  --transition-speed: 0.2s;
}

/* 移除多余的过渡效果声明 */
:root {
  transition: none;
}

/* 为需要动画的元素添加统一的过渡效果 */
.sidebar-btn.active,
.rgb-btn.active,
[class*="theme-color"] {
  transition: all var(--transition-speed) ease;
}

/* 颜色循环模式下的过渡效果 */
.color-cycle-mode {
  transition: all var(--transition-speed) ease;
}

/* 修改页面容器样式 */
.page-container {
  padding: 0 !important; /* 移除页面容器的内边距 */
  height: 100%;
  display: flex;
}

/* 修改设置页面的布局 */
.settings-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}

/* 修改主要内容区域的布局 */
.settings-main {
  flex: 1;
  display: flex;
  background: var(--background-color);
  overflow: hidden;
}

/* 修改边栏样式 */
.settings-sidebar {
  width: 200px;
  background: var(--surface-color);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 2rem 1rem 1rem; /* 增加顶部内边距 */
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  height: 100%;
}

/* 修改内容区域样式 */
.settings-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: var(--background-color);
  min-width: 0;
  position: relative;
  z-index: 0; /* 确保在侧边栏下方 */
}

/* 修改滚动内容区域 */
.scrollable-content {
  height: 100%;
  overflow-y: auto;
  padding-right: 1rem; /* 为滚动条留出空间 */
}

/* 修改设置区块样式 */
.settings-section {
  background: var(--surface-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(128, 128, 128, 0.1);
  transition: all 0.3s ease;
}

.settings-section:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

/* 修改标题栏阴影效果 */
.titlebar {
  position: relative;
  z-index: 1000; /* 确保在最上层 */
}

.titlebar::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -10px;
  height: 10px;
  background: linear-gradient(to bottom, 
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  pointer-events: none;
  z-index: 999;
}

/* 调整���边栏样式 */
.settings-sidebar {
  width: 200px;
  background: var(--surface-color);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 2rem 1rem 1rem; /* 增加顶部内边距 */
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  height: 100%;
}

/* 优化设置内容块样式 */
.settings-section {
  background: var(--surface-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(128, 128, 128, 0.1);
  transition: all 0.3s ease;
}

.settings-section:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

/* 优化侧边栏按钮样式 */
.sidebar-btn {
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  position: relative;
  overflow: hidden;
  font-weight: 500;
}

.sidebar-btn .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar-btn .icon :deep(svg) {
  width: 16px;
  height: 16px;
  transition: all 0.3s ease;
  fill: none;
}

.sidebar-btn:hover {
  background: rgba(var(--theme-color-rgb), 0.1);
}

.sidebar-btn.active {
  background: var(--theme-color);
  color: white;
  box-shadow: 0 4px 12px rgba(var(--theme-color-rgb), 0.3);
}

.sidebar-btn.active:hover {
  transform: translateX(8px) scale(1.02);
}

/* 设置内容区域样式 */
.settings-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: var(--background-color);
  min-width: 0;
  position: relative;
  z-index: 0; /* 确保在侧边栏下方 */
}

.toggle-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(var(--theme-color-rgb), 0.2);
  background: transparent;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
  font-family: inherit;
}

/* 修改这里：当显示时（active）为绿色 */
.toggle-btn.active {
  background: transparent;
  color: var(--text-color);
  border-color: rgba(var(--theme-color-rgb), 0.2);
  box-shadow: none;
}

/* 修改这里：当隐藏时为绿色 */
.toggle-btn:not(.active) {
  background: var(--theme-color);
  color: white;
  border-color: var(--theme-color);
  box-shadow: 0 2px 8px rgba(var(--theme-color-rgb), 0.2);
}

.toggle-btn:hover {
  transform: translateY(-1px);
}

.toggle-btn.active:hover {
  background: rgba(var(--theme-color-rgb), 0.1);
}

.toggle-btn:not(.active):hover {
  filter: brightness(1.1);
}

/* 侧边栏按钮动画 */
.sidebar-btn {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: left center;
  position: relative;
  overflow: hidden;
}

.sidebar-btn:hover {
  transform: translateX(8px) scale(1.02);
  background: rgba(var(--theme-color-rgb), 0.1);
}

.sidebar-btn:active {
  transform: translateX(4px) scale(0.98);
}

/* 按钮点击波纹效果 */
.sidebar-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(var(--theme-color-rgb), 0.2);
  border-radius: inherit;
  opacity: 0;
  transform: scale(0.6);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sidebar-btn:active::after {
  opacity: 1;
  transform: scale(1);
}

/* 当前选中项的动画 */
.sidebar-btn.active {
  background: var(--theme-color);
  color: white;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(var(--theme-color-rgb), 0.3);
}

.sidebar-btn.active:hover {
  transform: translateX(8px) scale(1.02);
}

/* 图标动画 */
.sidebar-btn .icon {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sidebar-btn:hover .icon {
  transform: scale(1.1);
}

.sidebar-btn.active .icon {
  transform: scale(1.2);
}

/* 侧边栏动画 */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: left center;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%) scale(0.95);
  opacity: 0;
}

.sidebar-enter-to,
.sidebar-leave-from {
  transform: translateX(0) scale(1);
  opacity: 1;
}

/* 为每个按钮添加延迟动画 */
.settings-sidebar .sidebar-btn {
  opacity: 0;
  transform: translateX(-20px);
  animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 为每个按钮设置不同的延迟 */
.settings-sidebar .sidebar-btn:nth-child(1) { animation-delay: 0.1s; }
.settings-sidebar .sidebar-btn:nth-child(2) { animation-delay: 0.2s; }
.settings-sidebar .sidebar-btn:nth-child(3) { animation-delay: 0.3s; }
</style> 