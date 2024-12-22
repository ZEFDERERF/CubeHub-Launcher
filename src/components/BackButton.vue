<template>
  <button class="back-btn" @click="goBack">
    返回
  </button>
</template>

<script>
export default {
  name: 'BackButton',
  methods: {
    goBack() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.back-btn {
  position: absolute;
  top: 2rem;
  right: 2rem;
  padding: 0.5rem 1.5rem;
  background: var(--surface-color);
  color: var(--text-color);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style> 