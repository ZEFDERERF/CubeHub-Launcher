<template>
	<Teleport to="body">
		<div
			v-if="show"
			class="context-menu"
			:style="{ top: `${y}px`, left: `${x}px` }"
			@contextmenu.prevent
		>
			<div class="menu-items">
				<button class="menu-item" @click="handleCopy">
					<div class="icon">
						<svg viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
							/>
						</svg>
					</div>
					<span>复制</span>
					<span class="shortcut">Ctrl+C</span>
				</button>
				<button class="menu-item" @click="handlePaste">
					<div class="icon">
						<svg viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z"
							/>
						</svg>
					</div>
					<span>粘贴</span>
					<span class="shortcut">Ctrl+V</span>
				</button>
			</div>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const show = ref(false);
const x = ref(0);
const y = ref(0);

const handleContextMenu = (e: MouseEvent) => {
	e.preventDefault(); // 始终阻止默认右键菜单
	
	const selection = window.getSelection()?.toString();
	const target = e.target as Element;
	const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
	const isInConfirmDialog = target.closest('.confirm-dialog');
	
	// 如果在确认对话框中，不显示右键菜单
	if (isInConfirmDialog) {
		show.value = false;
		return;
	}
	
	// 如果有文本被选中，显示菜单
	if (selection) {
		x.value = e.clientX;
		y.value = e.clientY;
		show.value = true;
		return;
	}
	
	// 如果是在输入框中，显示菜单
	if (isInput) {
		x.value = e.clientX;
		y.value = e.clientY;
		show.value = true;
		return;
	}
	
	show.value = false;
};

const handleClick = (e: MouseEvent) => {
	if (!e.target || !(e.target as Element).closest('.context-menu')) {
		show.value = false;
	}
};

const handleCopy = async () => {
	try {
		const selection = window.getSelection()?.toString();
		if (selection) {
			await navigator.clipboard.writeText(selection);
		}
	} catch (err) {
		console.error('复制失败:', err);
	}
	show.value = false;
};

const handlePaste = async () => {
	try {
		const text = await navigator.clipboard.readText();
		const activeElement = document.activeElement as HTMLInputElement;
		if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
			const start = activeElement.selectionStart || 0;
			const end = activeElement.selectionEnd || 0;
			activeElement.value = activeElement.value.slice(0, start) + text + activeElement.value.slice(end);
			activeElement.setSelectionRange(start + text.length, start + text.length);
		}
	} catch (err) {
		console.error('粘贴失败:', err);
	}
	show.value = false;
};

onMounted(() => {
	document.addEventListener('contextmenu', handleContextMenu);
	document.addEventListener('click', handleClick);
});

onUnmounted(() => {
	document.removeEventListener('contextmenu', handleContextMenu);
	document.removeEventListener('click', handleClick);
});
</script>

<style scoped>
.context-menu {
	position: fixed;
	z-index: 1000;
	background: var(--surface-color);
	border-radius: 12px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
	padding: 0.5rem;
	min-width: 200px;
	animation: menuIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
	transform-origin: top left;
	border: 1px solid rgba(var(--theme-color-rgb), 0.1);
	backdrop-filter: blur(10px);
}

.menu-items {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.menu-item {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.5rem 0.75rem;
	border: none;
	background: none;
	color: var(--text-color);
	font-size: 0.9rem;
	cursor: pointer;
	border-radius: 6px;
	transition: all 0.2s ease;
	width: 100%;
	text-align: left;
}

.menu-item:hover {
	background: rgba(var(--theme-color-rgb), 0.1);
}

.menu-item:active {
	background: rgba(var(--theme-color-rgb), 0.2);
	transform: scale(0.98);
}

.icon {
	width: 16px;
	height: 16px;
	opacity: 0.8;
}

.shortcut {
	margin-left: auto;
	font-size: 0.8rem;
	opacity: 0.6;
}

@keyframes menuIn {
	from {
		opacity: 0;
		transform: scale(0.95);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}
</style> 