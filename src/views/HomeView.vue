<template>
  <div class="min-h-full" :class="themeClasses.background">
    <main class="px-3 sm:px-4 md:px-6 lg:px-8 pb-10 w-full">

      <!-- ── Admin: viewing another user banner ── -->
      <div v-if="isViewingOtherUser"
        class="mt-4 mb-4 rounded-xl border-l-4 border-indigo-500 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        :class="isDarkMode ? 'bg-indigo-900/20 text-indigo-200' : 'bg-indigo-50 text-indigo-900'">
        <div class="flex items-start gap-3">
          <div class="mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            :class="isDarkMode ? 'bg-indigo-700' : 'bg-indigo-100'">
            <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold leading-snug">{{ $t('home.viewingUser') }}
              <span class="font-normal ml-1">
                <template v-if="viewedUserLoading">{{ $t('home.loadingUser') }}</template>
                <template v-else-if="viewedUser && viewedUser.email">{{ viewedUser.email }}</template>
                <template v-else-if="viewedUserEmail">{{ viewedUserEmail }}</template>
                <template v-else-if="viewedUserError">{{ viewedUserError }}</template>
                <template v-else>{{ viewedUserId }}</template>
              </span>
            </p>
            <div v-if="userState.user && userState.user.role === 'admin'" class="mt-2">
              <button @click="goToModifyHealthData"
                class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors shadow-sm">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                {{ $t('home.modifyHealthData') }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <template v-if="viewedUser && viewedUser.serviceStatusKey === 'completed'">
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
              :class="isDarkMode ? 'bg-green-700 text-white' : 'bg-green-100 text-green-800'">
              {{ $t('admin.statusCompleted') }}
            </span>
          </template>
          <button @click="goBackToUserManagement"
            class="inline-flex items-center gap-1 text-xs font-medium underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity">
            {{ $t('home.returnToUserManagement') }}
          </button>
        </div>
      </div>

      <!-- ── Offline banner ── -->
      <div v-if="!isOnline"
        class="mb-4 rounded-xl border-l-4 border-orange-500 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-sm"
        :class="isDarkMode ? 'bg-orange-900/20 text-orange-200' : 'bg-orange-50 text-orange-900'">
        <div class="flex items-center gap-2.5">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3"></path>
          </svg>
          <div>
            <span class="font-semibold text-sm">{{ $t('home.offline.title') }}</span>
            <span class="text-xs ml-2 opacity-80">{{ $t('home.offline.message') }}</span>
          </div>
        </div>
        <button @click="manualRefreshAllData"
          class="self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          :class="isDarkMode ? 'bg-orange-700 hover:bg-orange-600 text-white' : 'bg-orange-200 hover:bg-orange-300 text-orange-900'">
          {{ $t('home.offline.retry') }}
        </button>
      </div>

      <!-- ── Cached data banner ── -->
      <div v-if="showingCachedData"
        class="mb-4 rounded-xl border-l-4 border-blue-400 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-sm"
        :class="isDarkMode ? 'bg-blue-900/20 text-blue-200' : 'bg-blue-50 text-blue-900'">
        <div class="flex items-center gap-2.5">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
          </svg>
          <div>
            <span class="font-semibold text-sm">{{ $t('home.cached.title') }}</span>
            <span class="text-xs ml-2 opacity-80">{{ $t('home.cached.message') }}</span>
          </div>
        </div>
        <button @click="manualRefreshAllData"
          class="self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          :class="isDarkMode ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-200 hover:bg-blue-300 text-blue-900'">
          {{ $t('home.cached.refresh') }}
        </button>
      </div>

      <!-- ── Greeting header ── -->
      <div class="pt-5 pb-6" v-if="!isViewingOtherUser">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight" :class="themeClasses.textPrimary">
              {{ $t('home.greeting') }}<span v-if="userState.user?.name">, {{ userState.user.name }}</span>
            </h1>
            <p class="mt-1 text-sm sm:text-base" :class="themeClasses.textSecondary">{{ $t('home.healthDashboard') }}</p>
          </div>
          <div v-if="showOverallAnalysis"
            class="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-semibold"
            :class="[themeClasses.border, overallAnalysis.badgeClass, 'text-white shadow-sm']">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ $t(`home.overallAnalysis.statuses.${overallAnalysis.statusKey}`) }} · {{ overallAnalysis.score }}
          </div>
        </div>
      </div>

      <!-- ── Overall Analysis ── -->
      <div v-if="showOverallAnalysis" class="mb-8">
        <div class="rounded-2xl shadow-sm border overflow-hidden"
          :class="[themeClasses.cardBackground, themeClasses.border]">
          <!-- Header strip -->
          <div class="px-5 py-4 border-b flex items-center gap-3" :class="themeClasses.border">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center"
              :class="isDarkMode ? 'bg-emerald-900/40' : 'bg-emerald-100'">
              <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h2 class="text-lg font-bold" :class="themeClasses.textPrimary">{{ $t('home.overallAnalysis.title') }}</h2>
          </div>
          <!-- Body -->
          <div class="p-5 flex flex-col md:flex-row md:items-start gap-6">
            <!-- Score ring column -->
            <div class="flex flex-col items-center justify-center gap-2 md:w-44 shrink-0">
              <div class="relative w-32 h-32">
                <svg class="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke-width="12"
                    :stroke="isDarkMode ? '#374151' : '#e5e7eb'" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke-width="12"
                    :stroke-dasharray="`${(overallAnalysis.score / 100) * 314} 314`"
                    stroke-linecap="round"
                    :stroke="{ excellent: '#22c55e', good: '#14b8a6', fair: '#eab308', poor: '#f97316', critical: '#dc2626', noData: '#9ca3af' }[overallAnalysis.statusKey] || '#9ca3af'"
                    style="transition: stroke-dasharray 0.6s ease;" />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-3xl font-extrabold leading-none" :class="themeClasses.textPrimary">{{ overallAnalysis.score }}</span>
                  <span class="text-xs mt-0.5" :class="themeClasses.textSecondary">/ 100</span>
                </div>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-bold text-white" :class="overallAnalysis.badgeClass">
                {{ $t(`home.overallAnalysis.statuses.${overallAnalysis.statusKey}`) }}
              </span>
              <p class="text-xs text-center leading-relaxed" :class="themeClasses.textSecondary">{{ overallAnalysis.summary }}</p>
            </div>
            <!-- Divider -->
            <div class="hidden md:block w-px self-stretch" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-200'"></div>
            <!-- Advice column -->
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-semibold mb-3" :class="themeClasses.textPrimary">{{ $t('home.overallAnalysis.adviceTitle') }}</h4>
              <ul class="space-y-2">
                <li v-for="(a, i) in overallAnalysis.advice" :key="i"
                  class="flex items-start gap-2 text-sm" :class="themeClasses.textSecondary">
                  <svg class="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{{ a }}</span>
                </li>
              </ul>
              <!-- Progress bar at bottom -->
              <div class="mt-5">
                <div class="flex justify-between text-xs mb-1" :class="themeClasses.textSecondary">
                  <span>0</span><span>{{ $t('home.healthScore') }}</span><span>100</span>
                </div>
                <div class="h-2 rounded-full overflow-hidden" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-200'">
                  <div :style="{ width: overallAnalysis.score + '%' }" class="h-full rounded-full transition-all duration-700"
                    :class="overallAnalysis.progressClass"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

