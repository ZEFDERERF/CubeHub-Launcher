// 下载源配置
export const downloadSources = {
  official: {
    name: '官方源',
    versionManifest: 'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json',
    baseUrl: 'https://piston-meta.mojang.com',
    download: 'https://piston-meta.mojang.com/v1',
    forge: {
      api: 'https://files.minecraftforge.net/maven/net/minecraftforge/forge',
      download: 'https://files.minecraftforge.net/maven/net/minecraftforge/forge'
    },
    fabric: 'https://meta.fabricmc.net',
    neoforge: {
      api: 'https://maven.neoforged.net/api/maven/versions/releases/net/neoforged/neoforge',
      download: 'https://maven.neoforged.net/releases/net/neoforged/neoforge'
    }
  },
  bmclapi: {
    name: 'BMCLAPI',
    versionManifest: 'https://bmclapi2.bangbang93.com/mc/game/version_manifest_v2.json',
    baseUrl: 'https://bmclapi2.bangbang93.com',
    download: 'https://bmclapi2.bangbang93.com/version',
    forge: {
      api: 'https://bmclapi2.bangbang93.com/forge/list',
      download: 'https://bmclapi2.bangbang93.com/forge/download'
    },
    fabric: 'https://bmclapi2.bangbang93.com/fabric-meta',
    neoforge: {
      api: 'https://bmclapi2.bangbang93.com/neoforge/list',
      download: 'https://bmclapi2.bangbang93.com/neoforge/version'
    }
  }
}

export class Downloader {
  constructor(source = 'official', maxDownloads = 16) {
    this.source = source
    this.maxDownloads = maxDownloads
    this.onProgress = null
    this.baseUrl = downloadSources[source].baseUrl
    this.versionManifestUrl = downloadSources[source].versionManifest
    this.downloadUrl = downloadSources[source].download
    this.forgeApiUrl = downloadSources.official.forge.api
    this.forgeDownloadUrl = downloadSources[source].forge.download
    this.fabricUrl = downloadSources.official.fabric
    this.fabricDownloadUrl = downloadSources[source].fabric
    this.neoforgeApiUrl = downloadSources.official.neoforge.api
    this.neoforgeDownloadUrl = downloadSources[source].neoforge.download
  }

