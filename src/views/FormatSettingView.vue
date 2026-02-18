<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <main>
      <div class="px-3 sm:px-4 md:px-6 lg:px-8 pt-4 pb-8">
        <!-- Header -->
        <div class="mb-8 pt-16">
          <h1 class="text-3xl font-bold" :class="themeClasses.textPrimary">{{ $t('formatSettings.title') }}</h1>
          <p class="mt-2 text-sm" :class="themeClasses.textSecondary">{{ $t('formatSettings.subtitle') }}</p>
        </div>

        <!-- Theme Settings -->
        <div class="space-y-6">
          <!-- Appearance Section -->
          <div class="rounded-lg border shadow-sm" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="px-6 py-4 border-b" :class="themeClasses.border">
              <h2 class="text-xl font-semibold" :class="themeClasses.textPrimary">{{ $t('formatSettings.appearance') }}
              </h2>
              <p class="mt-1 text-sm" :class="themeClasses.textSecondary">{{ $t('formatSettings.appearanceDesc') }}</p>
            </div>

            <div class="p-6">
              <!-- Theme Toggle -->
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="text-base font-medium" :class="themeClasses.textPrimary">{{ $t('formatSettings.theme') }}
                  </h3>
                  <p class="text-sm" :class="themeClasses.textSecondary">{{ $t('formatSettings.themeDesc') }}</p>
                </div>

                <div class="flex items-center space-x-3">
                  <!-- Light Mode Button -->
                  <button @click="setTheme('light')" :class="[
                    'flex items-center justify-center w-16 h-16 rounded-lg border-2 transition-all duration-200',
                    !isDarkMode
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                      : 'border-gray-300 bg-gray-100 text-gray-600 hover:border-indigo-300'
                  ]" :title="$t('formatSettings.lightMode')">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </button>

                  <!-- Dark Mode Button -->
                  <button @click="setTheme('dark')" :class="[
                    'flex items-center justify-center w-16 h-16 rounded-lg border-2 transition-all duration-200',
                    isDarkMode
                      ? 'border-indigo-500 bg-indigo-900 text-indigo-400'
                      : 'border-gray-300 bg-gray-800 text-gray-300 hover:border-indigo-300'
                  ]" :title="$t('formatSettings.darkMode')">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Theme Description -->
              <div class="mt-4 p-4 rounded-lg" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-50'">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg v-if="!isDarkMode" class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        clip-rule="evenodd" />
                    </svg>
                    <svg v-else class="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium" :class="themeClasses.textPrimary">
                      {{ isDarkMode ? $t('formatSettings.darkModeActive') : $t('formatSettings.lightModeActive') }}
                    </p>
                    <p class="text-sm" :class="themeClasses.textSecondary">
                      {{ isDarkMode
                        ? $t('formatSettings.darkModeDesc')
                        : $t('formatSettings.lightModeDesc')
                      }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Auto Theme Toggle -->
              <div class="flex items-center justify-between mt-6">
                <div class="flex-1">
                  <h3 class="text-base font-medium" :class="themeClasses.textPrimary">{{ $t('formatSettings.autoTheme')
                    }}</h3>
                  <p class="text-sm" :class="themeClasses.textSecondary">{{ $t('formatSettings.autoThemeDesc') }}</p>
                </div>

                <button @click="toggleAutoTheme" :class="[
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
                  autoTheme ? 'bg-indigo-600' : (isDarkMode ? 'bg-gray-600' : 'bg-gray-200')
                ]">
                  <span :class="[
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    autoTheme ? 'translate-x-5' : 'translate-x-0'
                  ]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>

import { useTheme } from '../composables/useTheme'
const { isDarkMode, autoTheme, themeClasses, setTheme, toggleAutoTheme } = useTheme()

</script>