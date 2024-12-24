class DownloadManager {
	constructor() {
		this.currentDownload = null;
		this.downloadProgress = 0;
		this.isDownloading = false;
	}

	async downloadVersion(version, type) {
		if (this.isDownloading) {
			throw new Error('已有下载任务正在进行中');
		}

		try {
			this.isDownloading = true;
			this.downloadProgress = 0;

			// 获取版本信息
			const manifestResponse = await fetch(
				'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json'
			);
			const manifest = await manifestResponse.json();

			const versionInfo = manifest.versions.find((v) => v.id === version);
			if (!versionInfo) {
				throw new Error('未找到指定版本');
			}

			// 获取版本详细信息
			const versionResponse = await fetch(versionInfo.url);
			const versionData = await versionResponse.json();

			let downloadUrl;
			if (type === 'vanilla') {
				downloadUrl = versionData.downloads.client.url;
			} else if (type === 'server') {
				downloadUrl = versionData.downloads.server.url;
			} else {
				throw new Error('不支持的下载类型');
			}

			// 开始下载
			const response = await fetch(downloadUrl);
			if (!response.ok) throw new Error('下载失败');

			const contentLength = response.headers.get('content-length');
			const total = parseInt(contentLength, 10);
			let received = 0;

			const reader = response.body.getReader();
			const chunks = [];

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				chunks.push(value);
				received += value.length;
				this.downloadProgress = (received / total) * 100;
			}

			// 合并数据
			const blob = new Blob(chunks);
			const url = window.URL.createObjectURL(blob);

			// 创建下载链接
			const a = document.createElement('a');
			a.href = url;
			a.download = `minecraft-${version}-${type}.jar`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);

			this.downloadProgress = 100;
			return true;
		} catch (error) {
			console.error('下载失败:', error);
			throw error;
		} finally {
			this.isDownloading = false;
			this.downloadProgress = 0;
		}
	}

	cancelDownload() {
		if (this.isDownloading) {
			this.isDownloading = false;
			this.downloadProgress = 0;
		}
	}

	getProgress() {
		return this.downloadProgress;
	}

	isInProgress() {
		return this.isDownloading;
	}
}

export const downloadManager = new DownloadManager();
