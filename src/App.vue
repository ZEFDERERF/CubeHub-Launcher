<template>
	<div id="app" :data-theme="currentTheme">
		<TitleBar :theme="theme" />
		<div class="app-container">
			<div class="background-image"></div>
			<router-view v-slot="{ Component }">
				<transition name="page" mode="out-in">
					<component :is="Component" />
				</transition>
			</router-view>
		</div>
	</div>
</template>

<script setup>
import { ref, provide } from 'vue';
import TitleBar from './components/TitleBar.vue';

const THEME_COLORS = [
	// 绿色系
	{ id: 'green-1', color: '#4CAF50', label: '绿色' },
	{ id: 'green-2', color: '#81C784', label: '浅绿' },
	{ id: 'green-3', color: '#2E7D32', label: '深绿' },
	{ id: 'green-4', color: '#66BB6A', label: '青绿' },
	{ id: 'green-5', color: '#00C853', label: '翠绿' },

	// 蓝色系
	{ id: 'blue-1', color: '#2196F3', label: '蓝色' },
	{ id: 'blue-2', color: '#64B5F6', label: '浅蓝' },
	{ id: 'blue-3', color: '#1976D2', label: '深蓝' },
	{ id: 'blue-4', color: '#0D47A1', label: '靛蓝' },
	{ id: 'blue-5', color: '#00B0FF', label: '天蓝' },

	// 紫色系
	{ id: 'purple-1', color: '#9C27B0', label: '紫色' },
	{ id: 'purple-2', color: '#BA68C8', label: '浅紫' },
	{ id: 'purple-3', color: '#7B1FA2', label: '深紫' },
	{ id: 'purple-4', color: '#6A1B9A', label: '暗紫' },
	{ id: 'purple-5', color: '#E040FB', label: '亮紫' },

	// 红色系
	{ id: 'red-1', color: '#E91E63', label: '粉红' },
	{ id: 'red-2', color: '#F48FB1', label: '浅粉' },
	{ id: 'red-3', color: '#C2185B', label: '深粉' },
	{ id: 'red-4', color: '#F44336', label: '红色' },
	{ id: 'red-5', color: '#EF5350', label: '亮红' },

	// 橙色系
	{ id: 'orange-1', color: '#FF9800', label: '橙色' },
	{ id: 'orange-2', color: '#FFB74D', label: '浅橙' },
	{ id: 'orange-3', color: '#F57C00', label: '橙' },
	{ id: 'orange-4', color: '#FF5722', label: '橘红' },
	{ id: 'orange-5', color: '#FFB300', label: '金橙' },

	// 青色系
	{ id: 'cyan-1', color: '#00BCD4', label: '青色' },
	{ id: 'cyan-2', color: '#4DD0E1', label: '浅青' },
	{ id: 'cyan-3', color: '#0097A7', label: '深青' },
	{ id: 'cyan-4', color: '#00838F', label: '墨青' },
	{ id: 'cyan-5', color: '#00E5FF', label: '亮青' },

	// 棕色系
	{ id: 'brown-1', color: '#795548', label: '棕色' },
	{ id: 'brown-2', color: '#A1887F', label: '浅棕' },
	{ id: 'brown-3', color: '#5D4037', label: '深棕' },
	{ id: 'brown-4', color: '#4E342E', label: '赭棕' },
	{ id: 'brown-5', color: '#8D6E63', label: '褐棕' },

	// 灰色系
	{ id: 'grey-1', color: '#607D8B', label: '蓝灰' },
	{ id: 'grey-2', color: '#90A4AE', label: '浅灰' },
	{ id: 'grey-3', color: '#455A64', label: '深灰' },
	{ id: 'grey-4', color: '#37474F', label: '暗灰' },
	{ id: 'grey-5', color: '#78909C', label: '亮灰' },

	// 黑白系
	{ id: 'black-1', color: '#000000', label: '黑色' },
	{ id: 'black-2', color: '#424242', label: '炭黑' },
];

const theme = ref({
	isRGBMode: false,
	isDarkMode: false,
	currentColor: THEME_COLORS[0].color,
	currentTheme: 'light',
	colors: THEME_COLORS,
});

// 提供主题给所有子组件
provide('theme', theme);

// 监听主题变化
const updateTheme = (newTheme) => {
	theme.value = { ...theme.value, ...newTheme };
	document.documentElement.style.setProperty('--theme-color', theme.value.currentColor);
	document.documentElement.setAttribute('data-theme', theme.value.currentTheme);
};

// 初始化主题
updateTheme(theme.value);

const DEFAULT_SKIN_URL =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFDUlEQVR42u2a20sUURzH97G0LKMotPuWbVpslj1olJ';

