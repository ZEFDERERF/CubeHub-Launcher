<template>
	<div class="offline-login">
		<div class="form-header">
			<button class="back-btn" @click="$emit('back')">
				<svg viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"
					/>
				</svg>
			</button>
			<h2>离线登录</h2>
		</div>

		<form @submit.prevent="handleSubmit" class="login-form">
			<div class="form-group">
				<label for="username">游戏名称</label>
				<div class="input-wrapper">
					<input
						id="username"
						v-model="username"
						type="text"
						placeholder="请输入游戏名称"
						:class="{ error: error }"
						:maxlength="16"
						@input="handleInput"
						required
					/>
					<span class="input-counter" :class="{ error: username.length > 16 }">
						{{ username.length }}/16
					</span>
				</div>
				<span class="input-desc">游戏中显示的名称，支持中文</span>
				<span v-if="error" class="error-message">{{ error }}</span>
			</div>

			<button type="submit" class="submit-btn" :disabled="!isValid || username.length > 16">
				开始游戏
			</button>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const username = ref('');
const error = ref('');

const isValid = computed(() => {
	const trimmedUsername = username.value.trim();
	if (!trimmedUsername) {
		error.value = '请输入游戏名称';
		return false;
	}
	if (trimmedUsername.length > 16) {
		error.value = '游戏名称不能超过16个字符';
		return false;
	}
	error.value = '';
	return true;
});

const emit = defineEmits(['back', 'submit']);

const handleInput = () => {
	if (!username.value.trim()) {
		error.value = '请输入游戏名称';
	} else if (username.value.length > 16) {
		error.value = '游戏名称不能超过16个字符';
	} else {
		error.value = '';
	}
};

const handleSubmit = () => {
	if (isValid.value) {
		console.log('提交离线登录:', username.value.trim());
		emit('submit', username.value.trim());
	}
};
</script>

<style scoped>
.offline-login {
	padding: 2rem;
	width: 400px;
	background: var(--surface-color);
	border-radius: 12px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	animation: formIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
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

.form-header {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-bottom: 2rem;
}

.back-btn {
	width: 36px;
	height: 36px;
	border: none;
	border-radius: 8px;
	background: transparent;
	color: var(--text-color);
	cursor: pointer;
	padding: 0.5rem;
	transition: all 0.3s ease;
}

.back-btn:hover {
	background: rgba(var(--theme-color-rgb), 0.1);
	transform: translateX(-2px);
}

.back-btn svg {
	width: 20px;
	height: 20px;
}

h2 {
	font-size: 1.5rem;
	color: var(--text-color);
	margin: 0;
}

.login-form {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.form-group label {
	font-size: 0.95rem;
	color: var(--text-color);
	font-weight: 500;
}

.input-wrapper {
	position: relative;
	background: var(--background-color);
	border-radius: 8px;
	transition: all 0.3s ease;
	border: 1px solid rgba(var(--theme-color-rgb), 0.2);
}

.input-wrapper:focus-within {
	border-color: var(--theme-color);
	box-shadow: 0 0 0 3px rgba(var(--theme-color-rgb), 0.1);
}

.input-wrapper input {
	width: 100%;
	padding: 0.875rem 3rem 0.875rem 1rem;
	border: none;
	background: transparent;
	color: var(--text-color);
	font-size: 1rem;
	transition: all 0.3s ease;
}

.input-wrapper input:focus {
	outline: none;
}

.input-counter {
	position: absolute;
	right: 1rem;
	top: 50%;
	transform: translateY(-50%);
	font-size: 0.85rem;
	color: var(--secondary-text);
	pointer-events: none;
	transition: all 0.3s ease;
}

.input-desc {
	font-size: 0.85rem;
	color: var(--secondary-text);
	margin-top: 0.25rem;
}

.submit-btn {
	background: var(--theme-color);
	color: white;
	border: none;
	border-radius: 8px;
	padding: 1rem;
	font-size: 1rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.submit-btn:not(:disabled):hover {
	transform: translateY(-2px);
	filter: brightness(1.1);
	box-shadow: 0 4px 12px rgba(var(--theme-color-rgb), 0.2);
}

.submit-btn:not(:disabled):active {
	transform: scale(0.98);
}

.submit-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
	transform: none;
}

.error-message {
	color: #ff4d4f;
	font-size: 0.85rem;
	margin-top: 0.25rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.error-message::before {
	content: '!';
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 16px;
	height: 16px;
	background: #ff4d4f;
	color: white;
	border-radius: 50%;
	font-size: 0.75rem;
	font-weight: bold;
}

.input-counter.error {
	color: #ff4d4f;
}

.input-wrapper.error {
	border-color: #ff4d4f;
}

.input-wrapper.error:focus-within {
	box-shadow: 0 0 0 3px rgba(255, 77, 79, 0.1);
}
</style>