<!-- ══ BMI Section ══ -->
      <div class="mb-8">
        <!-- Section header -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center"
            :class="isDarkMode ? 'bg-blue-900/40' : 'bg-blue-100'">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
            </svg>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold" :class="themeClasses.textPrimary">{{ $t('home.bmi.title') }}</h2>
        </div>

        <div class="rounded-2xl shadow-sm border overflow-hidden" :class="[themeClasses.cardBackground, themeClasses.border]">
          <!-- Loading -->
          <div v-if="isBMILoading" class="flex flex-col items-center justify-center py-14 gap-3">
            <svg class="animate-spin h-9 w-9 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm" :class="themeClasses.textSecondary">{{ $t('home.bmi.loading') }}</p>
          </div>

          <!-- No data -->
          <div v-else-if="!bmiData.bmi" class="flex flex-col items-center justify-center py-14 gap-4">
            <div class="w-16 h-16 rounded-full flex items-center justify-center"
              :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'">
              <svg class="w-8 h-8" :class="themeClasses.textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p class="text-sm" :class="themeClasses.textSecondary">{{ $t('home.bmi.noData') }}</p>
            <router-link v-if="!isViewingOtherUser" to="/data-setting"
              class="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
              {{ $t('home.bmi.addData') }}
            </router-link>
          </div>

          <!-- BMI data -->
          <div v-else class="p-5 sm:p-6">
            <!-- Score + Badge row -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div class="flex items-end gap-3">
                <span class="text-6xl sm:text-7xl font-extrabold leading-none" :class="themeClasses.textPrimary">{{ bmiData.bmi }}</span>
                <span class="mb-1 text-sm font-medium" :class="themeClasses.textSecondary">BMI</span>
              </div>
              <span class="self-start sm:self-auto text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm"
                :class="bmiCategoryStyle">
                {{ bmiCategoryKey ? $t(`home.bmi.categories.${bmiCategoryKey}`) : bmiData.category }}
              </span>
            </div>

            <!-- BMI Gradient Slider -->
            <div class="mb-6">
              <div class="relative h-3 bg-linear-to-r from-blue-400 via-green-400 to-orange-500 rounded-full mb-3 shadow-inner">
                <div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-[3px] border-gray-700 dark:border-gray-200 rounded-full shadow-lg transition-all duration-500"
                  :style="{ left: bmiSliderPosition + '%' }"></div>
              </div>
              <div class="flex justify-between text-xs font-medium" :class="themeClasses.textSecondary">
                <span>18.5</span><span>24.0</span><span>29.0</span>
              </div>
            </div>

            <!-- BMI Category Legend -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              <div class="flex items-center gap-2 p-2 rounded-xl border"
                :class="[themeClasses.border, bmiCategoryKey === 'underweight' ? (isDarkMode ? 'ring-1 ring-blue-400' : 'ring-1 ring-blue-400') : '']">
                <div class="w-3 h-3 rounded-full shrink-0 bg-blue-400"
                  :class="bmiCategoryKey === 'underweight' ? 'ring-2 ring-offset-1 ring-blue-400' : ''"></div>
                <span class="text-xs" :class="[themeClasses.textSecondary, bmiCategoryKey === 'underweight' ? 'font-bold' : '']">
                  {{ $t('home.bmi.categories.underweight') }}
                </span>
              </div>
              <div class="flex items-center gap-2 p-2 rounded-xl border"
                :class="[themeClasses.border, bmiCategoryKey === 'normal' ? (isDarkMode ? 'ring-1 ring-green-400' : 'ring-1 ring-green-400') : '']">
                <div class="w-3 h-3 rounded-full shrink-0 bg-green-400"
                  :class="bmiCategoryKey === 'normal' ? 'ring-2 ring-offset-1 ring-green-400' : ''"></div>
                <span class="text-xs" :class="[themeClasses.textSecondary, bmiCategoryKey === 'normal' ? 'font-bold' : '']">
                  {{ $t('home.bmi.categories.normal') }}
                </span>
              </div>
              <div class="flex items-center gap-2 p-2 rounded-xl border"
                :class="[themeClasses.border, bmiCategoryKey === 'overweight' ? (isDarkMode ? 'ring-1 ring-yellow-400' : 'ring-1 ring-yellow-400') : '']">
                <div class="w-3 h-3 rounded-full shrink-0 bg-yellow-400"
                  :class="bmiCategoryKey === 'overweight' ? 'ring-2 ring-offset-1 ring-yellow-400' : ''"></div>
                <span class="text-xs" :class="[themeClasses.textSecondary, bmiCategoryKey === 'overweight' ? 'font-bold' : '']">
                  {{ $t('home.bmi.categories.overweight') }}
                </span>
              </div>
              <div class="flex items-center gap-2 p-2 rounded-xl border"
                :class="[themeClasses.border, bmiCategoryKey === 'obese' ? (isDarkMode ? 'ring-1 ring-orange-500' : 'ring-1 ring-orange-500') : '']">
                <div class="w-3 h-3 rounded-full shrink-0 bg-orange-500"
                  :class="bmiCategoryKey === 'obese' ? 'ring-2 ring-offset-1 ring-orange-500' : ''"></div>
                <span class="text-xs" :class="[themeClasses.textSecondary, bmiCategoryKey === 'obese' ? 'font-bold' : '']">
                  {{ $t('home.bmi.categories.obese') }}
                </span>
              </div>
            </div>

            <!-- Data Analysis cards -->
            <div class="border-t pt-5" :class="themeClasses.border">
              <h4 class="text-sm font-semibold mb-4" :class="themeClasses.textPrimary">{{ $t('home.dataAnalysis') }}</h4>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="rounded-xl border p-3 text-center" :class="[themeClasses.border, isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/70']">
                  <div class="text-xl font-bold mb-0.5" :class="themeClasses.textPrimary">{{ bmiData.age || '--' }}</div>
                  <div class="text-xs" :class="themeClasses.textSecondary">{{ $t('dataSettings.age') }}</div>
                </div>
                <div class="rounded-xl border p-3 text-center" :class="[themeClasses.border, isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/70']">
                  <div class="text-xl font-bold mb-0.5" :class="themeClasses.textPrimary">{{ bmiData.height || '--' }}</div>
                  <div class="text-xs" :class="themeClasses.textSecondary">{{ $t('dataSettings.height') }}</div>
                </div>
                <div class="rounded-xl border p-3 text-center" :class="[themeClasses.border, isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/70']">
                  <div class="text-xl font-bold mb-0.5" :class="themeClasses.textPrimary">{{ bmiData.weight || '--' }}</div>
                  <div class="text-xs" :class="themeClasses.textSecondary">{{ $t('dataSettings.weight') }}</div>
                </div>
                <div class="rounded-xl border p-3 text-center" :class="[themeClasses.border, isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/70']">
                  <div class="text-xl font-bold mb-0.5" :class="themeClasses.textPrimary">{{ bmiRangeDisplay }}</div>
                  <div class="text-xs" :class="themeClasses.textSecondary">{{ $t('home.bmi.bmiRange') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ Heart Rate Section ══ -->
      <div class="mb-8">
        <!-- Section header -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center"
            :class="isDarkMode ? 'bg-red-900/40' : 'bg-red-100'">
            <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
            </svg>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold" :class="themeClasses.textPrimary">{{ $t('home.heartRate.title') }}</h2>
        </div>

          <!-- Date Picker with Available Dates Indicator -->
          <template v-if="hasHeartRateData">
            <div class="flex justify-center items-center gap-3 mb-5 w-full">
              <button @click="previousDate"
                class="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 hover:scale-110 active:scale-90"
                :class="isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'">
                <svg class="w-5 h-5" :class="isDarkMode ? 'text-white' : 'text-gray-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              <div class="relative">
                <button @click="showDatePicker = !showDatePicker"
                  class="px-4 py-2 rounded-xl border flex items-center gap-2 min-w-50 sm:min-w-55 justify-between transition-all duration-150 hover:scale-105 active:scale-95 hover:shadow-md font-medium text-sm"
                  :class="[themeClasses.cardBackground, themeClasses.border, isDarkMode ? 'text-white' : 'text-gray-800']">
                  <span class="flex-1 text-center">{{ currentDate || $t('home.selectDate') }}</span>
                  <svg class="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </button>

                <div v-if="showDatePicker"
                  class="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50 rounded-2xl shadow-xl border p-4 min-w-[320px]"
                  :class="[themeClasses.cardBackground, themeClasses.border]">
                  <div class="flex items-center justify-between mb-4">
                    <button @click="previousMonth" class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <svg class="w-4 h-4" :class="themeClasses.textPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </button>
                    <span class="font-semibold text-sm" :class="themeClasses.textPrimary">{{ calendarMonthYear }}</span>
                    <button @click="nextMonth" class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <svg class="w-4 h-4" :class="themeClasses.textPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="grid grid-cols-7 gap-1 mb-2">
                    <div v-for="day in weekDayNames" :key="day" class="text-center text-xs font-medium py-1" :class="themeClasses.textSecondary">{{ day }}</div>
                  </div>
                  <div class="grid grid-cols-7 gap-1">
                    <button v-for="day in calendarDays" :key="day.date" @click="selectDate(day)" :disabled="!day.currentMonth"
                      class="relative p-2 text-xs rounded-lg transition-all duration-150 active:scale-90"
                      :class="[
                        day.currentMonth ? 'hover:scale-105' : 'opacity-30 cursor-not-allowed',
                        day.isSelected ? 'bg-blue-600 text-white shadow-md scale-105' : '',
                        day.isToday && !day.isSelected ? 'bg-blue-600 text-white shadow-md scale-105' : '',
                        !day.isSelected && day.currentMonth ? (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100') : '',
                        day.isSelected ? '' : themeClasses.textPrimary
                      ]">
                      {{ day.dayNumber }}
                      <span v-if="day.hasData && day.currentMonth"
                        class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        :class="(day.isSelected || day.isToday) ? 'bg-white' : 'bg-green-500'"></span>
                    </button>
                  </div>
                  <div class="mt-3 pt-3 border-t flex items-center justify-center gap-4 text-xs" :class="themeClasses.border">
                    <div class="flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-green-500"></span>
                      <span :class="themeClasses.textSecondary">{{ $t('home.heartRate.hasData') }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <span class="w-3.5 h-3.5 rounded bg-blue-600"></span>
                      <span :class="themeClasses.textSecondary">{{ $t('home.heartRate.today') }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button @click="nextDate"
                class="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 hover:scale-110 active:scale-90"
                :class="isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'">
                <svg class="w-5 h-5" :class="isDarkMode ? 'text-white' : 'text-gray-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>

            <!-- Average BPM Hero -->
            <div class="text-center mb-5">
              <div class="text-6xl sm:text-7xl font-extrabold leading-none mb-1" :class="themeClasses.textPrimary">{{ stats.avg }}</div>
              <div class="text-sm font-medium" :class="themeClasses.textSecondary">{{ $t('home.heartRate.averageBpm') }}</div>
            </div>
          </template>

          <div v-else class="flex flex-col items-center py-10 gap-4">
            <div class="w-16 h-16 rounded-full flex items-center justify-center"
              :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'">
              <svg class="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
              </svg>
            </div>
            <p class="text-sm" :class="themeClasses.textSecondary">{{ $t('home.heartRate.noData') }}</p>
            <router-link v-if="!isViewingOtherUser" to="/data-setting"
              class="inline-flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
              {{ $t('home.heartRate.addData') }}
            </router-link>
          </div>

        <!-- Heart Rate Chart -->
        <div class="mb-5">
          <div class="rounded-2xl shadow-sm p-4 border" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="relative" style="height: 300px;">
              <Line v-if="chartData" :data="chartData" :options="chartOptions" />
              <div v-else class="h-full flex items-center justify-center rounded-xl"
                :class="isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'">
                <span class="text-sm" :class="themeClasses.textSecondary">{{ isHeartRateLoading ? $t('home.heartRate.loading') : $t('home.heartRate.noData') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Today Heart Rate Stats -->
        <div class="mb-2">
          <div class="rounded-2xl shadow-sm p-5 border" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-red-500">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
                </svg>
              </div>
              <h3 class="text-base font-semibold" :class="themeClasses.textPrimary">{{ $t('home.todayOverview') }}</h3>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div class="rounded-xl border p-3 sm:p-4 text-center" :class="[themeClasses.border, hrCardClasses(stats.resting).bg]">
                <div class="text-3xl sm:text-4xl font-bold mb-1" :class="hrCardClasses(stats.resting).text">{{ stats.resting }}</div>
                <div class="text-xs" :class="themeClasses.textSecondary">{{ $t('home.restingHeartRate') }}</div>
              </div>
              <div class="rounded-xl border p-3 sm:p-4 text-center" :class="[themeClasses.border, hrCardClasses(stats.max).bg]">
                <div class="text-3xl sm:text-4xl font-bold mb-1" :class="hrCardClasses(stats.max).text">{{ stats.max }}</div>
                <div class="text-xs" :class="themeClasses.textSecondary">{{ $t('home.maxHeartRate') }}</div>
              </div>
              <div class="rounded-xl border p-3 sm:p-4 text-center" :class="[themeClasses.border, hrCardClasses(stats.min).bg]">
                <div class="text-3xl sm:text-4xl font-bold mb-1" :class="hrCardClasses(stats.min).text">{{ stats.min }}</div>
                <div class="text-xs" :class="themeClasses.textSecondary">{{ $t('home.minHeartRate') }}</div>
              </div>
              <div class="rounded-xl border p-3 sm:p-4 text-center" :class="[themeClasses.border, hrCardClasses(stats.avg).bg]">
                <div class="text-3xl sm:text-4xl font-bold mb-1" :class="hrCardClasses(stats.avg).text">{{ stats.avg }}</div>
                <div class="text-xs" :class="themeClasses.textSecondary">{{ $t('home.averageHeartRate') }}</div>
              </div>
            </div>

            <!-- Heart Rate Range Legend -->
            <div class="pt-4 border-t" :class="themeClasses.border">
              <h4 class="text-xs font-semibold mb-3" :class="themeClasses.textPrimary">{{ $t('home.heartRate.rangeTitle') }}</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div class="flex items-center gap-2 text-xs" :class="themeClasses.textSecondary">
                  <span class="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0"></span>{{ $t('home.heartRate.range.low') }}
                </div>
                <div class="flex items-center gap-2 text-xs" :class="themeClasses.textSecondary">
                  <span class="w-2.5 h-2.5 rounded-full bg-green-400 shrink-0"></span>{{ $t('home.heartRate.range.normal') }}
                </div>
                <div class="flex items-center gap-2 text-xs" :class="themeClasses.textSecondary">
                  <span class="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0"></span>{{ $t('home.heartRate.range.elevated') }}
                </div>
                <div class="flex items-center gap-2 text-xs" :class="themeClasses.textSecondary">
                  <span class="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>{{ $t('home.heartRate.range.high') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ Stress Section ══ -->
      <div class="mb-8">
        <!-- Section header -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center"
            :class="isDarkMode ? 'bg-teal-900/40' : 'bg-teal-100'">
            <svg class="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold" :class="themeClasses.textPrimary">{{ $t('home.stress.title') }}</h2>
        </div>

        <!-- Date Picker with Available Dates Indicator for Stress -->
        <template v-if="hasStressData">
          <div class="flex justify-center items-center gap-3 mb-5 w-full">
            <button @click="previousStressDate"
              class="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 hover:scale-110 active:scale-90"
              :class="isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'">
              <svg class="w-5 h-5" :class="isDarkMode ? 'text-white' : 'text-gray-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <div class="relative">
              <button @click="showStressDatePicker = !showStressDatePicker"
                class="px-4 py-2 rounded-xl border flex items-center gap-2 min-w-50 sm:min-w-55 justify-between transition-all duration-150 hover:scale-105 active:scale-95 hover:shadow-md font-medium text-sm"
                :class="[themeClasses.cardBackground, themeClasses.border, isDarkMode ? 'text-white' : 'text-gray-800']">
                <span class="flex-1 text-center">{{ currentStressDate || $t('home.selectDate') }}</span>
                <svg class="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </button>

              <div v-if="showStressDatePicker"
                class="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50 rounded-2xl shadow-xl border p-4 min-w-[320px]"
                :class="[themeClasses.cardBackground, themeClasses.border]">
                <div class="flex items-center justify-between mb-4">
                  <button @click="previousStressMonth" class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <svg class="w-4 h-4" :class="themeClasses.textPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  <span class="font-semibold text-sm" :class="themeClasses.textPrimary">{{ stressCalendarMonthYear || $t('home.selectDate') }}</span>
                  <button @click="nextStressMonth" class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <svg class="w-4 h-4" :class="themeClasses.textPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
                <div class="grid grid-cols-7 gap-1 mb-2">
                  <div v-for="day in weekDayNames" :key="day" class="text-center text-xs font-medium py-1" :class="themeClasses.textSecondary">{{ day }}</div>
                </div>
                <div class="grid grid-cols-7 gap-1">
                  <button v-for="day in stressCalendarDays" :key="day.date" @click="selectStressDate(day)" :disabled="!day.currentMonth"
                    class="relative p-2 text-xs rounded-lg transition-all duration-150 active:scale-90"
                    :class="[
                      day.currentMonth ? 'hover:scale-105' : 'opacity-30 cursor-not-allowed',
                      day.isSelected ? 'bg-blue-600 text-white shadow-md scale-105' : '',
                      day.isToday && !day.isSelected ? 'bg-blue-600 text-white shadow-md scale-105' : '',
                      !day.isSelected && day.currentMonth ? (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100') : '',
                      day.isSelected ? '' : themeClasses.textPrimary
                    ]">
                    {{ day.dayNumber }}
                    <span v-if="day.hasData && day.currentMonth"
                      class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      :class="(day.isSelected || day.isToday) ? 'bg-white' : 'bg-green-500'"></span>
                  </button>
                </div>
                <div class="mt-3 pt-3 border-t flex items-center justify-center gap-4 text-xs" :class="themeClasses.border">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                    <span :class="themeClasses.textSecondary">{{ $t('home.heartRate.hasData') }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-3.5 h-3.5 rounded bg-blue-600"></span>
                    <span :class="themeClasses.textSecondary">{{ $t('home.heartRate.today') }}</span>
                  </div>
                </div>
              </div>
            </div>

            <button @click="nextStressDate"
              class="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 hover:scale-110 active:scale-90"
              :class="isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'">
              <svg class="w-5 h-5" :class="isDarkMode ? 'text-white' : 'text-gray-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          <!-- Stress Score Hero -->
          <div class="text-center mb-5">
            <div class="text-6xl sm:text-7xl font-extrabold leading-none mb-1" :class="themeClasses.textPrimary">{{ stressScore }}</div>
            <div class="text-sm font-medium mb-2" :class="themeClasses.textSecondary">{{ $t('home.stress.name') }}</div>
            <span class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-sm" :class="stressCategoryBadgeClass">
              {{ stressCategoryLabel || '--' }}
            </span>
          </div>
        </template>

        <div v-else class="flex flex-col items-center py-10 gap-4">
          <div class="w-16 h-16 rounded-full flex items-center justify-center"
            :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'">
            <svg class="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <p class="text-sm" :class="themeClasses.textSecondary">{{ $t('home.stress.noData') }}</p>
          <router-link v-if="!isViewingOtherUser" to="/data-setting"
            class="inline-flex items-center gap-2 px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
            {{ $t('home.stress.addData') }}
          </router-link>
        </div>

        <!-- Stress Chart -->
        <div class="mb-5">
          <div class="rounded-2xl shadow-sm p-4 border" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="relative" style="height: 260px;">
              <Line v-if="stressChartData" :data="stressChartData" :options="stressChartOptions" />
              <div v-else class="h-full flex items-center justify-center rounded-xl"
                :class="isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'">
                <span class="text-sm" :class="themeClasses.textSecondary">{{ isStressLoading ? $t('home.stress.loading') : $t('home.stress.noData') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Today Stress Stats -->
        <div class="rounded-2xl shadow-sm p-5 border" :class="[themeClasses.cardBackground, themeClasses.border]">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-teal-500">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-base font-semibold" :class="themeClasses.textPrimary">{{ $t('home.todayStressOverview') }}</h3>
          </div>

          <!-- Stats: Max / Min / Average -->
          <div class="grid grid-cols-3 gap-3 mb-5">
            <div class="rounded-xl border p-3 sm:p-4 text-center" :class="[themeClasses.border, stressCardClasses(stressStats.max).bg]">
              <div class="text-3xl sm:text-4xl font-bold mb-1" :class="stressCardClasses(stressStats.max).text">{{ typeof stressStats.max === 'number' ? stressStats.max : '--' }}</div>
              <div class="text-xs" :class="themeClasses.textSecondary">{{ $t('home.stress.max') }}</div>
            </div>
            <div class="rounded-xl border p-3 sm:p-4 text-center" :class="[themeClasses.border, stressCardClasses(stressStats.min).bg]">
              <div class="text-3xl sm:text-4xl font-bold mb-1" :class="stressCardClasses(stressStats.min).text">{{ typeof stressStats.min === 'number' ? stressStats.min : '--' }}</div>
              <div class="text-xs" :class="themeClasses.textSecondary">{{ $t('home.stress.min') }}</div>
            </div>
            <div class="rounded-xl border p-3 sm:p-4 text-center" :class="[themeClasses.border, stressCardClasses(stressMeanRounded).bg]">
              <div class="text-3xl sm:text-4xl font-bold mb-1" :class="stressCardClasses(stressMeanRounded).text">{{ stressMeanRounded !== null ? stressMeanRounded : '--' }}</div>
              <div class="text-xs" :class="themeClasses.textSecondary">{{ $t('home.stress.average') }}</div>
            </div>
          </div>

          <!-- Stress Range Legend -->
          <div class="pt-4 border-t" :class="themeClasses.border">
            <h4 class="text-xs font-semibold mb-3" :class="themeClasses.textPrimary">{{ $t('home.stress.rangeTitle') }}</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div class="flex items-center gap-2 text-xs" :class="themeClasses.textSecondary">
                <span class="w-2.5 h-2.5 rounded-full bg-teal-400 shrink-0"></span>{{ $t('home.stress.range.relaxed') }}
              </div>
              <div class="flex items-center gap-2 text-xs" :class="themeClasses.textSecondary">
                <span class="w-2.5 h-2.5 rounded-full bg-green-400 shrink-0"></span>{{ $t('home.stress.range.light') }}
              </div>
              <div class="flex items-center gap-2 text-xs" :class="themeClasses.textSecondary">
                <span class="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0"></span>{{ $t('home.stress.range.moderate') }}
              </div>
              <div class="flex items-center gap-2 text-xs" :class="themeClasses.textSecondary">
                <span class="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>{{ $t('home.stress.range.severe') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ Quick Actions ══ -->
      <div v-if="!hideQuickActions" class="mb-2">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center"
            :class="isDarkMode ? 'bg-violet-900/40' : 'bg-violet-100'">
            <svg class="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold" :class="themeClasses.textPrimary">{{ $t('home.quickActions') }}</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Data Settings card -->
          <router-link to="/data-setting" class="group block">
            <div class="rounded-2xl shadow-sm border h-full flex flex-col p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              :class="[themeClasses.cardBackground, themeClasses.border]">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  :class="isDarkMode ? 'bg-blue-900/40' : 'bg-blue-100'">
                  <svg class="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-sm font-semibold leading-tight" :class="themeClasses.textPrimary">{{ $t('nav.dataSettings') }}</h3>
                  <p class="text-xs mt-0.5" :class="themeClasses.textSecondary">{{ $t('home.quickAdd') }}</p>
                </div>
              </div>
              <p class="text-xs leading-relaxed grow mb-4" :class="themeClasses.textSecondary">{{ $t('home.recordData') }}</p>
              <div class="flex items-center text-blue-500 text-xs font-semibold gap-1 mt-auto">
                <span>{{ $t('home.addRecord') }}</span>
                <svg class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </router-link>

          <!-- AI Support card -->
          <router-link to="/ai-support" class="group block">
            <div class="rounded-2xl shadow-sm border h-full flex flex-col p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              :class="[themeClasses.cardBackground, themeClasses.border]">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  :class="isDarkMode ? 'bg-purple-900/40' : 'bg-purple-100'">
                  <svg class="h-6 w-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-sm font-semibold leading-tight" :class="themeClasses.textPrimary">{{ $t('nav.aiSupport') }}</h3>
                  <p class="text-xs mt-0.5" :class="themeClasses.textSecondary">{{ $t('home.availableAlways') }}</p>
                </div>
              </div>
              <p class="text-xs leading-relaxed grow mb-4" :class="themeClasses.textSecondary">{{ $t('home.getAdvice') }}</p>
              <div class="flex items-center text-purple-500 text-xs font-semibold gap-1 mt-auto">
                <span>{{ $t('home.getAdviceButton') }}</span>
                <svg class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </router-link>

          <!-- Chat card -->
          <router-link to="/chat" class="group block sm:col-span-2 lg:col-span-1">
            <div class="rounded-2xl shadow-sm border h-full flex flex-col p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              :class="[themeClasses.cardBackground, themeClasses.border]">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  :class="isDarkMode ? 'bg-green-900/40' : 'bg-green-100'">
                  <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-sm font-semibold leading-tight" :class="themeClasses.textPrimary">{{ $t('nav.chat') }}</h3>
                  <p class="text-xs mt-0.5" :class="themeClasses.textSecondary">{{ $t('home.chat.available') }}</p>
                </div>
              </div>
              <p class="text-xs leading-relaxed grow mb-4" :class="themeClasses.textSecondary">{{ $t('home.chat.description') }}</p>
              <div class="flex items-center text-green-500 text-xs font-semibold gap-1 mt-auto">
                <span>{{ $t('home.chat.openChat') }}</span>
                <svg class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line } from 'vue-chartjs'
import { useI18n } from 'vue-i18n'
import { getLatestBMIRecord } from '../services/bmiService'
import { getHeartRateRecords, getHeartRateDates } from '../services/heartRateService'
import { getStressRecords, getStressDates } from '../services/stressService'
import { getCachedBmiData, setCachedBmiData, getCachedHeartRateDates, setCachedHeartRateDates, getCachedStressDates, setCachedStressDates, getCachedHeartRateRecord, setCachedHeartRateRecord, getCachedStressRecord, setCachedStressRecord, useUserStore } from '../stores/userStore'
import { getUserById } from '../services/adminService'
import { fetchWithAuth } from '../utils/fetchWithAuth'
const API_URL = import.meta.env.VITE_API_URL || ''

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const { isDarkMode, themeClasses } = useTheme()
const { t, locale } = useI18n()

// State
const heartRateData = ref([])
const chartData = ref(null)
const selectedDate = ref('')
const currentDate = ref('')
const availableDates = ref([])

// Viewed user info (when admin views another user's home)
const viewedUser = ref(null)
const viewedUserLoading = ref(false)
const viewedUserError = ref('')
const userState = useUserStore()
const currentUserId = computed(() => userState.user?.id || null)
const isViewingOtherUser = computed(() => viewedUserId.value && viewedUserId.value !== currentUserId.value)
const hideQuickActions = computed(() => {
  // Hide quick action cards when an admin is viewing another user's dashboard
  return isViewingOtherUser.value && userState.user && userState.user.role === 'admin'
})
const route = useRoute()
const router = useRouter()
const viewedUserId = computed(() => route.query.userId || null)
const viewedUserEmail = computed(() => route.query.userEmail || null)
const isOffline = ref(typeof navigator !== 'undefined' ? !navigator.onLine : false)
const showOfflineBanner = computed(() => isOffline.value)

const goBackToUserManagement = () => {
  router.push({ name: 'UserManagement' })
}

const goToModifyHealthData = () => {
  if (!viewedUserId.value) return
  // Include the user's email so DataSetting banner can display it, and include the current page as 'from'
  const email = viewedUser.value?.email || viewedUserEmail.value || ''
  router.push({ name: 'DataSetting', query: { userId: viewedUserId.value, userEmail: email, from: route.fullPath } })
} 

// Stress-specific date selection (new)
const availableStressDates = ref([])
const selectedStressDate = ref('')
const currentStressDate = ref('')
const showStressDatePicker = ref(false)
const stressCalendarMonth = ref(new Date().getMonth())
const stressCalendarYear = ref(new Date().getFullYear())

const stats = ref({ min: 0, max: 0, avg: 0, resting: 0 })

// Stress state (previously missing; avoids reading .avg of undefined in template)
const stressData = ref([])
const stressStats = ref({ min: null, max: null, avg: null })
const stressChartData = ref(null)
const isStressLoading = ref(false)
const hasStressData = ref(false)

const bmiData = ref({ bmi: null, category: '', height: null, weight: null, age: null })
const isBMILoading = ref(false)
const isHeartRateLoading = ref(false)
const hasHeartRateData = ref(false)

// Online/offline and cache state
const isOnline = ref(navigator.onLine)
const showingCachedData = ref(false)

// Real stress averages derived from the day's stress visualization
const stressMean = computed(() => {
  if (!stressData.value || stressData.value.length === 0) return null
  // stressData items may be objects like { avg: number } or raw numbers
  const vals = stressData.value.map(s => (typeof s === 'number' ? s : (s.avg ?? null))).filter(v => v !== null && !isNaN(v))
  if (vals.length === 0) return null
  return vals.reduce((s, v) => s + v, 0) / vals.length
})

const stressMeanRounded = computed(() => {
  return stressMean.value !== null ? Math.round(stressMean.value) : null
})

const stressScore = computed(() => {
  const s = stressStats.value?.avg
  if (typeof s === 'number' && !isNaN(s)) return Math.round(s)
  return stressMeanRounded.value !== null ? stressMeanRounded.value : '--'
})

// Category mapping derived from current score (uses ranges you specified)
const stressCategoryKey = computed(() => {
  const s = stressScore.value
  if (s === '--' || s === null || s === undefined) return ''
  if (s <= 25) return 'relaxed'
  if (s <= 50) return 'light'
  if (s <= 80) return 'moderate'
  return 'severe'
})

const stressCategoryLabel = computed(() => stressCategoryKey.value ? t(`home.stress.${stressCategoryKey.value}`) : '')

const stressCategoryBadgeClass = computed(() => {
  const map = { relaxed: 'bg-teal-400', light: 'bg-green-400', moderate: 'bg-yellow-500', severe: 'bg-orange-500' }
  return map[stressCategoryKey.value] || 'bg-gray-400'
})

// Heart rate card color helper based on bpm ranges
// Low (bradycardia): < 60, Normal: 60-100, Elevated: 101-130, High (tachycardia): > 130
const hrCardClasses = (val) => {
  const v = Number(val)
  if (!val && val !== 0 || isNaN(v) || v === 0) return { bg: isDarkMode.value ? 'bg-gray-800/30' : 'bg-gray-50', text: isDarkMode.value ? 'text-gray-300' : 'text-gray-500' }
  if (v < 60)   return { bg: isDarkMode.value ? 'bg-blue-900/20'   : 'bg-blue-50',   text: 'text-blue-500' }
  if (v <= 100) return { bg: isDarkMode.value ? 'bg-green-900/20'  : 'bg-green-50',  text: 'text-green-500' }
  if (v <= 130) return { bg: isDarkMode.value ? 'bg-yellow-900/20' : 'bg-yellow-50', text: 'text-yellow-500' }
  return           { bg: isDarkMode.value ? 'bg-red-900/20'    : 'bg-red-50',    text: 'text-red-500' }
}

// Stress card color helper based on stress score ranges
// Relaxed: 1-25, Light: 26-50, Moderate: 51-80, Severe: 81-100
const stressCardClasses = (val) => {
  const v = Number(val)
  if (val === null || val === undefined || isNaN(v)) return { bg: isDarkMode.value ? 'bg-gray-800/30' : 'bg-gray-50', text: isDarkMode.value ? 'text-gray-300' : 'text-gray-500' }
  if (v <= 25)  return { bg: isDarkMode.value ? 'bg-teal-900/20'   : 'bg-teal-50',   text: 'text-teal-500' }
  if (v <= 50)  return { bg: isDarkMode.value ? 'bg-green-900/20'  : 'bg-green-50',  text: 'text-green-500' }
  if (v <= 80)  return { bg: isDarkMode.value ? 'bg-yellow-900/20' : 'bg-yellow-50', text: 'text-yellow-500' }
  return          { bg: isDarkMode.value ? 'bg-orange-900/20'  : 'bg-orange-50',  text: 'text-orange-500' }
}

// Calendar state
const showDatePicker = ref(false)
const calendarMonth = ref(new Date().getMonth())
const calendarYear = ref(new Date().getFullYear())

const loadBMIData = async () => {
  const userId = viewedUserId.value
  // Use cache only when viewing current user
  if (!userId) {
    const cached = getCachedBmiData()
    if (cached) {
      bmiData.value = cached
      return
    }
  }

  isBMILoading.value = true
  try {
    const { success, data } = await getLatestBMIRecord({ userId })
    const result = success && data ? {
      bmi: data.bmi,
      category: data.category,
      height: data.height,
      weight: data.weight,
      age: data.age || null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    } : { bmi: null, category: '', height: null, weight: null, age: null }

    bmiData.value = result
    if (!userId) setCachedBmiData(result)  // Cache only for current user
    if (success && data && data.bmi) showingCachedData.value = false
  } catch (error) {
    console.error('Failed to load BMI data:', error)
    
    // Try to load from cache when network fails
    const cached = getCachedBmiData()
    if (cached && cached.bmi) {
      console.log('Loading BMI data from offline cache')
      showingCachedData.value = true
      bmiData.value = cached
    } else {
      bmiData.value = { bmi: null, category: '', height: null, weight: null, age: null }
    }
  } finally {
    isBMILoading.value = false
  }
}

const bmiCategoryKey = computed(() => {
  const raw = (bmiData.value.category || '').toString().toLowerCase()
  if (raw.includes('under') || raw.includes('過輕')) return 'underweight'
  if (raw.includes('normal') || raw.includes('正常')) return 'normal'
  if (raw.includes('over') || raw.includes('過重')) return 'overweight'
  if (raw.includes('obese') || raw.includes('肥胖')) return 'obese'
  return ''
})

const bmiCategoryStyle = computed(() => {
  const styles = { underweight: 'bg-blue-500', normal: 'bg-green-500', overweight: 'bg-yellow-500', obese: 'bg-orange-500' }
  return styles[bmiCategoryKey.value] || 'bg-gray-500'
})

const bmiSliderPosition = computed(() => {
  const bmi = parseFloat(bmiData.value.bmi)
  if (!bmi || isNaN(bmi)) return 50

  // Map the slider so the visible ticks align with positions:
  // left tick (0%) = 18.5, center tick (50%) = 24.0, right tick (100%) = 29.0
  const left = 18.5
  const center = 24.0
  const right = 29.0

  if (bmi <= left) return 0
  if (bmi >= right) return 100

  // Piecewise linear mapping: left..center => 0..50, center..right => 50..100
  if (bmi <= center) {
    return Math.max(0, Math.min(50, ((bmi - left) / (center - left)) * 50))
  }

  return Math.max(50, Math.min(100, 50 + ((bmi - center) / (right - center)) * 50))
})

const bmiRangeDisplay = computed(() => {
  const key = bmiCategoryKey.value
  const ranges = {
    'underweight': '< 18.5',
    'normal': '18.5 - 24.9',
    'overweight': '25.0 - 29.9',
    'obese': '≥ 30.0'
  }
  return ranges[key] || '18.5 - 24.9'
})

// Show Overall Analysis only when BMI, heart rate and stress data are available
const showOverallAnalysis = computed(() => {
  return !isBMILoading.value && !isHeartRateLoading.value && !isStressLoading.value &&
         bmiData.value && bmiData.value.bmi &&
         hasHeartRateData.value && stats.value && typeof stats.value.avg === 'number' &&
         hasStressData.value && (typeof stressStats.value?.avg === 'number' || stressMean.value !== null)
})

// Simple heuristic to compute an overall health score (0-100) using BMI, heart rate and stress
// Enhanced: detect extreme/critical cases and ensure final score reflects critical risk
const overallAnalysis = computed(() => {
  const bmi = parseFloat(bmiData.value?.bmi)
  const hr = parseFloat(stats.value?.avg)
  const stressVal = (typeof stressStats.value?.avg === 'number' ? parseFloat(stressStats.value.avg) : (stressMean.value !== null ? parseFloat(stressMean.value) : null))

  if (!bmi || !hr || stressVal === null || typeof stressVal === 'undefined' || isNaN(stressVal)) {
    return { score: '--', statusKey: 'noData', summary: t('home.overallAnalysis.noData'), advice: [], badgeClass: 'bg-gray-400', progressClass: 'bg-gray-400' }
  }

  // BMI penalty: normal range 18.5 - 24, deviation penalized up to 40 points
  let bmiDeviation = 0
  if (bmi < 18.5) bmiDeviation = 18.5 - bmi
  else if (bmi > 24) bmiDeviation = bmi - 24
  const bmiPenalty = Math.min(40, Math.round((bmiDeviation / 10) * 40))

  // Heart rate penalty: target 60 - 90 bpm, deviation penalized up to 40 points
  let hrDeviation = 0
  if (hr < 60) hrDeviation = 60 - hr
  else if (hr > 90) hrDeviation = hr - 90
  const hrPenalty = Math.min(40, Math.round((hrDeviation / 30) * 40))

  // Stress penalty: target <= 25 (relaxed); deviation penalized up to 20 points
  let stressDeviation = 0
  if (stressVal > 25) stressDeviation = stressVal - 25
  const stressPenalty = Math.min(20, Math.round((stressDeviation / 75) * 20))

  let score = Math.max(0, Math.min(100, 100 - bmiPenalty - hrPenalty - stressPenalty))

  // Detect extreme/critical conditions (examples: severe underweight/obesity, dangerously low/high HR, extreme stress)
  const extremeBMI = (bmi <= 15 || bmi >= 40)
  const extremeHR = (hr <= 35 || hr >= 130)
  const extremeStress = (stressVal >= 90)
  const isCritical = extremeBMI || extremeHR || extremeStress

  // If any extreme condition is present, strongly lower the final score to reflect critical risk
  if (isCritical) {
    score = Math.min(score, 20) // cap score at 20 for critical cases
  }

  // Status mapping (critical overrides other categories)
  let statusKey = 'excellent'
  if (isCritical || score < 25) statusKey = 'critical'
  else if (score >= 85) statusKey = 'excellent'
  else if (score >= 70) statusKey = 'good'
  else if (score >= 50) statusKey = 'fair'
  else statusKey = 'poor'

  const badgeMap = { excellent: 'bg-green-500', good: 'bg-teal-500', fair: 'bg-yellow-500', poor: 'bg-orange-500', critical: 'bg-red-600' }
  const progressMap = { excellent: 'bg-green-500', good: 'bg-teal-500', fair: 'bg-yellow-500', poor: 'bg-orange-500', critical: 'bg-red-600' }

  // Advice generation
  const advice = []
  if (bmi < 18.5) advice.push(t('home.overallAnalysis.advice.underweight'))
  else if (bmi >= 25) {
    if (bmi >= 30) advice.push(t('home.overallAnalysis.advice.obese'))
    else advice.push(t('home.overallAnalysis.advice.overweight'))
  } else advice.push(t('home.overallAnalysis.advice.maintain'))

  if (hr > 90) advice.push(t('home.overallAnalysis.advice.highHr'))
  else if (hr < 50) advice.push(t('home.overallAnalysis.advice.lowHr'))

  // Stress advice
  if (stressVal >= 80) advice.push(t('home.overallAnalysis.advice.highStress'))
  else if (stressVal >= 50) advice.push(t('home.overallAnalysis.advice.moderateStress'))

  // Add urgent advice for critical conditions
  if (isCritical) advice.push(t('home.overallAnalysis.advice.critical'))

  return { score, statusKey, summary: t(`home.overallAnalysis.summary.${statusKey}`), advice, badgeClass: badgeMap[statusKey], progressClass: progressMap[statusKey] }
})

// Format date for display
const formatDateForDisplay = (dateString) => {
  const date = new Date(dateString)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const loc = locale.value === 'zh' ? 'zh-TW' : 'en-US'
  let formatted = date.toLocaleDateString(loc, options)
  if (locale.value === 'zh') {
    formatted = formatted.replace(/\s+/g, '')
  }
  return formatted
}

// Calendar computed properties
const calendarMonthYear = computed(() => {
  const date = new Date(calendarYear.value, calendarMonth.value, 1)
  const loc = locale.value === 'zh' ? 'zh-TW' : 'en-US'
  let formatted = date.toLocaleDateString(loc, { month: 'long', year: 'numeric' })
  if (locale.value === 'zh') {
    formatted = formatted.replace(/\s+/g, '')
  }
  return formatted
})

// Localized weekday short names for calendar header
const weekDayNames = computed(() => {
  const loc = locale.value === 'zh' ? 'zh-TW' : 'en-US'
  const dtf = new Intl.DateTimeFormat(loc, { weekday: 'short' })
  const base = []
  // Jan 3 2021 is a Sunday - iterate Sun..Sat
  for (let d = 0; d < 7; d++) {
    base.push(dtf.format(new Date(Date.UTC(2021, 0, 3 + d))))
  }
  return base
})

const calendarDays = computed(() => {
  const days = []
  const firstDay = new Date(calendarYear.value, calendarMonth.value, 1)
  const lastDay = new Date(calendarYear.value, calendarMonth.value + 1, 0)
  const startDay = firstDay.getDay()
  const today = new Date().toISOString().split('T')[0]

  // Previous month days
  const prevMonthLastDay = new Date(calendarYear.value, calendarMonth.value, 0).getDate()
  for (let i = startDay - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i
    const date = new Date(calendarYear.value, calendarMonth.value - 1, dayNum).toISOString().split('T')[0]
    days.push({
      dayNumber: dayNum,
      date: date,
      currentMonth: false,
      isToday: date === today,
      isSelected: date === selectedDate.value,
      hasData: availableDates.value.includes(date)
    })
  }

  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(calendarYear.value, calendarMonth.value, i).toISOString().split('T')[0]
    days.push({
      dayNumber: i,
      date: date,
      currentMonth: true,
      isToday: date === today,
      isSelected: date === selectedDate.value,
      hasData: availableDates.value.includes(date)
    })
  }

  // Next month days
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(calendarYear.value, calendarMonth.value + 1, i).toISOString().split('T')[0]
    days.push({
      dayNumber: i,
      date: date,
      currentMonth: false,
      isToday: date === today,
      isSelected: date === selectedDate.value,
      hasData: availableDates.value.includes(date)
    })
  }

  return days
})

// Stress calendar month/year display
const stressCalendarMonthYear = computed(() => {
  const m = stressCalendarMonth.value
  const y = stressCalendarYear.value
  if (typeof m !== 'number' || typeof y !== 'number') return ''
  const date = new Date(y, m, 1)
  const loc = locale.value === 'zh' ? 'zh-TW' : 'en-US'
  try {
    let formatted = date.toLocaleDateString(loc, { month: 'long', year: 'numeric' })
    if (locale.value === 'zh') {
      formatted = formatted.replace(/\s+/g, '')
    }
    return formatted
  } catch (e) {
    return ''
  }
})

// Calendar days for stress picker (uses availableStressDates)
const stressCalendarDays = computed(() => {
  const days = []
  const firstDay = new Date(stressCalendarYear.value, stressCalendarMonth.value, 1)
  const lastDay = new Date(stressCalendarYear.value, stressCalendarMonth.value + 1, 0)
  const startDay = firstDay.getDay()
  const today = new Date().toISOString().split('T')[0]

  const prevMonthLastDay = new Date(stressCalendarYear.value, stressCalendarMonth.value, 0).getDate()
  for (let i = startDay - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i
    const date = new Date(stressCalendarYear.value, stressCalendarMonth.value - 1, dayNum).toISOString().split('T')[0]
    days.push({
      dayNumber: dayNum,
      date: date,
      currentMonth: false,
      isToday: date === today,
      isSelected: date === selectedStressDate.value,
      hasData: availableStressDates.value.includes(date)
    })
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(stressCalendarYear.value, stressCalendarMonth.value, i).toISOString().split('T')[0]
    days.push({
      dayNumber: i,
      date: date,
      currentMonth: true,
      isToday: date === today,
      isSelected: date === selectedStressDate.value,
      hasData: availableStressDates.value.includes(date)
    })
  }

  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(stressCalendarYear.value, stressCalendarMonth.value + 1, i).toISOString().split('T')[0]
    days.push({
      dayNumber: i,
      date: date,
      currentMonth: false,
      isToday: date === today,
      isSelected: date === selectedStressDate.value,
      hasData: availableStressDates.value.includes(date)
    })
  }

  return days
})

// Calendar methods
const previousMonth = () => {
  if (calendarMonth.value === 0) {
    calendarMonth.value = 11
    calendarYear.value--
  } else {
    calendarMonth.value--
  }
}

const nextMonth = () => {
  if (calendarMonth.value === 11) {
    calendarMonth.value = 0
    calendarYear.value++
  } else {
    calendarMonth.value++
  }
}

const selectDate = (day) => {
  if (!day.currentMonth) return
  selectedDate.value = day.date
  currentDate.value = formatDateForDisplay(day.date)
  showDatePicker.value = false
  loadHeartRateData()
  loadStressData()
}

// Load available dates from backend
const loadAvailableDates = async () => {
  const userId = viewedUserId.value
  // Use cache only when viewing current user
  if (!userId) {
    const cached = getCachedHeartRateDates()
    if (cached) {
      availableDates.value = cached
      hasHeartRateData.value = cached.length > 0
      if (cached.length > 0) {
        selectedDate.value = cached[0]
        currentDate.value = formatDateForDisplay(cached[0])
        // initialize pressure selected date to same default
        const recentDate = new Date(cached[0])
        calendarMonth.value = recentDate.getMonth()
        calendarYear.value = recentDate.getFullYear()
        return true
      }
      selectedDate.value = new Date().toISOString().split('T')[0]
      currentDate.value = formatDateForDisplay(selectedDate.value)
      return false
    }
  }

  if (showOfflineBanner.value) {
    hasHeartRateData.value = availableDates.value.length > 0
    if (!hasHeartRateData.value) {
      selectedDate.value = new Date().toISOString().split('T')[0]
      currentDate.value = formatDateForDisplay(selectedDate.value)
    }
    return hasHeartRateData.value
  }

  try {
    const response = await getHeartRateDates({ userId })

    if (response.success && response.data.dates && response.data.dates.length > 0) {
      availableDates.value = response.data.dates
      if (!userId) setCachedHeartRateDates(response.data.dates)  // Cache the result only for current user
      showingCachedData.value = false
      hasHeartRateData.value = true
      // Set the most recent date as default
      selectedDate.value = response.data.dates[0]
      currentDate.value = formatDateForDisplay(response.data.dates[0])
      // Set calendar to the month of most recent data
      const recentDate = new Date(response.data.dates[0])
      calendarMonth.value = recentDate.getMonth()
      calendarYear.value = recentDate.getFullYear()
      return true
    }
    // No heart rate data - set today as default date for display
    hasHeartRateData.value = false
    selectedDate.value = new Date().toISOString().split('T')[0]
    currentDate.value = formatDateForDisplay(selectedDate.value)
    return false
  } catch (error) {
    console.error('Error loading available dates:', error)
    
    // Try to load from cache when network fails (even for admin viewing other users)
    const cached = getCachedHeartRateDates()
    if (cached && cached.length > 0) {
      console.log('Loading heart rate dates from offline cache')
      showingCachedData.value = true
      availableDates.value = cached
      hasHeartRateData.value = true
      selectedDate.value = cached[0]
      currentDate.value = formatDateForDisplay(cached[0])
      const recentDate = new Date(cached[0])
      calendarMonth.value = recentDate.getMonth()
      calendarYear.value = recentDate.getFullYear()
      return true
    }
    
    hasHeartRateData.value = false
    // Set today as default date
    selectedDate.value = new Date().toISOString().split('T')[0]
    currentDate.value = formatDateForDisplay(selectedDate.value)
    return false
  }
}

// Load available stress dates (cache-aware)
const loadAvailableStressDates = async () => {
  // Check cache first
  const cached = getCachedStressDates()
  if (cached) {
    availableStressDates.value = cached
    hasStressData.value = cached.length > 0
    if (cached.length > 0) {
      selectedStressDate.value = cached[0]
      currentStressDate.value = formatDateForDisplay(cached[0])
      const recentDate = new Date(cached[0])
      stressCalendarMonth.value = recentDate.getMonth()
      stressCalendarYear.value = recentDate.getFullYear()
      await loadStressData(cached[0])
      return true
    }
    return false
  }

  if (showOfflineBanner.value) {
    hasStressData.value = availableStressDates.value.length > 0
    return hasStressData.value
  }

  try {
    const userId = viewedUserId.value
    const response = await getStressDates({ userId })
    if (response.success && response.data && Array.isArray(response.data.dates) && response.data.dates.length > 0) {
      availableStressDates.value = response.data.dates
      if (!userId) setCachedStressDates(response.data.dates)
      showingCachedData.value = false
      hasStressData.value = true
      selectedStressDate.value = response.data.dates[0]
      currentStressDate.value = formatDateForDisplay(response.data.dates[0])
      const recentDate = new Date(response.data.dates[0])
      stressCalendarMonth.value = recentDate.getMonth()
      stressCalendarYear.value = recentDate.getFullYear()
      await loadStressData(response.data.dates[0])
      return true
    }
    hasStressData.value = false
    return false
  } catch (error) {
    console.error('Error loading available stress dates:', error)
    
    // Try to load from cache when network fails
    const cachedFallback = getCachedStressDates()
    if (cachedFallback && cachedFallback.length > 0) {
      console.log('Loading stress dates from offline cache')
      showingCachedData.value = true
      availableStressDates.value = cachedFallback
      hasStressData.value = true
      selectedStressDate.value = cachedFallback[0]
      currentStressDate.value = formatDateForDisplay(cachedFallback[0])
      const recentDate = new Date(cachedFallback[0])
      stressCalendarMonth.value = recentDate.getMonth()
      stressCalendarYear.value = recentDate.getFullYear()
      await loadStressData(cachedFallback[0])
      return true
    }
    
    hasStressData.value = false
    return false
  }
}

// Load heart rate data from backend for selected date (aggregated format)
const loadHeartRateData = async () => {
  if (!selectedDate.value) return
  const userId = viewedUserId.value

  if (showOfflineBanner.value) {
    isHeartRateLoading.value = false
    return
  }

  isHeartRateLoading.value = true
  try {
    const response = await getHeartRateRecords({ date: selectedDate.value, userId })

    if (response.success && response.data.records.length > 0) {
      const record = response.data.records[0]  // One document per day

      // Cache the record for offline use (only for current user)
      if (!userId) setCachedHeartRateRecord(selectedDate.value, record)
      showingCachedData.value = false

      // Use aggregated hourly data directly
      heartRateData.value = record.hourlyData

      // Calculate stats from hourly data
      const hourlyValues = record.hourlyData.filter(h => h.avg > 0)

      // Use min/max of average values (matching what's shown in the chart)
      const avgValues = hourlyValues.map(h => h.avg)
      const actualMin = avgValues.length > 0
        ? Math.min(...avgValues)
        : 0
      const actualMax = avgValues.length > 0
        ? Math.max(...avgValues)
        : 0
      const actualAvg = avgValues.length > 0
        ? Math.round(avgValues.reduce((sum, v) => sum + v, 0) / avgValues.length)
        : 0

      // Fallback: if the record includes stress values in the same hourly data, derive stress from it
      if (record.hourlyData && record.hourlyData.length > 0 && (record.hourlyData[0].hasOwnProperty('stress') || record.hourlyData[0].hasOwnProperty('stress_avg') || record.hourlyData[0].hasOwnProperty('stressAvg'))) {
        const sArr = record.hourlyData.map(h => ({ avg: h.stress ?? h.stress_avg ?? h.stressAvg ?? null }))
        const sValsAll = sArr.map(h => Number(h.avg)).filter(v => !isNaN(v))
        const sValsNonZero = sValsAll.filter(v => v !== 0)
        const sMin = sValsNonZero.length > 0 ? Math.min(...sValsNonZero) : null
        const sMax = sValsAll.length > 0 ? Math.max(...sValsAll) : null
        const sAvg = sValsNonZero.length > 0 ? Math.round(sValsNonZero.reduce((s, v) => s + v, 0) / sValsNonZero.length) : null
        stressData.value = sArr
        stressStats.value = { min: sMin, max: sMax, avg: sAvg }
        hasStressData.value = sValsAll.length > 0
        updateStressChartFromAggregated(stressData.value)
      }

      // Calculate resting heart rate from the actual minimum values in hourly data
      const actualRestingMin = hourlyValues.length > 0
        ? Math.min(...hourlyValues.map(h => h.min))
        : 0

      stats.value = {
        min: actualMin,
        max: actualMax,
        avg: actualAvg,
        resting: actualRestingMin,
        count: record.dailyStats?.count || 0
      }

      hasHeartRateData.value = true
      updateChartFromAggregated(record.hourlyData)
    } else {
      heartRateData.value = []
      stats.value = { min: 0, max: 0, avg: 0, resting: 0, count: 0 }
      chartData.value = null
    }
  } catch (error) {
    console.error('Error loading heart rate data:', error)
    
    // Try to load from cache when network fails
    const cached = getCachedHeartRateRecord(selectedDate.value)
    if (cached) {
      console.log('Loading heart rate data from offline cache')
      showingCachedData.value = true
      const record = cached
      
      heartRateData.value = record.hourlyData
      const hourlyValues = record.hourlyData.filter(h => h.avg > 0)
      const avgValues = hourlyValues.map(h => h.avg)
      const actualMin = avgValues.length > 0 ? Math.min(...avgValues) : 0
      const actualMax = avgValues.length > 0 ? Math.max(...avgValues) : 0
      const actualAvg = avgValues.length > 0 ? Math.round(avgValues.reduce((sum, v) => sum + v, 0) / avgValues.length) : 0
      const actualRestingMin = hourlyValues.length > 0 ? Math.min(...hourlyValues.map(h => h.min)) : 0
      
      stats.value = {
        min: actualMin,
        max: actualMax,
        avg: actualAvg,
        resting: actualRestingMin,
        count: record.dailyStats?.count || 0
      }
      
      hasHeartRateData.value = true
      updateChartFromAggregated(record.hourlyData)
    } else {
      heartRateData.value = []
      stats.value = { min: 0, max: 0, avg: 0, resting: 0, count: 0 }
      chartData.value = null
    }
  } finally {
    isHeartRateLoading.value = false
  }
}

const updateChartFromAggregated = (hourlyData) => {
  if (!hourlyData || hourlyData.length === 0) {
    chartData.value = null
    return
  }

  chartData.value = {
    labels: Array.from({ length: 24 }, (_, h) => `${h.toString().padStart(2, '0')}:00`),
    datasets: [{
      label: t('home.heartRate.heartRateBpm'),
      data: hourlyData.map(h => h.avg),  // Use pre-calculated averages
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#ef4444',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverRadius: 5
    }]
  }
}

// Load stress data from backend for selected date (aggregated format)
const loadStressData = async (date) => {
  // Use passed date -> selectedStressDate -> fallback to selected heart-rate date
  const useDate = date || selectedStressDate.value || selectedDate.value
  if (!useDate) return

  if (showOfflineBanner.value) {
    isStressLoading.value = false
    return
  }

  isStressLoading.value = true
  try {
    const userId = viewedUserId.value
    const response = await getStressRecords({ date: useDate, userId })
    if (response.success && response.data.records && response.data.records.length > 0) {
      const record = response.data.records[0]
      
      // Cache the record for offline use (only for current user)
      if (!userId) setCachedStressRecord(useDate, record)
      showingCachedData.value = false
      
      stressData.value = record.hourlyData || []
      const hourlyValues = stressData.value.filter(h => h.avg !== undefined && h.avg !== null)
      const avgValuesAll = hourlyValues.map(h => Number(h.avg)).filter(v => !isNaN(v))
      const avgValuesNonZero = avgValuesAll.filter(v => v !== 0)
      const actualMin = avgValuesNonZero.length > 0 ? Math.min(...avgValuesNonZero) : null
      const actualMax = avgValuesAll.length > 0 ? Math.max(...avgValuesAll) : null
      const actualAvg = avgValuesNonZero.length > 0 ? Math.round(avgValuesNonZero.reduce((s, v) => s + v, 0) / avgValuesNonZero.length) : null
      stressStats.value = { min: actualMin, max: actualMax, avg: actualAvg }
      hasStressData.value = avgValuesAll.length > 0
      updateStressChartFromAggregated(stressData.value)
    } else {
      stressData.value = []
      stressStats.value = { min: null, max: null, avg: null }
      stressChartData.value = null
      hasStressData.value = false
    }
  } catch (err) {
    console.error('Error loading stress data:', err)
    
    // Try to load from cache when network fails
    const cached = getCachedStressRecord(useDate)
    if (cached) {
      console.log('Loading stress data from offline cache')
      showingCachedData.value = true
      const record = cached
      
      stressData.value = record.hourlyData || []
      const hourlyValues = stressData.value.filter(h => h.avg !== undefined && h.avg !== null)
      const avgValuesAll = hourlyValues.map(h => Number(h.avg)).filter(v => !isNaN(v))
      const avgValuesNonZero = avgValuesAll.filter(v => v !== 0)
      const actualMin = avgValuesNonZero.length > 0 ? Math.min(...avgValuesNonZero) : null
      const actualMax = avgValuesAll.length > 0 ? Math.max(...avgValuesAll) : null
      const actualAvg = avgValuesNonZero.length > 0 ? Math.round(avgValuesNonZero.reduce((s, v) => s + v, 0) / avgValuesNonZero.length) : null
      stressStats.value = { min: actualMin, max: actualMax, avg: actualAvg }
      hasStressData.value = avgValuesAll.length > 0
      updateStressChartFromAggregated(stressData.value)
    } else {
      stressData.value = []
      stressStats.value = { min: null, max: null, avg: null }
      stressChartData.value = null
      hasStressData.value = false
    }
  } finally {
    isStressLoading.value = false
  }
}

const updateStressChartFromAggregated = (hourlyData) => {
  if (!hourlyData || hourlyData.length === 0) {
    stressChartData.value = null
    return
  }
  stressChartData.value = {
    labels: Array.from({ length: 24 }, (_, h) => `${h.toString().padStart(2, '0')}:00`),
    datasets: [{
      label: t('home.stress.stressScoreWithUnit'),
      data: hourlyData.map(h => h.avg !== undefined ? h.avg : null),
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37,99,235,0.06)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#2563eb',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverRadius: 5
    }]
  }
}

// Load viewed user's basic info (used only when admin views another user's home)
const loadViewedUser = async () => {
  const id = viewedUserId.value
  if (!id) {
    viewedUser.value = null
    return
  }
  viewedUserLoading.value = true
  viewedUserError.value = ''
  try {
    const res = await getUserById(id)

    // Not found (we normalized 404 responses in service)
    if (!res || (res.success === false && res.status === 404)) {
      viewedUserError.value = t('home.userNotFound')
      viewedUser.value = null
      return
    }

    // Support multiple response shapes: { data: { user } }, { data }, { user }, or raw object
    viewedUser.value = res?.data?.user || res?.data || res?.user || res || null

    // Fetch user's service status from the new API
    if (viewedUser.value && id) {
      try {
        const resStatus = await fetchWithAuth(`${API_URL}/api/admin/users/${id}/status`, { credentials: 'include' })
        if (resStatus.ok) {
          const j = await resStatus.json().catch(() => null)
          const s = j?.data?.status || 'On-going'
          const key = String(s).toLowerCase() === 'completed' ? 'completed' : 'ongoing'
          viewedUser.value.serviceStatusKey = key
          viewedUser.value.serviceStatus = key === 'completed' ? t('admin.statusCompleted') : t('admin.statusOnGoing')
        }
      } catch (e) {
        // ignore and keep no service status
      }
    }

  } catch (err) {
    // Show a friendly message for network/server issues
    viewedUserError.value = err.message || t('home.userLoadFailed')
    viewedUser.value = null
  } finally {
    viewedUserLoading.value = false
  }
}


const forceReloadStressData = async () => {
  try {
    const userId = viewedUserId.value
    const response = await getStressDates({ userId })
    if (response.success && response.data.dates && response.data.dates.length > 0) {
      if (!userId) setCachedStressDates(response.data.dates)
      hasStressData.value = true
      // If current selected date is not set or not in list, set the latest
      if (!selectedStressDate.value || !response.data.dates.includes(selectedStressDate.value)) {
        selectedStressDate.value = response.data.dates[0]
        currentStressDate.value = formatDateForDisplay(response.data.dates[0])
      }
      await loadStressData()
    }
  } catch (error) {
    console.error('Error loading stress dates:', error)
  }
}

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      display: true,
      labels: {
        color: isDarkMode.value ? '#9ca3af' : '#6b7280',
        usePointStyle: true,
        padding: 20,
        font: { size: 12, weight: 'bold' }
      }
    },
    tooltip: {
      backgroundColor: isDarkMode.value ? '#1f2937' : '#fff',
      titleColor: isDarkMode.value ? '#f3f4f6' : '#111827',
      bodyColor: isDarkMode.value ? '#d1d5db' : '#374151',
      borderColor: isDarkMode.value ? '#374151' : '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      titleFont: { size: 14 },
      bodyFont: { size: 14 },
      callbacks: {
        label: (ctx) => ctx.parsed.y ? `${ctx.parsed.y} ${t('home.heartRate.bpm')}` : t('home.heartRate.noData')
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      min: 40,
      max: 140,
      ticks: { color: isDarkMode.value ? '#9ca3af' : '#6b7280', font: { size: 14 } },
      grid: { color: isDarkMode.value ? '#374151' : '#e5e7eb', drawBorder: false }
    },
    x: {
      ticks: { color: isDarkMode.value ? '#9ca3af' : '#6b7280' },
      grid: { display: false, drawBorder: false }
    }
  }
}))

