import { ref } from 'vue'

const isRGBMode = ref(localStorage.getItem('rgbMode') === 'true')
let rgbInterval = null

const rgbColors = [
  '#4CAF50', // 绿色
  '#66BB6A', // 浅绿
  '#388E3C', // 深绿
  '#00BCD4', // 青色
  '#26C6DA', // 浅青
  '#0097A7', // 深青
  '#009688', // 青绿
  '#26A69A', // 浅青绿
  '#00796B'  // 深青绿
]

export function startRGBMode() {
  let index = 0
  rgbInterval = setInterval(() => {
    const color = rgbColors[index]
    document.documentElement.style.setProperty('--primary-color', color)
    localStorage.setItem('primaryColor', color)
    index = (index + 1) % rgbColors.length
  }, 500)
}

export function stopRGBMode() {
  if (rgbInterval) {
    clearInterval(rgbInterval)
    rgbInterval = null
    const savedColor = localStorage.getItem('primaryColor') || '#4CAF50'
    document.documentElement.style.setProperty('--primary-color', savedColor)
  }
}

export function toggleRGBMode() {
  isRGBMode.value = !isRGBMode.value
  localStorage.setItem('rgbMode', isRGBMode.value)
  
  if (isRGBMode.value) {
    startRGBMode()
  } else {
    stopRGBMode()
  }
}

function initRGBMode() {
  if (localStorage.getItem('rgbMode') === 'true') {
    isRGBMode.value = true
    startRGBMode()
  } else {
    isRGBMode.value = false
    const savedColor = localStorage.getItem('primaryColor') || '#4CAF50'
    document.documentElement.style.setProperty('--primary-color', savedColor)
  }
}

initRGBMode()

export { isRGBMode } 