const skinUrl = ref(DEFAULT_SKIN_URL);
const isAvatarLoaded = ref(false);

// 处理头像点击
const handleAvatarClick = () => {
	// TODO: 实现头像点击逻辑，比如打开用户资料页
};

// 更新皮肤URL
const updateSkinUrl = (url) => {
	if (!url) {
		skinUrl.value = DEFAULT_SKIN_URL;
		return;
	}

	// 创建新图片对象来预加载
	const img = new Image();
	img.crossOrigin = 'anonymous';

	img.onload = () => {
		// 创建canvas来处理图片
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = 64;
		canvas.height = 64;

		// 绘制图片
		ctx.drawImage(img, 0, 0);

		// 获取头部区域
		const headCanvas = document.createElement('canvas');
		const headCtx = headCanvas.getContext('2d');
		headCanvas.width = 8;
		headCanvas.height = 8;

		// 复制头部区域 (8x8 像素，从原图的8,8位置开始)
		headCtx.drawImage(canvas, 8, 8, 8, 8, 0, 0, 8, 8);

		// 获取帽子层
		const hatCanvas = document.createElement('canvas');
		const hatCtx = hatCanvas.getContext('2d');
		hatCanvas.width = 8;
		hatCanvas.height = 8;

		// 复制帽子区域 (8x8 像素，从原图的40,8位置开始)
		hatCtx.drawImage(canvas, 40, 8, 8, 8, 0, 0, 8, 8);

		// 更新URL
		skinUrl.value = {
			head: headCanvas.toDataURL(),
			hat: hatCanvas.toDataURL(),
		};
		isAvatarLoaded.value = true;
	};

	img.onerror = () => {
		console.error('Failed to load skin:', url);
		skinUrl.value = DEFAULT_SKIN_URL;
	};

	img.src = url;
};

const homeSettings = {
	showWelcome: ref(localStorage.getItem('showWelcome') !== 'false'),
	showRecentGames: ref(localStorage.getItem('showRecentGames') !== 'false'),
};

// 提供给子组件
provide('homeSettings', homeSettings);
</script>

<style>
:root {
	--theme-color: #4caf50;
	--theme-color-light: #81c784;
	--theme-color-dark: #2e7d32;
	--background-color: #1a1a1a;
	--surface-color: #2d2d2d;
	--text-color: #ffffff;
	--secondary-text: rgba(255, 255, 255, 0.7);
	--window-border-radius: 8px;
}

/* 亮色主题 */
[data-theme='light'] {
	--background-color: #f5f5f5;
	--surface-color: #ffffff;
	--text-color: #333333;
	--secondary-text: rgba(0, 0, 0, 0.7);
}

#app {
	border-radius: var(--window-border-radius);
	font-family:
		system-ui,
		-apple-system,
		BlinkMacSystemFont,
		'Segoe UI',
		Roboto,
		'Helvetica Neue',
		Arial,
		sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	height: 100vh;
	background: var(--background-color);
	color: var(--text-color);
	overflow: hidden !important;
	position: relative;
	transition:
		background-color 0.3s ease,
		color 0.3s ease;
}

html,
body {
	overflow: hidden !important;
	height: 100vh;
	margin: 0;
	padding: 0;
}

.app-container {
	padding-top: 48px;
	height: calc(100vh - 48px);
	position: relative;
	z-index: 1;
	overflow: hidden;
}

.background-image {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-size: cover;
	background-position: center;
	opacity: 0.1;
	z-index: -1;
	transition: opacity 0.3s ease;
}

.page-enter-active,
.page-leave-active {
	transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
	opacity: 0;
}

.user-avatar {
	width: 32px;
	height: 32px;
	border-radius: 6px;
	background: var(--surface-color);
	overflow: hidden;
	position: relative;

	img {
		position: absolute;
		left: -4px;
		top: -4px;
		width: 40px;
		height: 40px;
		image-rendering: pixelated;
		transform: scale(0.5);
		transform-origin: 8px 8px;
	}
}

.avatar-container {
	position: relative;
	width: 32px;
	height: 32px;
	border-radius: 6px;
	overflow: hidden;
	background: var(--surface-color);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	cursor: pointer;

	&:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

		.skin-head,
		.skin-hat {
			transform: scale(1.1);
		}
	}

	&:active {
		transform: scale(0.95);
	}

	.skin-head,
	.skin-hat {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		image-rendering: pixelated;
		transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.skin-hat {
		mix-blend-mode: multiply;
	}
}

/* 头像加载动画 */
@keyframes avatarFadeIn {
	from {
		opacity: 0;
		transform: scale(0.8);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

.avatar-container {
	animation: avatarFadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.skin-hat {
	animation: avatarFadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