watch(isDarkMode, () => {
  // Re-render charts when theme changes
  if (heartRateData.value && heartRateData.value.length > 0) {
    updateChartFromAggregated(heartRateData.value)
  }
  if (stressData.value && stressData.value.length > 0) {
    updateStressChartFromAggregated(stressData.value)
  }
})

watch(locale, () => {
  // Re-render charts when language changes so labels/units update
  if (heartRateData.value && heartRateData.value.length > 0) {
    updateChartFromAggregated(heartRateData.value)
  }
  if (stressData.value && stressData.value.length > 0) {
    updateStressChartFromAggregated(stressData.value)
  }
})

const stressChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      display: true,
      labels: {
        color: isDarkMode.value ? '#9ca3af' : '#6b7280',
        usePointStyle: true,
        padding: 20,
        font: { size: 12, weight: 'bold' }
      }
    },
    tooltip: {
      backgroundColor: isDarkMode.value ? '#1f2937' : '#fff',
      titleColor: isDarkMode.value ? '#f3f4f6' : '#111827',
      bodyColor: isDarkMode.value ? '#d1d5db' : '#374151',
      borderColor: isDarkMode.value ? '#374151' : '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      titleFont: { size: 14 },
      bodyFont: { size: 14 },
      callbacks: {
        label: (ctx) => ctx.parsed.y ? `${ctx.parsed.y} ${t('home.stress.unit')}` : t('home.stress.noData')
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: 100,
      ticks: { color: isDarkMode.value ? '#9ca3af' : '#6b7280', font: { size: 14 } },
      grid: { color: isDarkMode.value ? '#374151' : '#e5e7eb', drawBorder: false }
    },
    x: {
      ticks: { color: isDarkMode.value ? '#9ca3af' : '#6b7280' },
      grid: { display: false, drawBorder: false }
    }
  }
}))

