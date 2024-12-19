<template>
  <div class="version-detail">
    <h2>{{ version }} 详细信息</h2>
    <!-- 版本详情内容 -->
  </div>
</template>

<script setup>
const props = defineProps({
  version: {
    type: String,
    required: true
  }
})
</script> 