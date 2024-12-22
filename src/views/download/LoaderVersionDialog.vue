<template>
  <div class="dialog-overlay" @click="$emit('close')">
    <div class="dialog-content" @click.stop>
      <h3>选择{{ getLoaderName(loader) }}版本</h3>
      <div v-if="error" class="error-message">
        获取版本列表失败: {{ error }}
      </div>
      <div class="version-list" v-if="!loading && !error">
        <button
          v-for="version in versions"
          :key="version"
          class="version-item"
          @click="handleSelect(version)"
        >
          {{ version }}
        </button>
      </div>
      <div v-if="loading" class="loading">
        加载中...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { http } from '@tauri-apps/api'

const props = defineProps({
  loader: String,
  minecraftVersion: String
})

const emit = defineEmits(['select', 'close'])
const loading = ref(true)
const versions = ref([])
const error = ref(null)

const getLoaderName = (loader) => {
  const names = {
    forge: 'Forge',
    neoforge: 'NeoForge',
    fabric: 'Fabric',
    optifine: 'OptiFine'
  }
  return names[loader] || loader
}

const fetchVersions = async () => {
  loading.value = true
  error.value = null
  versions.value = []
  
  try {
    switch (props.loader) {
      case 'forge':
        // Forge API
        const forgeRes = await http.fetch('https://files.minecraftforge.net/maven/net/minecraftforge/forge/maven-metadata.xml')
        if (forgeRes.ok) {
          // 解析XML获取版本列表
          const parser = new DOMParser()
          const xml = parser.parseFromString(forgeRes.data, 'text/xml')
          const versionings = xml.getElementsByTagName('versioning')[0]
          const versionsList = versionings.getElementsByTagName('versions')[0]
          const allVersions = Array.from(versionsList.getElementsByTagName('version'))
            .map(v => v.textContent)
            .filter(v => v.startsWith(props.minecraftVersion))
          versions.value = allVersions
        }
        break
        
      case 'fabric':
        // Fabric API
        const fabricRes = await http.fetch('https://meta.fabricmc.net/v2/versions/loader/' + props.minecraftVersion)
        if (fabricRes.ok) {
          const data = fabricRes.data
          versions.value = data.map(v => v.loader.version)
        }
        break
        
      case 'neoforge':
        // NeoForge API
        const neoforgeRes = await http.fetch('https://maven.neoforged.net/api/maven/versions/net/neoforged/neoforge')
        if (neoforgeRes.ok) {
          versions.value = neoforgeRes.data.versions
            .filter(v => v.startsWith(props.minecraftVersion))
        }
        break
        
      case 'optifine':
        // OptiFine API
        const optifineRes = await http.fetch('https://optifine.net/downloads')
        if (optifineRes.ok) {
          // 解析OptiFine下载页面获取版本列表
          // 这里需要根据实际情况解析HTML内容
          versions.value = ['HD_U_I4'] // 示例版本
        }
        break
    }
  } catch (err) {
    console.error('获取版本列表失败:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleSelect = (version) => {
  emit('select', version)
}

onMounted(fetchVersions)
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.dialog-content {
  background: var(--surface-color);
  border-radius: 12px;
  padding: 1.5rem;
  min-width: 300px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.version-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.version-item {
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: var(--background-color);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.version-item:hover {
  background: var(--theme-color);
  color: white;
}

.error-message {
  color: #f44336;
  padding: 1rem;
  background: rgba(244, 67, 54, 0.1);
  border-radius: 8px;
  margin: 1rem 0;
}
</style> 