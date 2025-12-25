<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">Create Account</h2>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            placeholder="Enter your name"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            placeholder="Enter your email"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            required
            minlength="6"
            placeholder="Enter your password (min 6 characters)"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            required
            placeholder="Confirm your password"
            class="form-input"
          />
        </div>

        <div v-if="localError || authStore.error" class="error-message">
          {{ localError || authStore.error }}
        </div>

        <button type="submit" :disabled="authStore.loading" class="submit-btn">
          <span v-if="!authStore.loading">Register</span>
          <span v-else>Creating account...</span>
        </button>
      </form>

      <p class="auth-link">
        Already have an account?
        <RouterLink to="/login">Login here</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const localError = ref('')

const handleRegister = async () => {
  // Clear previous errors
  localError.value = ''

  // Validate passwords match
  if (formData.value.password !== formData.value.confirmPassword) {
    localError.value = 'Passwords do not match'
    return
  }

  {
    await authStore.register(formData.value.name, formData.value.email, formData.value.password)
    router.push('/stations')
  }
}
</script>

<style scoped>
/* Same styles as LoginView.vue - reusing the same CSS */
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #1f2937;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
}

.error-message {
  padding: 0.75rem;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 0.375rem;
  text-align: center;
}

.submit-btn {
  padding: 0.75rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #6b7280;
}

.auth-link a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>
