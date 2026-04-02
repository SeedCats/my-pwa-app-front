<template>
  <!-- Page wrapper with animated background -->
  <div
    class="relative flex min-h-dvh flex-1 items-center justify-center overflow-hidden bg-linear-to-br from-slate-100 via-blue-50 to-indigo-100 px-4 py-8 sm:px-6 lg:px-8">

    <!-- Decorative background blobs -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-24 -left-24 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-300/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute -bottom-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse-slow [animation-delay:1.5s]"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-blue-200/20 rounded-full blur-2xl"></div>
    </div>

    <!-- Content column -->
    <div class="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl space-y-5 sm:space-y-7 animate-fade-in">

      <!-- ── Header ── -->
      <div class="text-center">
        <!-- Brand chip -->
        <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-sm">
          <span class="flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600">
            <svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
          <span class="text-xs font-semibold tracking-widest text-indigo-600 uppercase">{{ $t('nav.title') }}</span>
        </div>

        <h1 class="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-transparent">
          {{ $t('auth.welcomeBack') }}
        </h1>
        <p class="mt-1.5 text-sm sm:text-base text-gray-500">
          {{ $t('auth.signIn') }}
        </p>
      </div>

      <!-- ── Card ── -->
      <div class="rounded-2xl sm:rounded-3xl border border-white/60 bg-white/75 p-5 sm:p-7 lg:p-10 shadow-2xl shadow-indigo-100/60 backdrop-blur-xl">

        <!-- Alert: Error -->
        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0 scale-95">
          <div v-if="error" role="alert" class="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <svg class="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ error }}</span>
          </div>
        </Transition>

        <!-- Alert: Success -->
        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0 scale-95">
          <div v-if="success" role="status" class="mb-4 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <svg class="mt-0.5 h-4 w-4 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>{{ success }}</span>
          </div>
        </Transition>

        <form @submit.prevent="handleLogin" novalidate class="space-y-4 sm:space-y-5">

          <!-- ── Email input ── -->
          <div class="group">
            <label for="email-address" class="mb-1.5 block text-xs sm:text-sm font-semibold text-gray-600 tracking-wide uppercase">
              {{ $t('auth.email') }}
            </label>
            <div class="relative">
              <!-- Icon -->
              <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200">
                <svg class="h-4.5 w-4.5 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="loginForm.email"
                :placeholder="$t('auth.email')"
                :aria-label="$t('auth.email')"
                class="block w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-4 py-3 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 shadow-sm transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none touch-manipulation"
              />
            </div>
          </div>

          <!-- ── Password input ── -->
          <div class="group">
            <div class="mb-1.5">
              <label for="password" class="block text-xs sm:text-sm font-semibold text-gray-600 tracking-wide uppercase">
                {{ $t('auth.password') }}
              </label>
            </div>
            <div class="relative">
              <!-- Icon -->
              <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200">
                <svg class="h-4.5 w-4.5 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                v-model="loginForm.password"
                :placeholder="$t('auth.password')"
                :aria-label="$t('auth.password')"
                class="block w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-11 py-3 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 shadow-sm transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none touch-manipulation"
              />
              <!-- Show / hide toggle -->
              <button
                type="button"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? $t('auth.hidePassword') : $t('auth.showPassword')"
                class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-indigo-500 transition-colors duration-200 focus:outline-none focus-visible:text-indigo-600"
              >
                <!-- Eye open -->
                <svg v-if="!showPassword" class="h-4.5 w-4.5 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <!-- Eye closed -->
                <svg v-else class="h-4.5 w-4.5 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- ── Remember me ── -->
          <div class="flex items-center justify-between pt-0.5">
            <label for="remember-me" class="flex cursor-pointer items-center gap-3 group">
              <div class="relative shrink-0">
                <input id="remember-me" name="remember-me" type="checkbox" v-model="loginForm.remember" class="sr-only peer" />
                <div class="h-6 w-11 rounded-full bg-gray-200 shadow-inner transition-all duration-300 peer-checked:bg-linear-to-r peer-checked:from-indigo-500 peer-checked:to-purple-500 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400 peer-focus-visible:ring-offset-1"></div>
                <div class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 peer-checked:translate-x-5 peer-checked:shadow-indigo-200/80"></div>
              </div>
              <span class="select-none text-sm sm:text-base font-medium text-gray-700 transition-colors duration-200 group-hover:text-indigo-600">
                {{ $t('auth.rememberMe') }}
              </span>
            </label>

            <!-- Tooltip -->
            <div class="group/tip relative ml-2 shrink-0">
              <svg class="h-4 w-4 cursor-help text-gray-400 transition-colors hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="pointer-events-none absolute bottom-6 right-0 z-20 w-max max-w-52 rounded-xl bg-gray-800 px-3 py-2 text-xs text-white opacity-0 shadow-xl transition-all duration-200 group-hover/tip:opacity-100">
                {{ $t('auth.rememberMeInfo') }}
                <div class="absolute -bottom-1 right-3 h-2 w-2 rotate-45 bg-gray-800"></div>
              </div>
            </div>
          </div>

          <!-- ── Action buttons ── -->
          <div class="space-y-3 pt-1 sm:space-y-3.5">
            <!-- Sign In -->
            <button
              type="submit"
              :disabled="loading"
              class="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl sm:rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-3.5 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-300/50 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 touch-manipulation min-h-12 disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100! disabled:shadow-none"
            >
              <!-- Shimmer overlay -->
              <span class="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true"></span>
              <svg v-if="loading" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              {{ loading ? $t('common.loading') : $t('auth.login') }}
            </button>

            <!-- Divider -->
            <div class="relative flex items-center gap-3 py-0.5">
              <div class="h-px flex-1 bg-gray-200"></div>
              <span class="text-xs text-gray-400 font-medium select-none">or</span>
              <div class="h-px flex-1 bg-gray-200"></div>
            </div>

            <!-- Register -->
            <button
              type="button"
              @click="handleRegister"
              :disabled="loading"
              class="group flex w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 touch-manipulation min-h-12 disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100!"
            >
              <svg class="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              {{ $t('auth.register') }}
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
import { useI18n } from 'vue-i18n'
import { checkAuth, useUserStore } from '../stores/userStore.js'

