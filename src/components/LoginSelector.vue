<template>
  <div class="login-selector">
    <h2>选择登录方式</h2>
    <div class="login-options">
      <button 
        class="login-option microsoft"
        @click="$emit('select', 'microsoft')"
      >
        <div class="option-icon">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M2 3h9v9H2V3m9 19H2v-9h9v9M21 3v9h-9V3h9m0 19h-9v-9h9v9z"/>
          </svg>
        </div>
        <div class="option-content">
          <span class="option-title">Microsoft 登录</span>
          <span class="option-desc">使用 Microsoft 账号登录</span>
        </div>
      </button>
      
      <button 
        class="login-option offline"
        @click="$emit('select', 'offline')"
      >
        <div class="option-icon">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"/>
          </svg>
        </div>
        <div class="option-content">
          <span class="option-title">离线登录</span>
          <span class="option-desc">使用离线模式登录</span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-selector {
  padding: 2rem;
  animation: selectorIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes selectorIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  color: var(--text-color);
}

.login-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border: none;
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  text-align: left;
  animation: optionIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

.login-option.microsoft {
  animation-delay: 0.1s;
}

.login-option.offline {
  animation-delay: 0.2s;
}

@keyframes optionIn {
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.login-option::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: currentColor;
  opacity: 0.1;
  transition: opacity 0.3s ease;
}

.login-option:hover::before {
  opacity: 0.15;
}

.login-option.microsoft {
  color: #00a4ef;
}

.login-option.offline {
  color: var(--theme-color);
}

.option-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: currentColor;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.login-option:hover .option-icon {
  transform: scale(1.1) rotate(5deg);
}

.option-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.option-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.option-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-color);
}

.option-desc {
  font-size: 0.9rem;
  color: var(--secondary-text);
}

.login-option:hover {
  transform: translateY(-2px);
}

.login-option:active {
  transform: scale(0.98);
}
</style>

<script setup>
defineEmits(['select'])
</script> 