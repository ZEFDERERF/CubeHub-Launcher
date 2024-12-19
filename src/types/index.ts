export type DownloadSource = 'official' | 'bmclapi'

export type LoaderType = 'minecraft' | 'forge' | 'fabric' | 'neoforge' | 'optifine'

export interface VersionInfo {
  id: string
  type: string
  url: string
  time: string
  releaseTime: string
  downloads?: {
    client: {
      url: string
      sha1: string
      size: number
    }
  }
}

export interface DownloadTask {
  name: string
  status: 'pending' | 'downloading' | 'completed' | 'error'
  progress: number
}

export interface DownloadProgress {
  progress: number
  status: 'pending' | 'downloading' | 'completed' | 'error'
  speed: string
} 
