<template>
	<div class="custom-slider">
		<div class="slider-track">
			<div class="slider-fill" :style="{ width: `${percentage}%` }"></div>
			<div
				class="slider-thumb"
				:style="{ left: `${percentage}%` }"
				@mousedown="startDragging"
			></div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
	modelValue: {
		type: Number,
		required: true,
	},
	min: {
		type: Number,
		default: 0,
	},
	max: {
		type: Number,
		default: 100,
	},
	step: {
		type: Number,
		default: 1,
	},
});

const emit = defineEmits(['update:modelValue']);

const percentage = computed(() => {
	return ((props.modelValue - props.min) / (props.max - props.min)) * 100;
});

const isDragging = ref(false);
const sliderRef = ref(null);

const updateValue = (event) => {
	const rect = event.currentTarget.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const percentage = Math.min(Math.max(x / rect.width, 0), 1);
	const value = props.min + (props.max - props.min) * percentage;
	const steppedValue = Math.round(value / props.step) * props.step;
	emit('update:modelValue', steppedValue);
};

const startDragging = (event) => {
	isDragging.value = true;
	document.addEventListener('mousemove', onDragging);
	document.addEventListener('mouseup', stopDragging);
	event.preventDefault();
};

const onDragging = (event) => {
	if (isDragging.value) {
		updateValue(event);
	}
};

const stopDragging = () => {
	isDragging.value = false;
	document.removeEventListener('mousemove', onDragging);
	document.removeEventListener('mouseup', stopDragging);
};

onUnmounted(() => {
	document.removeEventListener('mousemove', onDragging);
	document.removeEventListener('mouseup', stopDragging);
});
</script>

<style scoped>
.custom-slider {
	position: relative;
	height: 24px;
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 0 8px;
}

.slider-track {
	position: relative;
	width: 100%;
	height: 4px;
	background: rgba(var(--theme-color-rgb), 0.1);
	border-radius: 2px;
}

.slider-fill {
	position: absolute;
	height: 100%;
	background: var(--theme-color);
	border-radius: 2px;
	pointer-events: none;
}

.slider-thumb {
	position: absolute;
	width: 16px;
	height: 16px;
	background: var(--theme-color);
	border-radius: 50%;
	transform: translate(-50%, -6px);
	cursor: grab;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease;
}

.slider-thumb:hover {
	transform: translate(-50%, -6px) scale(1.1);
	box-shadow: 0 2px 8px rgba(var(--theme-color-rgb), 0.3);
}

.slider-thumb:active {
	cursor: grabbing;
	transform: translate(-50%, -6px) scale(0.95);
	box-shadow: 0 1px 4px rgba(var(--theme-color-rgb), 0.2);
}
</style>
