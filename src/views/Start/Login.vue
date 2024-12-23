<template>
  <div class="login-container">
    <h1 class="title">玩家登录</h1>
    <div class="login-box">
      <div class="login-tabs">
        <button 
          class="tab-button"
          :class="{ active: loginType === 'offline' }"
          @click="loginType = 'offline'"
        >
          离线登录
        </button>
        <button 
          class="tab-button"
          :class="{ active: loginType === 'microsoft' }"
          @click="loginType = 'microsoft'"
        >
          Microsoft 登录
        </button>
      </div>

      <div class="login-form" v-if="loginType === 'offline'">
        <div class="form-group">
          <label>游戏名称</label>
          <input 
            type="text" 
            v-model="offlineUsername"
            placeholder="请输入游戏名称"
          >
        </div>
      </div>

      <div class="login-form" v-else>
        <button 
          class="microsoft-button"
          :disabled="isLoggingIn"
          @click="handleMicrosoftLogin"
        >
          <i class="icon-microsoft"></i>
          {{ isLoggingIn ? '登录中...' : '使用 Microsoft 账号登录' }}
        </button>
        <p v-if="loginError" class="error-message">
          {{ loginError }}
        </p>
      </div>
    </div>

    <div class="actions">
      <button class="back-button" @click="router.push('/start/agreement')">
        返回
      </button>
      <button 
        class="next-button"
        :disabled="!canProceed"
        @click="handleNext"
      >
        下一步
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { configManager } from '../../utils/config'

const router = useRouter()
const loginType = ref('offline')
const offlineUsername = ref('')
const isLoggingIn = ref(false)
const loginError = ref('')

const canProceed = computed(() => {
  if (loginType.value === 'offline') {
    return offlineUsername.value.length >= 3
  }
  return false
})

const handleMicrosoftLogin = async () => {
  isLoggingIn.value = true
  loginError.value = ''
  
  try {
    // 动态导入 Microsoft 认证模块
    const { microsoftAuth } = await import('../../utils/microsoftAuth')
    const result = await microsoftAuth.login()
    
    // 保存账户信息
    await configManager.addAccount({
      type: 'microsoft',
      username: result.username,
      uuid: result.uuid,
      accessToken: result.accessToken
    })
    
    // 设置最后使用的用户名
    await configManager.setLastUsername(result.username)
    
    router.push('/start/java')
  } catch (error) {
    console.error('Microsoft 登录失败:', error)
    loginError.value = error.message || '登录失败，请重试'
  } finally {
    isLoggingIn.value = false
  }
}

const handleNext = async () => {
  if (canProceed.value) {
    // 保存离线账户信息
    await configManager.addAccount({
      type: 'offline',
      username: offlineUsername.value,
      uuid: generateOfflineUUID(offlineUsername.value)
    })
    
    // 设置最后使用的用户名
    await configManager.setLastUsername(offlineUsername.value)
    
    router.push('/start/java')
  }
}

// 生成离线模式的 UUID
function generateOfflineUUID(username) {
  // 使用简单的哈希函数生成伪 UUID
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = ((hash << 5) - hash) + username.charCodeAt(i)
    hash = hash & hash
  }
  const uuid = hash.toString(16).padStart(32, '0')
  return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`
}
</script>

<style scoped>
@font-face {
  font-family: 'CubeHub';
  src: url('../../assets/Fonts/Font.ttf') format('truetype');
}

.login-container {
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

.login-box {
  background: var(--surface-color);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-button {
  padding: 0.8rem 1.5rem;
  border: none;
  background: none;
  color: var(--text-color);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  font-family: 'CubeHub', sans-serif;
}

.tab-button.active {
  background: var(--primary-color);
  color: white;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--background-color);
  color: var(--text-color);
  font-family: 'CubeHub', sans-serif;
}

.microsoft-button {
  width: 100%;
  padding: 1rem;
  background: #0078d4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: 'CubeHub', sans-serif;
  transition: all 0.3s;
}

.microsoft-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.microsoft-button:not(:disabled):hover {
  background: #006cbd;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

.error-message {
  color: #ff4444;
  margin-top: 1rem;
  text-align: center;
}
</style> 