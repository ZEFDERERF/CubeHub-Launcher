<template>
  <div class="version-preview">
    <h2>版本预览</h2>
    <div class="preview-content">
      <!-- 预览内容 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'VersionPreview',
  props: {
    category: String,
    version: String
  }
}
</script>

<style scoped>
.version-preview {
  padding: 1rem;
}
</style> 