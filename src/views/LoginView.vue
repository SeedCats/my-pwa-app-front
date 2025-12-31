<template>
  <div
    class="flex min-h-[100dvh] flex-1 items-center justify-center px-3 py-6 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div class="w-full max-w-xs sm:max-w-md lg:max-w-lg space-y-4 sm:space-y-6 lg:space-y-8">
      <!-- Header Section -->
      <div class="text-center">
        <!-- Logo -->
        <div
          class="mx-auto w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg mb-4 sm:mb-6 lg:mb-8">
          <svg class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h2 class="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-1 sm:mb-2">
          Welcome Back
        </h2>
        <p class="text-sm sm:text-base lg:text-lg text-gray-600">
          Sign in to your account
        </p>
      </div>

      <!-- Login Card -->
      <div
        class="bg-white/70 backdrop-blur-lg rounded-xl sm:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-10">
        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-600">{{ success }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4 sm:space-y-6">
          <!-- Input Group -->
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur-sm">
            </div>
            <div class="relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
              <div class="col-span-2">
                <div class="relative">
                  <input id="email-address" name="email" type="email" autocomplete="email" required
                    v-model="loginForm.email" aria-label="Email address"
                    class="block w-full rounded-t-xl bg-white px-4 py-4 sm:py-4 lg:py-5 text-base sm:text-base text-gray-900 placeholder:text-gray-400 border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-500 transition-colors duration-200 touch-manipulation"
                    placeholder="Email address" />
                </div>
              </div>
              <div class="-mt-px pt-2">
                <div class="relative">
                  <input id="password" name="password" type="password" autocomplete="current-password" required
                    v-model="loginForm.password" aria-label="Password"
                    class="block w-full rounded-b-xl bg-white px-4 py-4 sm:py-4 lg:py-5 text-base sm:text-base text-gray-900 placeholder:text-gray-400 border-0 focus:ring-0 transition-colors duration-200 touch-manipulation"
                    placeholder="Password" />
                </div>
              </div>
            </div>
          </div>

          <!-- Remember Me Toggle Switch -->
          <div class="flex items-center justify-between">
            <label for="remember-me" class="flex items-center cursor-pointer group">
              <!-- Toggle Switch -->
              <div class="relative">
                <input id="remember-me" name="remember-me" type="checkbox" v-model="loginForm.remember"
                  class="sr-only peer" />
                <!-- Track -->
                <div class="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-500 transition-all duration-300 ease-in-out shadow-inner"></div>
                <!-- Thumb -->
                <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out peer-checked:translate-x-5 peer-checked:shadow-lg"></div>
              </div>
              <!-- Label -->
              <span class="ml-3 text-sm sm:text-base text-gray-700 font-medium group-hover:text-indigo-600 transition-colors duration-200 select-none">
                Remember me
              </span>
            </label>
            <!-- Info tooltip -->
            <div class="relative group/tooltip">
              <svg class="w-4 h-4 text-gray-400 hover:text-indigo-500 cursor-help transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="absolute right-0 bottom-6 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-10 shadow-lg">
                Stay account for 7 days
                <div class="absolute -bottom-1 right-2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="space-y-3 sm:space-y-4">
            <button type="submit" :disabled="loading"
              class="group flex w-full justify-center items-center rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-4 sm:py-4 lg:py-5 text-base sm:text-base lg:text-lg font-semibold text-white hover:from-indigo-700 hover:to-purple-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] touch-manipulation min-h-[48px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
              <svg v-if="loading" class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <svg v-else class="w-5 h-5 sm:w-5 sm:h-5 mr-2 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>

            <button type="button" @click="handleRegister" :disabled="loading"
              class="group flex w-full justify-center items-center rounded-xl sm:rounded-2xl bg-white border-2 border-gray-300 px-4 py-4 sm:py-4 lg:py-5 text-base sm:text-base lg:text-lg font-semibold text-gray-700 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md active:scale-[0.98] touch-manipulation min-h-[48px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
              <svg class="w-5 h-5 sm:w-5 sm:h-5 mr-2 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const REMEMBER_EMAIL_KEY = 'rememberedEmail'

// Check if already authenticated via API
onMounted(async () => {
  // Load remembered email if exists
  const rememberedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY)
  if (rememberedEmail) {
    loginForm.value.email = rememberedEmail
    loginForm.value.remember = true
  }

  try {
    const res = await fetch('/api/user/me', { credentials: 'include' })
    if (res.ok) router.push('/home')
  } catch { /* not authenticated */ }
})

// State
const loading = ref(false)
const error = ref('')
const success = ref('')
const loginForm = ref({ email: '', password: '', remember: false })

async function handleLogin() {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(loginForm.value),
    })

    const data = await response.json().catch(() => null)
    if (!data) {
      error.value = 'Invalid response from server'
      return
    }

    if (response.ok && data.success) {
      // Handle "Remember Me" - save email to localStorage
      if (loginForm.value.remember) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, loginForm.value.email)
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY)
      }
      
      success.value = data.message || 'Login successful! Redirecting...'
      setTimeout(() => router.push('/home'), 1000)
    } else {
      error.value = data.message || 'Login failed. Please check your credentials.'
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = err.name === 'TypeError' && err.message.includes('fetch')
      ? 'Cannot connect to server. Please check your internet connection.'
      : 'Network error. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

const handleRegister = () => router.push('/register')
</script>
