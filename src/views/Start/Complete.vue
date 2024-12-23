<template>
	<div class="complete-container">
		<div class="complete-content">
			<div class="check-icon">✓</div>
			<h1>设置完成！</h1>
			<p>现在您可以开始使用 CubeHub Launcher 了</p>
			<button class="start-button" @click="handleComplete">前往启动器主页</button>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { configManager } from '../../utils/config';
import { onMounted } from 'vue';

const router = useRouter();

onMounted(async () => {
	// 标记初始化完成
	await configManager.setInitialized(true);
});

const handleComplete = async () => {
	router.push('/');
};
</script>

<style scoped>
@font-face {
	font-family: 'CubeHub';
	src: url('../../assets/Fonts/Font.ttf') format('truetype');
}

.complete-container {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	padding: 2rem;
	font-family: 'CubeHub', sans-serif;
}

.complete-content {
	text-align: center;
	animation: fadeInUp 0.6s ease-out;
}

.check-icon {
	font-size: 4rem;
	color: var(--primary-color);
	margin-bottom: 1rem;
}

h1 {
	color: var(--text-color);
	font-size: 2.5rem;
	margin-bottom: 1rem;
}

p {
	color: var(--secondary-text-color);
	margin-bottom: 2rem;
}

.start-button {
	background: var(--primary-color);
	color: white;
	border: none;
	padding: 1rem 3rem;
	border-radius: 4px;
	font-size: 1.2rem;
	cursor: pointer;
	transition: all 0.3s;
	font-family: 'CubeHub', sans-serif;
}

.start-button:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
