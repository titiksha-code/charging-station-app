<template>
  <div class="spinner-container">
    <div class="spinner"></div>
    <p v-if="message" class="spinner-message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
}

defineProps<Props>()
</script>

<style scoped>
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-message {
  margin-top: 1rem;
  color: #6b7280;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
