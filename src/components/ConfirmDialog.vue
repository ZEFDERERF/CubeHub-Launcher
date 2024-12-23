<template>
	<Modal @close="$emit('close')">
		<div class="confirm-dialog">
			<h2>{{ title }}</h2>
			<p class="message">{{ message }}</p>

			<div v-if="requireInput" class="input-section">
				<p class="input-desc">请输入 <strong>Delete</strong> 以确认删除</p>
				<input
					v-model="inputText"
					type="text"
					placeholder="Delete"
					:class="{ error: showError }"
					@input="handleInput"
				/>
				<span v-if="showError" class="error-message">请输入正确的确认文本</span>
			</div>

			<div class="actions">
				<button class="cancel-btn" @click="$emit('close')">取消</button>
				<button
					class="confirm-btn"
					:class="{ danger: danger }"
					:disabled="requireInput && !isValid"
					@click="handleConfirm"
				>
					{{ props.confirmText || '确认' }}
				</button>
			</div>
		</div>
	</Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Modal from './Modal.vue';

const props = defineProps<{
	title: string;
	message: string;
	confirmText?: string;
	danger?: boolean;
	requireInput?: boolean;
}>();

const emit = defineEmits(['close', 'confirm']);

const inputText = ref('');
const showError = ref(false);

const isValid = computed(() => {
	if (!props.requireInput) return true;
	return inputText.value === 'Delete';
});

const handleInput = () => {
	showError.value = false;
};

const handleConfirm = () => {
	if (props.requireInput && !isValid.value) {
		showError.value = true;
		return;
	}
	emit('confirm');
};
</script>

<style scoped>
.confirm-dialog {
	padding: 2rem;
	width: 400px;
	background: var(--surface-color);
	border-radius: 12px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

h2 {
	margin: 0 0 1rem;
	font-size: 1.5rem;
	color: var(--text-color);
	text-align: center;
}

.message {
	margin: 0 0 1.5rem;
	color: var(--secondary-text);
	line-height: 1.5;
	text-align: center;
}

.input-section {
	margin-bottom: 1.5rem;
}

.input-desc {
	margin: 0 0 0.75rem;
	font-size: 0.9rem;
	color: var(--secondary-text);
	text-align: center;
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
	text-align: center;
}

input:focus {
	border-color: var(--theme-color);
	box-shadow: 0 0 0 2px rgba(var(--theme-color-rgb), 0.1);
	outline: none;
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
	text-align: center;
}

.actions {
	display: flex;
	justify-content: center;
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
	min-width: 100px;
}

.cancel-btn {
	background: var(--surface-color);
	color: var(--text-color);
	border: 1px solid rgba(var(--theme-color-rgb), 0.2);
}

.cancel-btn:hover {
	background: rgba(var(--theme-color-rgb), 0.1);
}

.confirm-btn {
	background: var(--theme-color);
	color: white;
}

.confirm-btn:hover:not(:disabled) {
	filter: brightness(1.1);
	transform: translateY(-1px);
}

.confirm-btn.danger {
	background: #ff4d4f;
}

.confirm-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
	transform: none;
}
</style>