watch(selectedDate, () => {
  if (selectedDate.value) {
    currentDate.value = formatDateForDisplay(selectedDate.value)
  }
})


watch(selectedStressDate, () => {
  if (selectedStressDate.value) {
    currentStressDate.value = formatDateForDisplay(selectedStressDate.value)
    loadStressData(selectedStressDate.value)
  }
})

const changeDate = (days) => {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() + days)
  selectedDate.value = date.toISOString().split('T')[0]
  currentDate.value = formatDateForDisplay(selectedDate.value)
  // Update calendar to show the new month if needed
  calendarMonth.value = date.getMonth()
  calendarYear.value = date.getFullYear()
  loadHeartRateData()
  // Also load stress data for the selected date
  loadStressData()
}

const previousDate = () => changeDate(-1)
const nextDate = () => changeDate(1)

// Stress date helpers
const changeStressDate = (days) => {
  const date = new Date(selectedStressDate.value || new Date().toISOString().split('T')[0])
  date.setDate(date.getDate() + days)
  selectedStressDate.value = date.toISOString().split('T')[0]
  currentStressDate.value = formatDateForDisplay(selectedStressDate.value)
  stressCalendarMonth.value = date.getMonth()
  stressCalendarYear.value = date.getFullYear()
  loadStressData()
}
const previousStressDate = () => changeStressDate(-1)
const nextStressDate = () => changeStressDate(1)

