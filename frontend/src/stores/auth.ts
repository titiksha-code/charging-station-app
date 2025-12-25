import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { authService } from '@/services/authService'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(email: string, password: string) {
    try {
      loading.value = true
      error.value = null

      const response = await authService.login(email, password)

      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)

      return response
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.message || 'Login failed'
      } else {
        error.value = 'Login failed'
      }
      throw err
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      loading.value = true
      error.value = null

      const response = await authService.register(name, email, password)

      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)

      return response
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.message || 'Registration failed'
      } else {
        error.value = 'Registration failed'
      }
      throw err
    }
  }

  function logout() {
    token.value = null
    user.value = null
    authService.logout()
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
  }
})
