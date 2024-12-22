<template>
  <div class="microsoft-login-form">
    <template v-if="state === 'initial'">
      <div class="loading-animation">
        <div class="spinner"></div>
        <p>正在打开 Microsoft 登录...</p>
      </div>
    </template>

    <template v-else-if="state === 'code_input'">
      <div class="form-content">
        <h2>验证登录</h2>
        <p class="desc">请将 Microsoft 登录页面地址栏中的完整 URL 复制到下方输入框中</p>
        
        <div class="input-section">
          <input 
            v-model="authCode"
            type="text"
            placeholder="请粘贴完整的验证码 URL"
            :class="{ 'error': showError }"
            @input="handleInput"
          />
          <span v-if="showError" class="error-message">{{ errorMessage }}</span>
        </div>

        <div class="help-text">
          <p>提示：请复制整个地址栏的内容，而不是只复制验证码</p>
        </div>

        <div class="actions">
          <button 
            class="cancel-btn"
            @click="$emit('back')"
          >
            返回
          </button>
          <button 
            class="submit-btn"
            :disabled="!authCode.trim() || showError"
            @click="handleSubmit"
          >
            验证
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="state === 'processing'">
      <div class="loading-animation">
        <div class="spinner"></div>
        <p>正在验证登录...</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  state: 'initial' | 'code_input' | 'processing'
}>()

const emit = defineEmits(['back', 'submit'])

const authCode = ref('')
const showError = ref(false)
const errorMessage = ref('')

const handleSubmit = () => {
  const code = authCode.value.trim()
  if (!code) {
    showError.value = true
    errorMessage.value = '请输入验证码'
    return
  }

  if (!code.includes('code=')) {
    showError.value = true
    errorMessage.value = '请输入完整的验证码 URL'
    return
  }

  emit('submit', code)
}

const validateCode = (code: string) => {
  if (!code) return false
  return code.includes('https://') && code.includes('code=')
}

const handleInput = () => {
  showError.value = false
  errorMessage.value = ''
  
  const code = authCode.value.trim()
  if (code && !validateCode(code)) {
    showError.value = true
    errorMessage.value = '请输入完整的验证码 URL'
  }
}
</script>

<style scoped>
.microsoft-login-form {
  padding: 2rem;
  min-width: 400px;
}

.form-content {
  animation: formIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

h2 {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  color: var(--text-color);
  text-align: center;
}

.desc {
  margin: 0 0 1.5rem;
  color: var(--secondary-text);
  text-align: center;
  line-height: 1.5;
}

.input-section {
  margin-bottom: 1.5rem;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(var(--theme-color-rgb), 0.2);
  border-radius: 8px;
  background: var(--background-color);
  color: var(--text-color);
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  border-color: var(--theme-color);
  box-shadow: 0 0 0 2px rgba(var(--theme-color-rgb), 0.1);
}

input.error {
  border-color: #ff4d4f;
}

input.error:focus {
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
}

.error-message {
  display: block;
  margin-top: 0.5rem;
  color: #ff4d4f;
  font-size: 0.85rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: var(--surface-color);
  color: var(--text-color);
}

.cancel-btn:hover {
  background: rgba(var(--theme-color-rgb), 0.1);
}

.submit-btn {
  background: #00a4ef;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  filter: brightness(1.1);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 加载动画 */
.loading-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  animation: fadeIn 0.3s ease;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(0, 164, 239, 0.1);
  border-left-color: #00a4ef;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes formIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.help-text {
  margin: 1rem 0;
  padding: 0.75rem;
  background: rgba(var(--theme-color-rgb), 0.1);
  border-radius: 6px;
  font-size: 0.9rem;
  color: var(--secondary-text);
}

.help-text p {
  margin: 0;
  line-height: 1.4;
}
</style> 