const previousStressMonth = () => {
  if (stressCalendarMonth.value === 0) {
    stressCalendarMonth.value = 11
    stressCalendarYear.value--
  } else {
    stressCalendarMonth.value--
  }
}

const nextStressMonth = () => {
  if (stressCalendarMonth.value === 11) {
    stressCalendarMonth.value = 0
    stressCalendarYear.value++
  } else {
    stressCalendarMonth.value++
  }
}

// Select stress date handler
const selectStressDate = (day) => {
  if (!day.currentMonth) return
  selectedStressDate.value = day.date
  currentStressDate.value = formatDateForDisplay(day.date)
  stressCalendarMonth.value = new Date(day.date).getMonth()
  stressCalendarYear.value = new Date(day.date).getFullYear()
  showStressDatePicker.value = false
  loadStressData(day.date)
}

// Close date picker when clicking outside (handle both pickers)
const closeDatePicker = (event) => {
  if ((showDatePicker.value || showStressDatePicker.value) && !event.target.closest('.relative')) {
    showDatePicker.value = false
    showStressDatePicker.value = false
  }
}

const updateNetworkStatus = () => {
  isOffline.value = typeof navigator !== 'undefined' ? !navigator.onLine : false
  isOnline.value = !isOffline.value
}

// Force reload BMI data (bypassing cache)
const forceReloadBMIData = async () => {
  const userId = viewedUserId.value
  isBMILoading.value = true
  try {
    const { success, data } = await getLatestBMIRecord({ userId })
    const result = success && data ? {
      bmi: data.bmi,
      category: data.category,
      height: data.height,
      weight: data.weight,
      age: data.age || null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    } : { bmi: null, category: '', height: null, weight: null, age: null }

    bmiData.value = result
    if (!userId) setCachedBmiData(result)
  } catch (error) {
    console.error('Failed to load BMI data:', error)
    bmiData.value = { bmi: null, category: '', height: null, weight: null, age: null }
  } finally {
    isBMILoading.value = false
  }
}

