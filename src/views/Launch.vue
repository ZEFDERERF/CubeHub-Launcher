<template>
	<div class="launch-container">
		<BackButton />
		<div class="launch-header">
			<h1>启动游戏</h1>
			<div class="selected-version" v-if="selectedVersion">
				<span>已选择版本：{{ selectedVersion.name }}</span>
				<span class="version-type">{{ selectedVersion.type }}</span>
			</div>
		</div>

		<div class="launch-options">
			<div class="memory-settings">
				<h3>内存设置</h3>
				<div class="memory-sliders">
					<div class="slider-group">
						<label>最小内存: {{ minMemory }}GB</label>
						<input type="range" v-model="minMemory" min="1" max="16" step="0.5" />
					</div>
					<div class="slider-group">
						<label>最大内存: {{ maxMemory }}GB</label>
						<input type="range" v-model="maxMemory" min="1" max="16" step="0.5" />
					</div>
				</div>
			</div>

			<div class="java-settings">
				<h3>Java 设置</h3>
				<select v-model="selectedJava">
					<option value="java8">Java 8</option>
					<option value="java16">Java 16</option>
					<option value="java17">Java 17</option>
				</select>
			</div>
		</div>

		<div class="launch-actions">
			<button class="launch-button" @click="launchGame">启动游戏</button>
		</div>
	</div>
</template>

<script>
import BackButton from '../components/BackButton.vue';

export default {
	name: 'Launch',
	components: {
		BackButton,
	},
	data() {
		return {
			selectedVersion: null,
			minMemory: 2,
			maxMemory: 4,
			selectedJava: 'java17',
		};
	},
	methods: {
		launchGame() {
			// TODO: 实现游戏启动逻辑
			console.log('启动游戏...');
		},
	},
};
</script>

<style scoped>
.launch-container {
	padding: 2rem;
	position: relative;
}

.launch-header {
	margin-bottom: 2rem;
}

.selected-version {
	margin-top: 1rem;
	padding: 1rem;
	background: var(--surface-color);
	border-radius: 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.version-type {
	background: var(--primary-color);
	padding: 0.25rem 0.75rem;
	border-radius: 4px;
}

.launch-options {
	background: var(--surface-color);
	padding: 2rem;
	border-radius: 8px;
	margin-bottom: 2rem;
}

.memory-settings,
.java-settings {
	margin-bottom: 2rem;
}

.memory-sliders {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-top: 1rem;
}

.slider-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

input[type='range'] {
	width: 100%;
	height: 4px;
	background: var(--primary-color);
	border-radius: 2px;
	outline: none;
}

select {
	width: 100%;
	padding: 0.5rem;
	background: var(--background-color);
	color: var(--text-color);
	border: 1px solid var(--primary-color);
	border-radius: 4px;
}

.launch-button {
	width: 100%;
	padding: 1rem;
	background: var(--primary-color);
	color: white;
	border: none;
	border-radius: 8px;
	font-size: 1.2rem;
	cursor: pointer;
	transition: all 0.3s;
}

.launch-button:hover {
	opacity: 0.9;
}
</style>
