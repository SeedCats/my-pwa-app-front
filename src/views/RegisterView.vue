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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>

          <h2 class="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-1 sm:mb-2">
            {{ $t('auth.createAccountTitle') }}
          </h2> 
          <p class="text-sm sm:text-base lg:text-lg text-gray-600">
            {{ $t('auth.createAccountSubtitle') }}
          </p> 
        </div>

        <!-- Register Card -->
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

          <form @submit.prevent="handleRegister" class="space-y-4 sm:space-y-6">
            <!-- Name Input -->
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur-sm">
              </div>
              <div class="relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input id="name" name="name" type="text" autocomplete="name" required v-model="registerForm.name"
                    aria-label="name"
                    class="block w-full rounded-xl bg-white pl-10 sm:pl-12 pr-4 py-4 sm:py-4 lg:py-5 text-base sm:text-base text-gray-900 placeholder:text-gray-400 border-0 focus:ring-0 focus:border-indigo-500 transition-colors duration-200 touch-manipulation"
                    :placeholder="$t('auth.namePlaceholder')" />
                </div>
              </div>
            </div>

            <!-- Email and Password Input Group -->
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur-sm">
              </div>
              <div class="relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <div class="col-span-2">
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input id="email-address" name="email" type="email" autocomplete="email" required
                      v-model="registerForm.email" aria-label="Email address"
                      class="block w-full rounded-t-xl bg-white pl-10 sm:pl-12 pr-4 py-4 sm:py-4 lg:py-5 text-base sm:text-base text-gray-900 placeholder:text-gray-400 border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-500 transition-colors duration-200 touch-manipulation"
                      :placeholder="$t('auth.emailPlaceholder')" />
                  </div>
                </div>
                <div class="-mt-px pt-2">
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input id="password" name="password" type="password" autocomplete="new-password" required
                      v-model="registerForm.password" aria-label="Password"
                      class="block w-full rounded-b-xl bg-white pl-10 sm:pl-12 pr-4 py-4 sm:py-4 lg:py-5 text-base sm:text-base text-gray-900 placeholder:text-gray-400 border-0 focus:ring-0 transition-colors duration-200 touch-manipulation"
                      :placeholder="$t('auth.passwordPlaceholder')" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Confirm Password Input -->
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur-sm">
              </div>
              <div class="relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input id="confirm-password" name="confirmPassword" type="password" autocomplete="new-password"
                    required v-model="registerForm.confirmPassword" aria-label="Confirm password"
                    class="block w-full rounded-xl bg-white pl-10 sm:pl-12 pr-4 py-4 sm:py-4 lg:py-5 text-base sm:text-base text-gray-900 placeholder:text-gray-400 border-0 focus:ring-0 focus:border-indigo-500 transition-colors duration-200 touch-manipulation"
                    :placeholder="$t('auth.confirmPasswordPlaceholder')" />
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
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                {{ loading ? $t('auth.creatingAccount') : $t('auth.createAccountButton') }} 
              </button>

              <button type="button" @click="handleLogin" :disabled="loading"
                class="group flex w-full justify-center items-center rounded-xl sm:rounded-2xl bg-white border-2 border-gray-300 px-4 py-4 sm:py-4 lg:py-5 text-xs sm:text-sm lg:text-lg font-semibold text-gray-700 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md active:scale-[0.98] touch-manipulation min-h-[48px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                <svg class="w-5 h-5 sm:w-5 sm:h-5 mr-2 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                {{ $t('auth.alreadyHaveAccount') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
const API_URL = import.meta.env.VITE_API_URL || ''

// State
const loading = ref(false)
const error = ref('')
const success = ref('')
const registerForm = ref({ name: '', email: '', password: '', confirmPassword: '', acceptTerms: false })

async function handleRegister() {
  error.value = ''
  success.value = ''

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    error.value = t('auth.passwordMismatch')
    return
  }

  loading.value = true

  try {
    const response = await fetch(`${API_URL}/api/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: registerForm.value.name,
        email: registerForm.value.email,
        password: registerForm.value.password
      }),
    })

    const data = await response.json().catch(() => null)
    if (!data) {
      error.value = t('auth.invalidResponse')
      return
    }

    if (response.ok && data.success) {
      success.value = data.message || t('auth.registrationSuccess')
      setTimeout(() => router.push('/home'), 1000)
    } else {
      error.value = data.message || t('auth.registrationFailed')
    }
  } catch (err) {
    console.error('Registration error:', err)
    error.value = err.name === 'TypeError' && err.message.includes('fetch')
      ? t('auth.serverConnectionError')
      : t('auth.networkError')
  } finally {
    loading.value = false
  }
}

const handleLogin = () => router.push('/')
</script>