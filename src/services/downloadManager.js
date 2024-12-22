class DownloadManager {
  constructor() {
    this.maxConcurrent = 16;
    this.downloadSource = localStorage.getItem('downloadSource') || 'official';
  }

  setDownloadSource(source) {
    this.downloadSource = source;
    localStorage.setItem('downloadSource', source);
  }

  setMaxConcurrent(max) {
    this.maxConcurrent = max;
    localStorage.setItem('maxDownloads', max);
  }

  // 这里可以添加更多下载相关的方法
}

export const downloadManager = new DownloadManager(); 