  formatDate(dateStr) {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}/${month}/${day} ${hours}:${minutes}`
  }

  async getVersions() {
    try {
      const response = await fetch(this.versionManifestUrl)
      if (!response.ok) throw new Error('Failed to fetch version manifest')
      const data = await response.json()
      
      // 处理版本列表
      return data.versions.map(version => ({
        id: version.id,
        type: version.type,
        url: version.url,
        time: version.releaseTime,
        category: this.getVersionCategory(version.id, version.type)
      }))
    } catch (error) {
      console.error('Failed to fetch versions:', error)
      return []
    }
  }

  async getVersionDetails(version) {
    try {
      const response = await fetch(version.url)
      if (!response.ok) throw new Error('Failed to fetch version details')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch version details:', error)
      throw error
    }
  }

  async downloadMinecraft(version) {
    try {
      let downloadUrl
      if (this.source === 'bmclapi') {
        downloadUrl = `${this.downloadUrl}/${version.id}/client`
      } else {
        const versionDetails = await this.getVersionDetails(version)
        downloadUrl = versionDetails.downloads.client.url
      }

      const downloads = [
        {
          url: downloadUrl,
          size: versionDetails.downloads.client.size,
          sha1: versionDetails.downloads.client.sha1,
          path: `versions/${version.id}/${version.id}.jar`
        }
      ]
      
      // 添加客户端 json
      downloads.push({
        url: version.url,
        path: `versions/${version.id}/${version.id}.json`
      })
      
      // 添加依赖库
      if (versionDetails.libraries) {
        for (const lib of versionDetails.libraries) {
          if (lib.downloads?.artifact) {
            downloads.push({
              url: lib.downloads.artifact.url,
              size: lib.downloads.artifact.size,
              sha1: lib.downloads.artifact.sha1,
              path: `libraries/${lib.downloads.artifact.path}`
            })
          }
        }
      }
      
      // 开始下载
      await this.processDownloads(downloads, version.id)
      
      return {
        status: 'success',
        message: '下载完成'
      }
    } catch (error) {
      console.error('Failed to download Minecraft:', error)
      throw error
    }
  }

  getVersionCategory(id, type) {
    // 处理远古版本 (alpha, beta, 和 1.0 之前的版本)
    if (id.startsWith('a') || id.startsWith('b') || 
        id.startsWith('c') || /^0\./i.test(id)) {
      return 'old'
    }
    
    // 处理快照版本
    if (type === 'snapshot' || 
        /(-pre|-rc|[a-z]+\d*$)/i.test(id)) {
      return 'snapshot'
    }
    
    // 其他都视为正式版
    return 'release'
  }

  async processDownloads(downloads, versionId) {
    // 实现并行下载逻辑
    const chunks = []
    for (let i = 0; i < downloads.length; i += this.maxParallel) {
      chunks.push(downloads.slice(i, i + this.maxParallel))
    }

    for (const chunk of chunks) {
      await Promise.all(chunk.map(download => this.downloadFile(download, versionId)))
    }
  }

  async downloadFile(download, versionId) {
    const response = await fetch(download.url)
    const reader = response.body.getReader()
    const contentLength = download.size

    let receivedLength = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      receivedLength += value.length
      this.progress[versionId].current += value.length

      // 触发进度更新事件
      this.onProgress?.(versionId, {
        total: this.progress[versionId].total,
        current: this.progress[versionId].current,
        percentage: (this.progress[versionId].current / this.progress[versionId].total) * 100
      })
    }
  }

  setOnProgress(callback) {
    this.onProgress = callback
  }

  async getFabricVersions(minecraftVersion) {
    try {
      const response = await fetch(`${this.fabricUrl}/v2/versions/loader/${minecraftVersion}`)
      if (!response.ok) throw new Error('Failed to fetch Fabric versions')
      const data = await response.json()
      return data.map(item => ({
        version: item.loader.version,
        date: this.formatDate(item.loader.build_time),
        stable: item.loader.stable
      }))
    } catch (error) {
      console.error('Error fetching Fabric versions:', error)
      return []
    }
  }

  async getNeoForgeVersions(minecraftVersion) {
    try {
      let response, data
      if (this.source === 'bmclapi') {
        response = await fetch(`${this.neoforgeApiUrl}`)
        if (!response.ok) throw new Error('Failed to fetch NeoForge versions')
        data = await response.json()
        return data
          .filter(v => v.mcversion === minecraftVersion)
          .map(version => ({
            version: version.version,
            date: this.formatDate(version.date),
            downloadUrl: `${this.neoforgeDownloadUrl}/${version.version}/download/installer.jar`
          }))
      } else {
        // 临时返回测试数据
        return [
          { version: '20.4.80', date: '2024/03/07 10:15' },
          { version: '20.4.75', date: '2024/03/06 18:30' },
          { version: '20.4.70', date: '2024/03/05 22:45' }
        ]
      }
    } catch (error) {
      console.error('Error fetching NeoForge versions:', error)
      return []
    }
  }

  async getForgeVersions(minecraftVersion) {
    try {
      let response, data
      if (this.source === 'bmclapi') {
        // BMCLAPI 的获取方式
        response = await fetch(`${this.forgeApiUrl}`)
        if (!response.ok) throw new Error('Failed to fetch Forge versions')
        data = await response.json()
        // 过滤出对应 MC 版本的 Forge 版本
        return data
          .filter(v => v.mcversion === minecraftVersion)
          .map(version => ({
            version: version.version,
            date: new Date(version.modified).toLocaleString(),
            downloadUrl: `${this.forgeDownloadUrl}?mcversion=${minecraftVersion}&version=${version.version}&category=installer&format=jar`
          }))
      } else {
        // 临��返回测试数据
        return [
          { version: '47.2.0', date: '2024/03/07 02:30' },
          { version: '47.1.0', date: '2024/03/06 15:45' },
          { version: '47.0.35', date: '2024/03/05 20:10' }
        ]
      }
    } catch (error) {
      console.error('Error fetching Forge versions:', error)
      return []
    }
  }
} 