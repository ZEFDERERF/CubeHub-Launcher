<template>
	<Teleport to="body">
		<TransitionGroup name="notification">
			<div
				v-for="notification in notifications"
				:key="notification.id"
				class="notification"
				:class="notification.type"
				:style="{ '--duration': notification.duration + 'ms' }"
			>
				<div class="notification-content">
					<div class="text">{{ notification.message }}</div>
					<div class="icon">
						<svg viewBox="0 0 24 24">
							<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
								<path stroke-dasharray="72" stroke-dashoffset="72" d="M3 19.5v-15.5c0 -0.55 0.45 -1 1 -1h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-14.5Z">
									<animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="72;0"/>
								</path>
								<path stroke-dasharray="10" stroke-dashoffset="10" d="M8 7h8">
									<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="10;0"/>
								</path>
								<path stroke-dasharray="10" stroke-dashoffset="10" d="M8 10h8">
									<animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="10;0"/>
								</path>
								<path stroke-dasharray="6" stroke-dashoffset="6" d="M8 13h4">
									<animate fill="freeze" attributeName="stroke-dashoffset" begin="1.3s" dur="0.2s" values="6;0"/>
								</path>
							</g>
						</svg>
					</div>
				</div>
				<div class="progress-bar" style="animation-duration: var(--duration)" />
			</div>
		</TransitionGroup>
	</Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Notification {
	id: number;
	message: string;
	type: 'success' | 'error';
	duration: number;
	startTime: number;
}

const notifications = ref<Notification[]>([]);
let notificationId = 0;

const show = (message: string, type: 'success' | 'error' = 'success', duration = 5000) => {
	const id = ++notificationId;
	const notification = {
		id,
		message,
		type,
		duration,
		startTime: performance.now()
	};
	
	notifications.value.push(notification);

	const animate = () => {
		const now = performance.now();
		const elapsed = now - notification.startTime;
		
		if (elapsed >= duration) {
			const index = notifications.value.findIndex(n => n.id === id);
			if (index !== -1) {
				notifications.value.splice(index, 1);
			}
			return;
		}
		
		requestAnimationFrame(animate);
	};
	
	requestAnimationFrame(animate);
};

defineExpose({ show });
</script>

<style scoped>
@font-face {
	font-family: 'MinecraftFont';
	src: url('../assets/Fonts/Font.ttf') format('truetype');
}

.notification {
	position: fixed;
	bottom: 120px;
	left: 24px;
	padding: 1rem;
	border-radius: 12px;
	background: var(--surface-color);
	color: var(--text-color);
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
	min-width: 300px;
	max-width: 400px;
	z-index: 9999;
	overflow: hidden;
	animation: breathe 3s ease-in-out infinite;
	backdrop-filter: blur(10px);
	border: 1px solid rgba(var(--theme-color-rgb), 0.1);
	pointer-events: none;
	font-family: 'MinecraftFont', system-ui, -apple-system, sans-serif;
}

.notification-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
}

.icon {
	width: 24px;
	height: 24px;
	flex-shrink: 0;
	order: 2;
	opacity: 0.8;
}

.icon svg {
	width: 100%;
	height: 100%;
	stroke: var(--text-color);
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
}

.text {
	font-size: 0.95rem;
	line-height: 1.4;
	order: 1;
}

.progress-bar {
	position: absolute;
	bottom: 0;
	left: 0;
	height: 3px;
	background: var(--theme-color);
	width: 100%;
	transform-origin: left;
	animation: progress var(--duration) linear forwards;
}

.success .icon,
.error .icon {
	color: var(--text-color);
}

@keyframes progress {
	from {
		transform: scaleX(1);
	}
	to {
		transform: scaleX(0);
	}
}

@keyframes breathe {
	0% {
		opacity: 0.8;
		transform: scale(1);
	}
	50% {
		opacity: 1;
		transform: scale(1.02);
	}
	100% {
		opacity: 0.8;
		transform: scale(1);
	}
}

.notification-enter-active,
.notification-leave-active {
	transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	transform-origin: center;
}

.notification-enter-from {
	opacity: 0;
	transform: translateX(-100%) scale(0.8);
}

.notification-leave-to {
	opacity: 0;
	clip-path: inset(0 50% 0 50%);
	transform: scale(0.5);
}

.notification-move {
	transition: transform 0.3s ease;
}
</style> 