// Force reload heart rate dates (bypassing cache)
const forceReloadHeartRateData = async () => {
  try {
    const userId = viewedUserId.value
    const response = await getHeartRateDates({ userId })
    if (response.success && response.data.dates && response.data.dates.length > 0) {
      availableDates.value = response.data.dates
      if (!userId) setCachedHeartRateDates(response.data.dates)
      hasHeartRateData.value = true
      selectedDate.value = response.data.dates[0]
      currentDate.value = formatDateForDisplay(response.data.dates[0])
      const recentDate = new Date(response.data.dates[0])
      calendarMonth.value = recentDate.getMonth()
      calendarYear.value = recentDate.getFullYear()
      await loadHeartRateData()
    }
  } catch (error) {
    console.error('Error loading available dates:', error)
  }
}

const initHeartRateData = async () => {
  const hasData = await loadAvailableDates()
  if (hasData) {
    await loadHeartRateData()
  }
}

// Manual refresh all data (for refresh button)
const manualRefreshAllData = async () => {
  showingCachedData.value = false
  await Promise.all([
    forceReloadBMIData(),
    forceReloadHeartRateData(),
    forceReloadStressData()
  ])
}

// Handle online/offline events
watch(viewedUserId, async () => {
  // Re-initialize data when admin switches to view a specific user's home
  await loadViewedUser()
  await initHeartRateData()
  await loadAvailableStressDates()
  await loadBMIData()
}, { immediate: true })

