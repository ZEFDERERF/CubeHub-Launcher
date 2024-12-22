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
  id: string
  name: string
  url: string
  fileName: string
  progress: number
  status: 'pending' | 'downloading' | 'completed' | 'error'
  speed: string
  createdAt: string
}

export interface DownloadProgress {
  progress: number
  status: 'pending' | 'downloading' | 'completed' | 'error'
  speed: string
}

export interface Account {
  id: string
  type: 'microsoft' | 'offline'
  username: string
  avatar: string
  accessToken?: string
  refreshToken?: string
  expiresAt?: string
  skinPath?: string
  createdAt: string
}

export interface MicrosoftAuthResult {
  id: string
  username: string
  avatar: string
  accessToken: string
  refreshToken: string
  expiresAt: string
}

export interface ForgeVersion {
  mcversion: string
  version: string
  build: number
  latest: boolean
  recommended: boolean
} 