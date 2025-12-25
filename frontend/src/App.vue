<template>
  <div id="app">
    <Navbar v-if="authStore.isAuthenticated" />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/common/AppNavbar.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
}

.main-content {
  padding-top: 60px;
}
</style>