onMounted(() => {
  initHeartRateData()
  loadBMIData()
  // Also attempt to load stress dates (if stress-only CSV was uploaded)
  forceReloadStressData()

  // Ensure initial viewed user is loaded if needed
  if (viewedUserId.value) loadViewedUser()
  // Also load cached/available stress dates and set default stress date
  loadAvailableStressDates()
  window.addEventListener('bmiDataUpdated', forceReloadBMIData)
  window.addEventListener('heartRateDataUpdated', forceReloadHeartRateData)
  window.addEventListener('stressDataUpdated', forceReloadStressData)
  window.addEventListener('online', updateNetworkStatus)
  window.addEventListener('offline', updateNetworkStatus)
  updateNetworkStatus()
  document.addEventListener('click', closeDatePicker)
})

onUnmounted(() => {
  window.removeEventListener('bmiDataUpdated', forceReloadBMIData)
  window.removeEventListener('heartRateDataUpdated', forceReloadHeartRateData)
  window.removeEventListener('stressDataUpdated', forceReloadStressData)
  window.removeEventListener('online', updateNetworkStatus)
  window.removeEventListener('offline', updateNetworkStatus)
  document.removeEventListener('click', closeDatePicker)
})
</script>

<style scoped>
/* Make date picker calendar icon visible in dark mode */
.dark-date-picker::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>
