import { fs, path, Command } from '@tauri-apps/api';

export class DownloadManager {
  private static instance: DownloadManager;
  private downloadQueue: Map<string, {
    progress: number,
    status: 'pending' | 'downloading' | 'completed' | 'error',
    cancel?: () => void
  }>;

  private constructor() {
    this.downloadQueue = new Map();
  }

  static getInstance(): DownloadManager {
    if (!this.instance) {
      this.instance = new DownloadManager();
    }
    return this.instance;
  }

  async downloadVersion(version: string, type: 'vanilla' | 'forge' | 'fabric') {
    const baseDir = await path.appDir();
    const mcDir = await path.join(baseDir, '.minecraft');
    const versionsDir = await path.join(mcDir, 'versions');
    
    // 确保目录存在
    await fs.createDir(versionsDir, { recursive: true });

    // 获取下载URL
    const manifest = await this.getVersionManifest();
    const versionInfo = await this.getVersionInfo(version, manifest);
    
    // 下载主文件
    await this.downloadFile(
      versionInfo.downloads.client.url,
      await path.join(versionsDir, `${version}/${version}.jar`)
    );

    // 如果需要安装Mod加载器
    if (type === 'forge') {
      await this.installForge(version);
    } else if (type === 'fabric') {
      await this.installFabric(version);
    }

    // 生成启动配置
    await this.generateLaunchConfig(version, type);
  }

  private async installForge(mcVersion: string) {
    // 获取最新的Forge版本
    const forgeVersion = await this.getLatestForgeVersion(mcVersion);
    const installerUrl = `https://files.minecraftforge.net/maven/net/minecraftforge/forge/${mcVersion}-${forgeVersion}/forge-${mcVersion}-${forgeVersion}-installer.jar`;
    
    // 下载并运行Forge安装器
    const installerPath = await path.join(await path.tempDir(), 'forge-installer.jar');
    await this.downloadFile(installerUrl, installerPath);
    
    // 执行安装
    await this.executeJar(installerPath, ['--install', '--client']);
  }

  private async installFabric(mcVersion: string) {
    // 获取Fabric安装器
    const fabricInstallerUrl = 'https://maven.fabricmc.net/net/fabricmc/fabric-installer/latest/fabric-installer.jar';
    const installerPath = await path.join(await path.tempDir(), 'fabric-installer.jar');
    
    await this.downloadFile(fabricInstallerUrl, installerPath);
    
    // 执行安装
    await this.executeJar(installerPath, ['client', '-mcversion', mcVersion]);
  }

  private async executeJar(jarPath: string, args: string[]) {
    const command = new Command('java', ['-jar', jarPath, ...args]);
    await command.execute();
  }

  private async generateLaunchConfig(version: string, type: string) {
    const config = {
      id: `${version}-${type}`,
      type: type,
      // ... 其他配置项
    };

    const configPath = await path.join(
      await path.appDir(),
      '.minecraft',
      'versions',
      `${version}-${type}`,
      `${version}-${type}.json`
    );

    await fs.writeFile({
      path: configPath,
      contents: JSON.stringify(config, null, 2)
    });
  }

  // 进度监听
  onProgress(version: string, callback: (progress: number) => void) {
    const download = this.downloadQueue.get(version);
    if (download) {
      // 设置进度回调
    }
  }

  private async getVersionManifest() {
    const response = await fetch('https://piston-meta.mojang.com/mc/game/version_manifest_v2.json')
    if (!response.ok) throw new Error('Failed to fetch version manifest')
    return await response.json()
  }

  private async getVersionInfo(version: string, manifest: any) {
    const versionData = manifest.versions.find((v: any) => v.id === version)
    if (!versionData) throw new Error('Version not found')
    
    const response = await fetch(versionData.url)
    if (!response.ok) throw new Error('Failed to fetch version info')
    return await response.json()
  }

  private async downloadFile(url: string, destination: string) {
    // 实现文件下载逻辑
    const response = await fetch(url)
    if (!response.ok) throw new Error('Download failed')
    
    const buffer = await response.arrayBuffer()
    await fs.writeBinaryFile(destination, buffer)
  }

  public cancelDownload(version: string) {
    const download = this.downloadQueue.get(version)
    if (download?.cancel) {
      download.cancel()
      this.downloadQueue.delete(version)
    }
  }
}

// 导出类和单例实例
export { DownloadManager };
export const downloadManager = DownloadManager.getInstance(); 