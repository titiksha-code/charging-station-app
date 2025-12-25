<template>
  <nav class="navbar">
    <div class="nav-container">
      <h1 class="nav-brand">⚡ EV Charging</h1>

      <div class="nav-links">
        <RouterLink to="/stations" class="nav-link"> Stations </RouterLink>
        <RouterLink to="/map" class="nav-link"> Map View </RouterLink>
      </div>

      <div class="nav-user">
        <span class="user-name">{{ authStore.user?.name }}</span>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  font-size: 1.5rem;
  color: #2563eb;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #2563eb;
}

.nav-link.router-link-active {
  color: #2563eb;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  color: #4b5563;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #dc2626;
}
</style>
