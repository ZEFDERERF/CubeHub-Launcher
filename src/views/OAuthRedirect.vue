<template>
	<div class="redirect-container">
		<p>正在处理登录请求...</p>
	</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { emit } from '@tauri-apps/api/event';
import { getCurrent } from '@tauri-apps/api/window';

onMounted(async () => {
	console.log('OAuth redirect page mounted');
	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get('code');
	const error = urlParams.get('error');

	console.log('Auth params:', { code, error });

	try {
		await emit('microsoft-auth-response', { code, error });
		console.log('Auth response emitted');
	} catch (err) {
		console.error('Failed to emit auth response:', err);
	}

	setTimeout(() => {
		try {
			getCurrent().close();
		} catch (err) {
			console.error('Failed to close window:', err);
		}
	}, 1000);
});
</script>

<style scoped>
.redirect-container {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	font-family: 'CubeHub', sans-serif;
	color: var(--text-color);
}
</style>
