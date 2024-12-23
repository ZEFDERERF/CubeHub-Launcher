import { invoke } from '@tauri-apps/api';
import { join, appDataDir } from '@tauri-apps/api/path';
import { exists, createDir } from '@tauri-apps/api/fs';
import { DownloadProgress, VersionInfo } from '../types';

class DownloadManager {
	private static instance: DownloadManager;
	private downloadTasks: Map<string, DownloadProgress>;
	private downloadPath: string | null = null;

	private constructor() {
		this.downloadTasks = new Map();
	}

	static getInstance(): DownloadManager {
		if (!DownloadManager.instance) {
			DownloadManager.instance = new DownloadManager();
		}
		return DownloadManager.instance;
	}

	async initialize() {
		try {
			// 获取下载路径
			const appData = await appDataDir();
			this.downloadPath = await join(appData, 'CubeHub', 'downloads');

			// 确保下载目录存在
			if (!(await exists(this.downloadPath))) {
				await createDir(this.downloadPath, { recursive: true });
			}
		} catch (error) {
			console.error('初始化下载管理器失败:', error);
			throw error;
		}
	}

	async downloadMinecraft(version: string): Promise<void> {
		try {
			// 获取版本信息
			const versionInfo = await this.getVersionInfo(version);
			if (!versionInfo?.downloads?.client) {
				throw new Error(`无法获取 Minecraft ${version} 的下载信息`);
			}

			// 开始下载
			const downloadUrl = versionInfo.downloads.client.url;
			const fileName = `minecraft-${version}.jar`;
			await this.startDownload(downloadUrl, fileName, `Minecraft ${version}`);
		} catch (error) {
			console.error(`下载 Minecraft ${version} 失败:`, error);
			throw error;
		}
	}

	async downloadForge(minecraftVersion: string): Promise<void> {
		try {
			// 获取对应的 Forge 版本
			const forgeVersion = await this.getLatestForgeVersion(minecraftVersion);
			if (!forgeVersion) {
				throw new Error(`无法获取 Minecraft ${minecraftVersion} 对应的 Forge 版本`);
			}

			// 构建下载 URL 和文件名
			const downloadUrl = `https://maven.minecraftforge.net/net/minecraftforge/forge/${minecraftVersion}-${forgeVersion}/forge-${minecraftVersion}-${forgeVersion}-installer.jar`;
			const fileName = `forge-${minecraftVersion}-${forgeVersion}-installer.jar`;

			// 开始下载
			await this.startDownload(
				downloadUrl,
				fileName,
				`Forge ${minecraftVersion}-${forgeVersion}`
			);
		} catch (error) {
			console.error(`下载 Forge 失败:`, error);
			throw error;
		}
	}

	private async startDownload(url: string, fileName: string, taskName: string) {
		try {
			if (!this.downloadPath) {
				throw new Error('下载管理器未初始化');
			}

			// 创建下载任务
			const taskId = `${taskName}-${Date.now()}`;
			this.downloadTasks.set(taskId, {
				progress: 0,
				status: 'pending',
				speed: '0 KB/s',
			});

			// 调用 Rust 下载函数
			await invoke('download_file', {
				url,
				filePath: await join(this.downloadPath, fileName),
				taskId,
			});

			// 更新任务状态
			this.downloadTasks.set(taskId, {
				progress: 100,
				status: 'completed',
				speed: '0 KB/s',
			});
		} catch (error) {
			console.error('下载失败:', error);
			throw error;
		}
	}

	private async getVersionInfo(version: string): Promise<VersionInfo | null> {
		try {
			const response = await fetch(
				`https://launchermeta.mojang.com/v1/packages/${version}.json`
			);
			if (!response.ok) {
				throw new Error(`获取版本信息失败: ${response.statusText}`);
			}
			return await response.json();
		} catch (error) {
			console.error('获取版本信息失败:', error);
			return null;
		}
	}

	private async getLatestForgeVersion(minecraftVersion: string): Promise<string | null> {
		try {
			const response = await fetch(
				`https://files.minecraftforge.net/maven/net/minecraftforge/forge/promotions_slim.json`
			);
			if (!response.ok) {
				throw new Error('获取 Forge 版本信息失败');
			}

			const data = await response.json();
			const recommended = data.promos[`${minecraftVersion}-recommended`];
			const latest = data.promos[`${minecraftVersion}-latest`];

			return recommended || latest || null;
		} catch (error) {
			console.error('获取 Forge 版本失败:', error);
			return null;
		}
	}

	getDownloadProgress(taskId: string): DownloadProgress | undefined {
		return this.downloadTasks.get(taskId);
	}

	getAllDownloadTasks(): Map<string, DownloadProgress> {
		return this.downloadTasks;
	}
}

// 导出单例实例
export const downloadManager = DownloadManager.getInstance();
