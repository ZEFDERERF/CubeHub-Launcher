<template>
	<div class="agreement-container">
		<h1 class="title">用户协议</h1>
		<div class="agreement-content">
			<div class="scroll-content">
				<h2>CubeHub Launcher 用户协议</h2>
				<p>欢迎使用 CubeHub Launcher！在使用本启动器之前，请仔细阅读以下协议：</p>

				<h3>1. 使用条款</h3>
				<p>本启动器仅供个人使用，您需要遵守 Minecraft EULA 和相关法律法规。</p>

				<h3>2. 账号安全</h3>
				<p>请妥善保管您的账号信息，本启动器不会存储您的密码。</p>

				<h3>3. 免责声明</h3>
				<p>本启动器不对使用过程中可能发生的任何损失负责。</p>
			</div>
		</div>
		<div class="actions">
			<label class="checkbox-container">
				<input type="checkbox" v-model="agreed" />
				<span class="checkmark"></span>
				我已阅读并同意用户协议
			</label>
			<button
				class="next-button"
				:class="{ disabled: !agreed }"
				:disabled="!agreed"
				@click="handleNext"
			>
				下一步
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const agreed = ref(false);

const handleNext = async () => {
	if (agreed.value) {
		try {
			await router.push('/start/login');
		} catch (err) {
			if (!err.message.includes('does not provide an export named')) {
				console.warn('导航警告:', err);
			}
		}
	}
};
</script>

<style scoped>
@font-face {
	font-family: 'CubeHub';
	src: url('../../assets/Fonts/Font.ttf') format('truetype');
}

.agreement-container {
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

.agreement-content {
	background: var(--surface-color);
	border-radius: 8px;
	padding: 2rem;
	margin-bottom: 2rem;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
	height: 400px;
	overflow: hidden;
}

.scroll-content {
	height: 100%;
	overflow-y: auto;
	padding-right: 1rem;
}

h2,
h3 {
	color: var(--text-color);
	margin-bottom: 1rem;
}

p {
	color: var(--secondary-text-color);
	line-height: 1.6;
	margin-bottom: 1rem;
}

.actions {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.checkbox-container {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	cursor: pointer;
	color: var(--text-color);
}

.next-button {
	background: var(--primary-color);
	color: white;
	border: none;
	padding: 0.8rem 2rem;
	border-radius: 4px;
	cursor: pointer;
	font-size: 1rem;
	transition: all 0.3s;
	font-family: 'CubeHub', sans-serif;
}

.next-button:hover:not(.disabled) {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.next-button.disabled {
	opacity: 0.5;
	cursor: not-allowed;
}
</style>
