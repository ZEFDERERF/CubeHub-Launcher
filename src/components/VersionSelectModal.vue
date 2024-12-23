<template>
	<div class="modal-overlay" v-if="show" @click="closeModal">
		<div class="modal-content" @click.stop>
			<div class="modal-header">
				<h3>选择{{ loaderName }}版本</h3>
				<button class="close-btn" @click="closeModal">&times;</button>
			</div>

			<div class="modal-body">
				<div v-if="loading" class="loading">加载中...</div>
				<div v-else-if="error" class="error">
					{{ error }}
				</div>
				<div v-else class="version-list">
					<div
						v-for="ver in versions"
						:key="ver.id"
						class="version-item"
						:class="{ active: selectedVersion === ver.id }"
						@click="selectVersion(ver)"
					>
						<span class="version-name">{{ ver.version }}</span>
						<span class="version-type">{{ ver.type }}</span>
					</div>
				</div>
			</div>

			<div class="modal-footer">
				<button class="confirm-btn" :disabled="!selectedVersion" @click="confirmSelection">
					确认选择
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { downloadManager } from '@/services/downloadManager';

export default {
	name: 'VersionSelectModal',
	props: {
		show: Boolean,
		loader: String,
	},
	data() {
		return {
			loading: false,
			error: null,
			versions: [],
			selectedVersion: null,
		};
	},
	computed: {
		loaderName() {
			const names = {
				forge: 'Forge',
				fabric: 'Fabric',
				neoforge: 'NeoForge',
				optifine: 'OptiFine',
			};
			return names[this.loader] || this.loader;
		},
	},
	watch: {
		show(newVal) {
			if (newVal) {
				this.loadVersions();
			}
		},
	},
	methods: {
		async loadVersions() {
			this.loading = true;
			this.error = null;
			try {
				const versions = await downloadManager.getVersionList(this.loader, this.mcVersion);
				this.versions = versions;
			} catch (err) {
				this.error = '加载版本列表失败，请检查网络连接或切换下载源';
				console.error(err);
			} finally {
				this.loading = false;
			}
		},
		selectVersion(version) {
			this.selectedVersion = version.id;
		},
		confirmSelection() {
			const selectedVer = this.versions.find((v) => v.id === this.selectedVersion);
			this.$emit('select', selectedVer);
			this.closeModal();
		},
		closeModal() {
			this.selectedVersion = null;
			this.$emit('update:show', false);
		},
	},
};
</script>

<style scoped>
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.modal-content {
	background: var(--surface-color);
	border-radius: 8px;
	width: 90%;
	max-width: 500px;
	max-height: 80vh;
	display: flex;
	flex-direction: column;
}

.modal-header {
	padding: 1rem;
	border-bottom: 1px solid var(--border-color);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.close-btn {
	background: none;
	border: none;
	font-size: 1.5rem;
	cursor: pointer;
	color: var(--text-color);
}

.modal-body {
	flex: 1;
	overflow-y: auto;
	padding: 1rem;
}

.version-list {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.version-item {
	padding: 0.75rem;
	border-radius: 4px;
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	align-items: center;
	transition: all 0.3s;
}

.version-item:hover {
	background: var(--hover-color);
}

.version-item.active {
	background: var(--primary-color);
	color: white;
}

.version-type {
	font-size: 0.9rem;
	color: var(--secondary-text-color);
}

.modal-footer {
	padding: 1rem;
	border-top: 1px solid var(--border-color);
	display: flex;
	justify-content: flex-end;
}

.confirm-btn {
	padding: 0.5rem 1.5rem;
	background: var(--primary-color);
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: all 0.3s;
}

.confirm-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.confirm-btn:not(:disabled):hover {
	opacity: 0.9;
}

.loading,
.error {
	text-align: center;
	padding: 2rem;
	color: var(--secondary-text-color);
}

.error {
	color: #f44336;
}
</style>
