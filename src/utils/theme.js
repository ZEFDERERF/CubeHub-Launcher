export const themes = {
  light: {
    '--background-color': '#f5f5f5',
    '--surface-color': '#ffffff',
    '--border-color': '#e0e0e0',
    '--text-color': '#333333',
    '--secondary-text-color': '#666666',
    '--hover-color': '#f0f0f0',
    '--card-background': '#ffffff'
  },
  dark: {
    '--background-color': '#121212',
    '--surface-color': '#1e1e1e',
    '--border-color': '#333333',
    '--text-color': '#ffffff',
    '--secondary-text-color': '#cccccc',
    '--hover-color': '#2a2a2a',
    '--card-background': '#242424'
  }
}

export const presetColors = [
  { name: '绿色', value: '#4CAF50' },
  { name: '蓝色', value: '#2196F3' },
  { name: '紫色', value: '#9C27B0' },
  { name: '橙色', value: '#FF9800' },
  { name: '红色', value: '#F44336' }
]

export function applyTheme(mode) {
  // 获取系统主题偏好
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  // 确定要应用的主题
  let themeToApply = mode
  if (mode === 'system') {
    themeToApply = prefersDark ? 'dark' : 'light'
  }

  // 应用主题变量
  const theme = themes[themeToApply]
  Object.entries(theme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value)
  })

  // 保存主题设置
  localStorage.setItem('themeMode', mode)
}

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  const currentMode = localStorage.getItem('themeMode') || 'system'
  if (currentMode === 'system') {
    applyTheme('system')
  }
})

// 初始化主题
export function initTheme() {
  const savedMode = localStorage.getItem('themeMode') || 'system'
  applyTheme(savedMode)
} 