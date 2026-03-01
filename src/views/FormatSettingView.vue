<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <main class="px-3 sm:px-4 md:px-6 lg:px-8 pt-2 pb-12">

      <!-- Page Header -->
      <div class="pt-3 pb-6 flex items-center gap-4">
        <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center ring-1 ring-indigo-500/20">
          <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight" :class="themeClasses.textPrimary">
            {{ $t('formatSettings.title') }}
          </h1>
          <p class="mt-0.5 text-sm" :class="themeClasses.textSecondary">{{ $t('formatSettings.subtitle') }}</p>
        </div>
      </div>

      <div class="space-y-5">

        <!-- ── Appearance Card ─────────────────────────────── -->
        <section class="rounded-2xl border shadow-sm overflow-hidden" :class="[themeClasses.cardBackground, themeClasses.border]">

          <!-- Card Header -->
          <div class="px-6 py-4 flex items-center gap-3 border-b" :class="themeClasses.border">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center"
              :class="isDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-50 text-indigo-600'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <h2 class="text-base font-semibold leading-tight" :class="themeClasses.textPrimary">
                {{ $t('formatSettings.appearance') }}
              </h2>
              <p class="text-xs mt-0.5" :class="themeClasses.textSecondary">{{ $t('formatSettings.appearanceDesc') }}</p>
            </div>
          </div>

          <div class="p-6 space-y-6">

            <!-- Theme Label Row -->
            <div>
              <p class="text-sm font-medium mb-3" :class="themeClasses.textPrimary">{{ $t('formatSettings.theme') }}</p>
              <p class="text-xs mb-4 -mt-2" :class="themeClasses.textSecondary">{{ $t('formatSettings.themeDesc') }}</p>

              <!-- Theme Preview Cards -->
              <div class="grid grid-cols-2 gap-3 sm:gap-4">

                <!-- Light Mode Card -->
                <button @click="setTheme('light')" :class="[
                  'group relative rounded-xl border-2 overflow-hidden transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                  !isDarkMode
                    ? 'border-indigo-500 shadow-md shadow-indigo-100'
                    : 'border-gray-600 hover:border-gray-400'
                ]">
                  <!-- Mini UI Preview -->
                  <div class="bg-gray-100 px-3 pt-3 pb-1">
                    <div class="flex gap-1 mb-2">
                      <div class="w-2 h-2 rounded-full bg-red-400"></div>
                      <div class="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <div class="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                    <div class="bg-white rounded-t-md p-2 space-y-1.5">
                      <div class="h-2 bg-gray-200 rounded w-3/4"></div>
                      <div class="h-2 bg-gray-100 rounded w-1/2"></div>
                      <div class="h-2 bg-indigo-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <!-- Label -->
                  <div class="px-3 py-2.5 flex items-center gap-2" :class="isDarkMode ? 'bg-gray-700' : 'bg-white'">
                    <svg class="w-4 h-4 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        clip-rule="evenodd" />
                    </svg>
                    <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
                      {{ $t('formatSettings.lightMode') }}
                    </span>
                    <!-- Active checkmark -->
                    <span v-if="!isDarkMode" class="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                </button>

                <!-- Dark Mode Card -->
                <button @click="setTheme('dark')" :class="[
                  'group relative rounded-xl border-2 overflow-hidden transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                  isDarkMode
                    ? 'border-indigo-500 shadow-md shadow-indigo-900/30'
                    : 'border-gray-300 hover:border-gray-400'
                ]">
                  <!-- Mini UI Preview -->
                  <div class="bg-gray-900 px-3 pt-3 pb-1">
                    <div class="flex gap-1 mb-2">
                      <div class="w-2 h-2 rounded-full bg-red-500"></div>
                      <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div class="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div class="bg-gray-800 rounded-t-md p-2 space-y-1.5">
                      <div class="h-2 bg-gray-600 rounded w-3/4"></div>
                      <div class="h-2 bg-gray-700 rounded w-1/2"></div>
                      <div class="h-2 bg-indigo-700 rounded w-2/3"></div>
                    </div>
                  </div>
                  <!-- Label -->
                  <div class="px-3 py-2.5 flex items-center gap-2 bg-gray-800">
                    <svg class="w-4 h-4 text-indigo-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-200">
                      {{ $t('formatSettings.darkMode') }}
                    </span>
                    <!-- Active checkmark -->
                    <span v-if="isDarkMode" class="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                </button>
              </div>

              <!-- Active Theme Banner -->
              <div class="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-300"
                :class="isDarkMode ? 'bg-indigo-900/30 border border-indigo-700/40' : 'bg-indigo-50 border border-indigo-100'">
                <svg v-if="!isDarkMode" class="w-4 h-4 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clip-rule="evenodd" />
                </svg>
                <svg v-else class="w-4 h-4 text-indigo-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                <div class="min-w-0">
                  <p class="text-sm font-medium" :class="isDarkMode ? 'text-indigo-300' : 'text-indigo-700'">
                    {{ isDarkMode ? $t('formatSettings.darkModeActive') : $t('formatSettings.lightModeActive') }}
                  </p>
                  <p class="text-xs mt-0.5" :class="isDarkMode ? 'text-indigo-400' : 'text-indigo-500'">
                    {{ isDarkMode ? $t('formatSettings.darkModeDesc') : $t('formatSettings.lightModeDesc') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="border-t" :class="themeClasses.border"></div>

            <!-- Auto Theme Row -->
            <div class="flex items-start sm:items-center gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-medium" :class="themeClasses.textPrimary">
                    {{ $t('formatSettings.autoTheme') }}
                  </h3>
                  <span v-if="autoTheme"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                    {{ $t('formatSettings.autoThemeOn') }}
                  </span>
                </div>
                <p class="text-xs mt-1" :class="themeClasses.textSecondary">{{ $t('formatSettings.autoThemeDesc') }}</p>
              </div>
              <button @click="toggleAutoTheme" role="switch" :aria-checked="autoTheme" :class="[
                'relative flex-shrink-0 inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                autoTheme ? 'bg-indigo-600' : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')
              ]">
                <span :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                  autoTheme ? 'translate-x-5' : 'translate-x-0'
                ]" />
              </button>
            </div>

          </div>
        </section>

        <!-- ── Language Card ───────────────────────────────── -->
        <section class="rounded-2xl border shadow-sm overflow-hidden" :class="[themeClasses.cardBackground, themeClasses.border]">

          <!-- Card Header -->
          <div class="px-6 py-4 flex items-center gap-3 border-b" :class="themeClasses.border">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center"
              :class="isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-50 text-blue-600'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <div>
              <h2 class="text-base font-semibold leading-tight" :class="themeClasses.textPrimary">
                {{ $t('formatSettings.language') }}
              </h2>
              <p class="text-xs mt-0.5" :class="themeClasses.textSecondary">{{ $t('formatSettings.languageDesc') }}</p>
            </div>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="lang in languages"
                :key="lang.code"
                @click="changeLanguage(lang.code)"
                :class="[
                  'relative flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  currentLanguage === lang.code
                    ? (isDarkMode
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-blue-500 bg-blue-50')
                    : (isDarkMode
                      ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50')
                ]"
              >
                <span class="text-2xl leading-none">{{ lang.flag }}</span>
                <span class="text-sm font-medium" :class="[
                  currentLanguage === lang.code
                    ? (isDarkMode ? 'text-blue-300' : 'text-blue-700')
                    : themeClasses.textPrimary
                ]">{{ lang.name }}</span>
                <span v-if="currentLanguage === lang.code"
                  class="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </section>

      </div>
    </main>
  </div>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'
import { useLanguage } from '../composables/useLanguage'

const { isDarkMode, autoTheme, themeClasses, setTheme, toggleAutoTheme } = useTheme()
const { currentLanguage, languages, changeLanguage } = useLanguage()
</script>