const router = useRouter()
const { t } = useI18n()
const REMEMBER_EMAIL_KEY = 'rememberedEmail'
const API_URL = import.meta.env.VITE_API_URL || ''

// Check if already authenticated via API
onMounted(async () => {
  // Clear all localStorage except login-related items
  const keysToKeep = [REMEMBER_EMAIL_KEY, 'theme', 'darkMode']
  const saved = Object.fromEntries(keysToKeep.flatMap(k => { const v = localStorage.getItem(k); return v !== null ? [[k, v]] : [] }))
  localStorage.clear()
  Object.entries(saved).forEach(([k, v]) => localStorage.setItem(k, v))

  // Load remembered email if exists
  const rememberedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY)
  if (rememberedEmail) {
    loginForm.value.email = rememberedEmail
    loginForm.value.remember = true
  }

  try {
    const authed = await checkAuth()
    if (authed) {
      const state = useUserStore()
      if (state.user && state.user.role === 'admin') {
        router.push({ name: 'AdminDashboard' })
      } else {
        router.push({ name: 'home' })
      }
    }
  } catch { /* not authenticated */ }
})

// State
const loading = ref(false)
const error = ref('')
const success = ref('')
const showPassword = ref(false)
const loginForm = ref({ email: '', password: '', remember: false })

async function handleLogin() {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(loginForm.value),
    })

    const data = await response.json().catch(() => null)
    if (!data) {
      error.value = t('auth.invalidResponse')
      return
    }

    if (response.ok && data.success) {
      if (loginForm.value.remember) localStorage.setItem(REMEMBER_EMAIL_KEY, loginForm.value.email)
      else localStorage.removeItem(REMEMBER_EMAIL_KEY)
      success.value = data.message || t('auth.loginSuccess')
      await checkAuth(true)
      const state = useUserStore()
      router.push({ name: state.user?.role === 'admin' ? 'AdminDashboard' : 'home' })
    } else {
      error.value = data.message || t('auth.loginFailed')
    }
  } catch (err) {
    error.value = err.name === 'TypeError' && err.message.includes('fetch')
      ? t('auth.serverConnectionError')
      : t('auth.networkError')
  } finally {
    loading.value = false
  }
}

const handleRegister = () => router.push('/register')
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50%       { opacity: 0.9; transform: scale(1.05); }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
.animate-fade-in    { animation: fade-in 0.5s ease-out both; }
</style>
