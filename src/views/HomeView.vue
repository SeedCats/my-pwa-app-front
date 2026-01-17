<template>
  <div class="min-h-full" :class="themeClasses.background">
    <Sidebar @update:sidebarState="updateSidebarState" />
    <div :class="[
      'transition-all duration-300 ease-in-out pt-16',
      sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
    ]">
      <main class="px-3 sm:px-4 md:px-6 lg:px-6 pb-4">

        <!-- Overall Analysis Section -->
        <div v-if="showOverallAnalysis" class="mb-6 pt-4">
          <div class="rounded-lg shadow-sm p-4 border flex items-center justify-between"
            :class="[themeClasses.cardBackground, themeClasses.border]">
            <div>
              <h2 class="text-2xl font-bold" :class="themeClasses.textPrimary">{{ $t('home.overallAnalysis.title') }}
              </h2>
              <p class="text-sm mt-1" :class="themeClasses.textSecondary">{{ overallAnalysis.summary }}</p>
              <div class="mt-2 flex items-center gap-3">
                <div class="text-4xl font-bold" :class="themeClasses.textPrimary">{{ overallAnalysis.score }}</div>
                <div class="inline-block text-white px-3 py-1 rounded-full text-sm font-semibold"
                  :class="overallAnalysis.badgeClass">{{
                    $t(`home.overallAnalysis.statuses.${overallAnalysis.statusKey}`) }}</div>
              </div>
              <div class="mt-3 text-sm" :class="themeClasses.textSecondary">
                <h4 class="font-semibold">{{ $t('home.overallAnalysis.adviceTitle') }}</h4>
                <ul class="list-disc list-inside mt-1">
                  <li v-for="(a, i) in overallAnalysis.advice" :key="i">{{ a }}</li>
                </ul>
              </div>
            </div>
            <div class="w-48">
              <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div :style="{ width: overallAnalysis.score + '%' }" class="h-full rounded-full"
                  :class="overallAnalysis.progressClass"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- BMI Information Section -->
        <div class="mb-8 pt-4">
          <div class="rounded-lg shadow-sm p-6 border" :class="[themeClasses.cardBackground, themeClasses.border]">
            <!-- BMI Title -->
            <div class="flex items-center justify-center mb-6">
              <div class="text-center">
                <h2 class="text-3xl font-bold" :class="themeClasses.textPrimary">{{ $t('home.bmi.title') }}</h2>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="isBMILoading" class="text-center py-8">
              <svg class="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <p :class="themeClasses.textSecondary" class="mt-2">{{ $t('home.bmi.loading') }}</p>
            </div>

            <!-- No Data Message -->
            <div v-else-if="!bmiData.bmi" class="text-center py-8">
              <p :class="themeClasses.textSecondary" class="mb-4">{{ $t('home.bmi.noData') }}</p>
              <router-link to="/data-setting"
                class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {{ $t('home.bmi.addData') }}
              </router-link>
            </div>

            <!-- BMI Value and Status -->
            <div v-else>
              <div class="text-center mb-8">
                <div class="text-6xl font-bold mb-2" :class="themeClasses.textPrimary">{{ bmiData.bmi }}</div>
                <div class="inline-block text-white px-4 py-1 rounded-full text-sm font-semibold mb-4"
                  :class="bmiCategoryStyle">{{ bmiCategoryKey ? $t(`home.bmi.categories.${bmiCategoryKey}`) :
                    bmiData.category }}</div>
              </div>

              <!-- BMI Slider -->
              <div class="mb-8">
                <div class="relative h-2 bg-gradient-to-r from-blue-400 via-green-400 to-orange-500 rounded-full mb-2">
                  <!-- BMI Indicator -->
                  <div
                    class="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow-lg"
                    :style="{ left: bmiSliderPosition + '%' }"></div>
                </div>
                <div class="flex justify-between text-xs" :class="themeClasses.textSecondary">
                  <span>18.5</span>
                  <span>24.0</span>
                  <span>29.0</span>
                </div>
              </div>

              <!-- BMI Categories -->
              <div class="grid grid-cols-4 gap-2 mb-8 text-center text-xs">
                <div class="flex flex-col items-center">
                  <div class="w-4 h-4 rounded-full bg-blue-400 mb-2"
                    :class="{ 'ring-2 ring-offset-2 ring-blue-400': bmiCategoryKey === 'underweight' }"></div>
                  <span :class="[themeClasses.textSecondary, { 'font-bold': bmiCategoryKey === 'underweight' }]">{{
                    $t('home.bmi.categories.underweight') }}</span>
                </div>
                <div class="flex flex-col items-center">
                  <div class="w-4 h-4 rounded-full bg-green-400 mb-2"
                    :class="{ 'ring-2 ring-offset-2 ring-green-400': bmiCategoryKey === 'normal' }"></div>
                  <span :class="[themeClasses.textSecondary, { 'font-bold': bmiCategoryKey === 'normal' }]">{{
                    $t('home.bmi.categories.normal') }}</span>
                </div>
                <div class="flex flex-col items-center">
                  <div class="w-4 h-4 rounded-full bg-yellow-400 mb-2"
                    :class="{ 'ring-2 ring-offset-2 ring-yellow-400': bmiCategoryKey === 'overweight' }"></div>
                  <span :class="[themeClasses.textSecondary, { 'font-bold': bmiCategoryKey === 'overweight' }]">{{
                    $t('home.bmi.categories.overweight') }}</span>
                </div>
                <div class="flex flex-col items-center">
                  <div class="w-4 h-4 rounded-full bg-orange-500 mb-2"
                    :class="{ 'ring-2 ring-offset-2 ring-orange-500': bmiCategoryKey === 'obese' }"></div>
                  <span :class="[themeClasses.textSecondary, { 'font-bold': bmiCategoryKey === 'obese' }]">{{
                    $t('home.bmi.categories.obese') }}</span>
                </div>
              </div>

              <!-- Data Analysis Section -->
              <div class="border-t pt-6" :class="themeClasses.border">
                <h4 class="text-lg font-semibold mb-6" :class="themeClasses.textPrimary">{{ $t('home.dataAnalysis') }}
                </h4>
                <div class="space-y-4">
                  <div class="flex justify-between items-center pb-4 border-b" :class="themeClasses.border">
                    <span :class="themeClasses.textSecondary">{{ $t('dataSettings.age') }}</span>
                    <span class="text-lg font-semibold" :class="themeClasses.textPrimary">{{ bmiData.age || '--'
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center pb-4 border-b" :class="themeClasses.border">
                    <span :class="themeClasses.textSecondary">{{ $t('dataSettings.height') }}</span>
                    <span class="text-lg font-semibold" :class="themeClasses.textPrimary">{{ bmiData.height || '--'
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center pb-4 border-b" :class="themeClasses.border">
                    <span :class="themeClasses.textSecondary">{{ $t('dataSettings.weight') }}</span>
                    <span class="text-lg font-semibold" :class="themeClasses.textPrimary">{{ bmiData.weight || '--'
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span :class="themeClasses.textSecondary">{{ $t('home.bmi.bmiRange') }}</span>
                    <span class="text-lg font-semibold" :class="themeClasses.textPrimary">{{ bmiRangeDisplay }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Header Section -->
        <div class="mb-6 sm:mt-4 md:mt-4">

          <div class="flex items-center justify-center mb-4">
            <div class="text-center">
              <h1 class="text-3xl font-bold" :class="themeClasses.textPrimary">{{ $t('home.heartRate.title') }}</h1>
            </div>
          </div>

          <!-- Date Picker with Available Dates Indicator -->
          <template v-if="hasHeartRateData">
            <div class="flex justify-center gap-4 mb-4 items-center">
              <button @click="previousDate"
                class="px-4 py-2 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-90"
                :class="isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'">
                <svg class="w-6 h-6" :class="isDarkMode ? 'text-white' : 'text-gray-600'" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              <!-- Custom Date Selector -->
              <div class="relative">
                <button @click="showDatePicker = !showDatePicker"
                  class="px-4 py-2 rounded-lg border flex items-center gap-2 min-w-[200px] justify-between transition-all duration-150 transform hover:scale-105 active:scale-95 hover:shadow-md"
                  :class="[themeClasses.cardBackground, themeClasses.border, isDarkMode ? 'text-white' : 'text-gray-800']">
                  <span>{{ currentDate || $t('home.selectDate') }}</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </button>

                <!-- Date Picker Dropdown -->
                <div v-if="showDatePicker"
                  class="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50 rounded-lg shadow-xl border p-4 min-w-[320px]"
                  :class="[themeClasses.cardBackground, themeClasses.border]">
                  <!-- Month Navigation -->
                  <div class="flex items-center justify-between mb-4">
                    <button @click="previousMonth"
                      class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-transform duration-150 transform hover:scale-110 active:scale-90">
                      <svg class="w-5 h-5" :class="themeClasses.textPrimary" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7">
                        </path>
                      </svg>
                    </button>
                    <span class="font-semibold" :class="themeClasses.textPrimary">
                      {{ calendarMonthYear }}
                    </span>
                    <button @click="nextMonth"
                      class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-transform duration-150 transform hover:scale-110 active:scale-90">
                      <svg class="w-5 h-5" :class="themeClasses.textPrimary" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>

                  <!-- Day Headers -->
                  <div class="grid grid-cols-7 gap-1 mb-2">
                    <div v-for="day in weekDayNames" :key="day" class="text-center text-xs font-medium py-1"
                      :class="themeClasses.textSecondary">
                      {{ day }}
                    </div>
                  </div>

                  <!-- Calendar Days -->
                  <div class="grid grid-cols-7 gap-1">
                    <button v-for="day in calendarDays" :key="day.date" @click="selectDate(day)"
                      :disabled="!day.currentMonth"
                      class="relative p-2 text-sm rounded-lg transition-all duration-150 transform active:scale-90"
                      :class="[
                        day.currentMonth ? 'hover:scale-105' : 'opacity-30 cursor-not-allowed',
                        day.isSelected ? 'bg-blue-600 text-white shadow-lg scale-105' : '',
                        day.isToday && !day.isSelected ? 'bg-blue-600 text-white shadow-lg scale-105' : '',
                        !day.isSelected && day.currentMonth ? (isDarkMode ? 'hover:bg-gray-700 hover:shadow-md' : 'hover:bg-gray-100 hover:shadow-md') : '',
                        day.isSelected ? '' : themeClasses.textPrimary
                      ]">
                      {{ day.dayNumber }}
                      <!-- Data Available Indicator -->
                      <span v-if="day.hasData && day.currentMonth"
                        class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-transform duration-150"
                        :class="(day.isSelected || day.isToday) ? 'bg-white scale-125' : 'bg-green-500'"></span>
                    </button>
                  </div>

                  <!-- Legend -->
                  <div class="mt-4 pt-3 border-t flex items-center justify-center gap-4 text-xs"
                    :class="themeClasses.border">
                    <div class="flex items-center gap-1">
                      <span class="w-2 h-2 rounded-full bg-green-500"></span>
                      <span :class="themeClasses.textSecondary">{{ $t('home.heartRate.hasData') }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="w-4 h-4 rounded ring-2 ring-blue-400"></span>
                      <span :class="themeClasses.textSecondary">{{ $t('home.heartRate.today') }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button @click="nextDate"
                class="px-4 py-2 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-90"
                :class="isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'">
                <svg class="w-6 h-6" :class="isDarkMode ? 'text-white' : 'text-gray-600'" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>

            <!-- Main Heart Rate Stats -->
            <div class="text-center mb-6">
              <div class="text-6xl font-bold mb-1" :class="themeClasses.textPrimary">{{ stats.avg }}</div>
              <div class="text-lg mb-4" :class="themeClasses.textSecondary">{{ $t('home.heartRate.averageBpm') }}</div>
            </div>
          </template>

          <div v-else class="text-center py-8">
            <p :class="themeClasses.textSecondary" class="mb-4">{{ $t('home.heartRate.noData') }}</p>
            <router-link to="/data-setting"
              class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {{ $t('home.heartRate.addData') }}
            </router-link>
          </div>
        </div>

        <!-- Heart Rate Chart -->
        <div class="mb-8">
          <div class="rounded-lg shadow-sm pb-4 pl-4 pr-4 border"
            :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="relative" style="height: 500px;">
              <Line v-if="chartData" :data="chartData" :options="chartOptions" />
              <div v-else class="h-full flex items-center justify-center"
                :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-50'">
                <span :class="themeClasses.textSecondary">{{ isHeartRateLoading ? $t('home.heartRate.loading') :
                  $t('home.heartRate.noData') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Today Heart Rate Overview Section -->
        <div class="mb-8">
          <div class="rounded-lg shadow-sm p-6 border" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z">
                  </path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold" :class="themeClasses.textPrimary">{{ $t('home.todayOverview') }}</h3>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-3">
                <div class="text-4xl font-bold mb-2" :class="themeClasses.textPrimary">{{ stats.resting }}</div>
                <div class="text-sm" :class="themeClasses.textSecondary">{{ $t('home.restingHeartRate') }}</div>
              </div>
              <div class="text-center p-3">
                <div class="text-4xl font-bold mb-2" :class="themeClasses.textPrimary">{{ stats.max }}</div>
                <div class="text-sm" :class="themeClasses.textSecondary">{{ $t('home.maxHeartRate') }}</div>
              </div>
              <div class="text-center p-3">
                <div class="text-4xl font-bold mb-2" :class="themeClasses.textPrimary">{{ stats.min }}</div>
                <div class="text-sm" :class="themeClasses.textSecondary">{{ $t('home.minHeartRate') }}</div>
              </div>
              <div class="text-center p-3">
                <div class="text-4xl font-bold mb-2" :class="themeClasses.textPrimary">{{ stats.avg }}</div>
                <div class="text-sm" :class="themeClasses.textSecondary">{{ $t('home.averageHeartRate') }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center mb-4">
          <div class="text-center">
            <h1 class="text-3xl font-bold" :class="themeClasses.textPrimary">{{ $t('home.stress.title') }}</h1>
          </div>
        </div>

        <!-- Date Picker with Available Dates Indicator for Stress -->
        <template v-if="hasStressData">
          <div class="flex justify-center gap-4 mb-4 items-center mt-3">
            <button @click="previousStressDate"
              class="px-4 py-2 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-90"
              :class="isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'">
              <svg class="w-6 h-6" :class="isDarkMode ? 'text-white' : 'text-gray-600'" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <!-- Custom Date Selector -->
            <div class="relative">
              <button @click="showStressDatePicker = !showStressDatePicker"
                class="px-4 py-2 rounded-lg border flex items-center gap-2 min-w-[200px] justify-between transition-all duration-150 transform hover:scale-105 active:scale-95 hover:shadow-md"
                :class="[themeClasses.cardBackground, themeClasses.border, isDarkMode ? 'text-white' : 'text-gray-800']">
                <span>{{ currentStressDate || $t('home.selectDate') }}</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </button>

              <!-- Date Picker Dropdown -->
              <div v-if="showStressDatePicker"
                class="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50 rounded-lg shadow-xl border p-4 min-w-[320px]"
                :class="[themeClasses.cardBackground, themeClasses.border]">
                <!-- Month Navigation -->
                <div class="flex items-center justify-between mb-4">
                  <button @click="previousStressMonth"
                    class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-transform duration-150 transform hover:scale-110 active:scale-90">
                    <svg class="w-5 h-5" :class="themeClasses.textPrimary" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7">
                      </path>
                    </svg>
                  </button>
                  <span class="font-semibold" :class="themeClasses.textPrimary">
                    {{ stressCalendarMonthYear || $t('home.selectDate') }}
                  </span>
                  <button @click="nextStressMonth"
                    class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-transform duration-150 transform hover:scale-110 active:scale-90">
                    <svg class="w-5 h-5" :class="themeClasses.textPrimary" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>

                <!-- Day Headers -->
                <div class="grid grid-cols-7 gap-1 mb-2">
                  <div v-for="day in weekDayNames" :key="day" class="text-center text-xs font-medium py-1"
                    :class="themeClasses.textSecondary">
                    {{ day }}
                  </div>
                </div>

                <!-- Calendar Days -->
                <div class="grid grid-cols-7 gap-1">
                  <button v-for="day in stressCalendarDays" :key="day.date" @click="selectStressDate(day)"
                    :disabled="!day.currentMonth"
                    class="relative p-2 text-sm rounded-lg transition-all duration-150 transform active:scale-90"
                    :class="[
                      day.currentMonth ? 'hover:scale-105' : 'opacity-30 cursor-not-allowed',
                      day.isSelected ? 'bg-blue-600 text-white shadow-lg scale-105' : '',
                      day.isToday && !day.isSelected ? 'bg-blue-600 text-white shadow-lg scale-105' : '',
                      !day.isSelected && day.currentMonth ? (isDarkMode ? 'hover:bg-gray-700 hover:shadow-md' : 'hover:bg-gray-100 hover:shadow-md') : '',
                      day.isSelected ? '' : themeClasses.textPrimary
                    ]">
                    {{ day.dayNumber }}
                    <!-- Data Available Indicator -->
                    <span v-if="day.hasData && day.currentMonth"
                      class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-transform duration-150"
                      :class="(day.isSelected || day.isToday) ? 'bg-white scale-125' : 'bg-green-500'"></span>
                  </button>
                </div>

                <!-- Legend -->
                <div class="mt-4 pt-3 border-t flex items-center justify-center gap-4 text-xs"
                  :class="themeClasses.border">
                  <div class="flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                    <span :class="themeClasses.textSecondary">{{ $t('home.heartRate.hasData') }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="w-4 h-4 rounded ring-2 ring-blue-400"></span>
                    <span :class="themeClasses.textSecondary">{{ $t('home.heartRate.today') }}</span>
                  </div>
                </div>
              </div>
            </div>

            <button @click="nextStressDate"
              class="px-4 py-2 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-90"
              :class="isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'">
              <svg class="w-6 h-6" :class="isDarkMode ? 'text-white' : 'text-gray-600'" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          <div class="text-center mb-6">
            <div class="text-6xl font-bold mb-1" :class="themeClasses.textPrimary">{{ stressScore }}</div>
            <div class="text-lg mb-2" :class="themeClasses.textSecondary">{{ $t('home.stress.name') }}</div>
            <div class="mb-4">
              <div class="inline-block text-white px-3 py-1 rounded-full text-sm font-semibold" :class="stressCategoryBadgeClass">{{ stressCategoryLabel || '--' }}</div>
            </div>
          </div>
        </template>

        <div v-else class="text-center py-6">
          <p :class="themeClasses.textSecondary" class="mb-4">{{ $t('home.stress.noData') }}</p>
          <router-link to="/data-setting"
            class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {{ $t('home.heartRate.addData') }}</router-link>
        </div>

        <!-- Stress Chart -->
        <div class="mb-8">
          <div class="rounded-lg shadow-sm pb-4 pl-4 pr-4 border"
            :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="px-4 py-2">
              <div class="flex items-center justify-center">
                <div class="flex items-center gap-3">
                  <!-- Centered, slightly larger colored dot -->
                  <span class="w-4 h-4 rounded-full shadow-sm" style="background-color:#2563eb;"></span>
                  <span class="text-sm font-semibold" :class="themeClasses.textPrimary">{{ $t('home.stress.stressScore')
                  }}</span>
                </div>
              </div>
            </div>

            <div class="relative" style="height: 400px;">
              <Line v-if="stressChartData" :data="stressChartData" :options="stressChartOptions" />
              <div v-else class="h-full flex items-center justify-center"
                :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-50'">
                <span :class="themeClasses.textSecondary">{{ isStressLoading ? $t('home.stress.loading') :
                  $t('home.stress.noData') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Today Pressure Overview Section -->
        <div class="mb-8">
          <div class="rounded-lg shadow-sm p-6 border" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 100 12 6 6 0 000-12z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold" :class="themeClasses.textPrimary">{{ $t('home.todayStressOverview') }}
              </h3>
            </div>

            <!-- Stats Grid: Max / Min / Average -->
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center p-3">
                <div class="text-4xl font-bold mb-2" :class="themeClasses.textPrimary">{{ typeof stressStats.max === 'number' ? stressStats.max : '--' }}</div>
                <div class="text-sm" :class="themeClasses.textSecondary">{{ $t('home.stress.max') }}</div>
              </div>
              <div class="text-center p-3">
                <div class="text-4xl font-bold mb-2" :class="themeClasses.textPrimary">{{ typeof stressStats.min === 'number' ? stressStats.min : '--' }}</div>
                <div class="text-sm" :class="themeClasses.textSecondary">{{ $t('home.stress.min') }}</div>
              </div>
              <div class="text-center p-3">
                <div class="text-4xl font-bold mb-2" :class="themeClasses.textPrimary">{{ stressMeanRounded !== null ?
                  stressMeanRounded : '--' }}</div>
                <div class="text-sm" :class="themeClasses.textSecondary">{{ $t('home.stress.average') }}</div>
              </div>
            </div>

            <!-- Stress Ranges -->
            <div class="mt-4 pt-4 border-t" :class="themeClasses.border">
              <h4 class="text-sm font-semibold mb-2" :class="themeClasses.textPrimary">{{ $t('home.stress.rangeTitle') }}</h4>
              <div class="text-xs grid grid-cols-1 sm:grid-cols-2 gap-2" :class="themeClasses.textSecondary">
                <div>{{ $t('home.stress.range.relaxed') }}</div>
                <div>{{ $t('home.stress.range.light') }}</div>
                <div>{{ $t('home.stress.range.moderate') }}</div>
                <div>{{ $t('home.stress.range.severe') }}</div>
              </div>
            </div> 
          </div>
        </div>

        <!-- Quick Actions Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Data Setting Card -->
          <router-link to="/data-setting" class="block transform transition-transform duration-200 hover:scale-105">
            <div
              class="rounded-lg shadow-sm p-6 border cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col"
              :class="[themeClasses.cardBackground, themeClasses.border, 'hover:border-blue-300']">
              <div class="flex items-center mb-4">
                <div class="p-3 rounded-full mr-4" :class="isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'">
                  <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-semibold" :class="themeClasses.textPrimary">{{ $t('nav.dataSettings') }}
                  </h3>
                  <p class="text-xs" :class="themeClasses.textSecondary">{{ $t('home.quickAdd') }}</p>
                </div>
              </div>
              <p class="text-sm mb-4 leading-relaxed flex-grow" :class="themeClasses.textSecondary">
                {{ $t('home.recordData') }}
              </p>
              <div class="flex items-center text-blue-600 text-xs font-medium mt-auto">
                <span>{{ $t('home.addRecord') }}</span>
                <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </router-link>

          <!-- AI Advice Card -->
          <router-link to="/ai-support" class="block transform transition-transform duration-200 hover:scale-105">
            <div
              class="rounded-lg shadow-sm p-6 border cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col"
              :class="[themeClasses.cardBackground, themeClasses.border, 'hover:border-purple-300']">
              <div class="flex items-center mb-4">
                <div class="p-3 rounded-full mr-4" :class="isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'">
                  <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z">
                    </path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-semibold" :class="themeClasses.textPrimary">{{ $t('nav.aiSupport') }}</h3>
                  <p class="text-xs" :class="themeClasses.textSecondary">{{ $t('home.availableAlways') }}</p>
                </div>
              </div>
              <p class="text-sm mb-4 leading-relaxed flex-grow" :class="themeClasses.textSecondary">
                {{ $t('home.getAdvice') }}
              </p>
              <div class="flex items-center text-purple-600 text-xs font-medium mt-auto">
                <span>{{ $t('home.getAdviceButton') }}</span>
                <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </router-link>

          <!-- Manual Support Card -->
          <router-link to="/manual-support" class="block transform transition-transform duration-200 hover:scale-105">
            <div
              class="rounded-lg shadow-sm p-6 border cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col"
              :class="[themeClasses.cardBackground, themeClasses.border, 'hover:border-green-300']">
              <div class="flex items-center mb-4">
                <div class="p-3 rounded-full mr-4" :class="isDarkMode ? 'bg-green-900/30' : 'bg-green-100'">
                  <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
                    </path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-semibold" :class="themeClasses.textPrimary">{{ $t('nav.manualSupport') }}
                  </h3>
                  <p class="text-xs" :class="themeClasses.textSecondary">{{ $t('home.learnMore') }}</p>
                </div>
              </div>
              <p class="text-sm mb-4 leading-relaxed flex-grow" :class="themeClasses.textSecondary">
                {{ $t('home.accessGuides') }}
              </p>
              <div class="flex items-center text-green-600 text-xs font-medium mt-auto">
                <span>{{ $t('home.viewManual') }}</span>
                <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </router-link>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/Side_and_Top_Bar.vue'
import { useTheme } from '../composables/useTheme'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line } from 'vue-chartjs'
import { useI18n } from 'vue-i18n'
import { getLatestBMIRecord } from '../services/bmiService'
import { getHeartRateRecords, getHeartRateDates } from '../services/heartRateService'
import { getStressRecords, getStressDates } from '../services/stressService'
import { getCachedBmiData, setCachedBmiData, getCachedHeartRateDates, setCachedHeartRateDates, getCachedStressDates, setCachedStressDates } from '../stores/userStore'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const { isDarkMode, themeClasses } = useTheme()
const { t, locale } = useI18n()

// State
const sidebarHidden = ref(false)
const heartRateData = ref([])
const chartData = ref(null)
const selectedDate = ref('')
const currentDate = ref('')
const availableDates = ref([])

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

// Pressure visualization state
const isPressureLoading = ref(false)
const hasPressureData = ref(false)
const pressureData = ref([])
const pressureChartData = ref(null)
const pressureSummaryData = ref(null)

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

// Calendar state
const showDatePicker = ref(false)
const calendarMonth = ref(new Date().getMonth())
const calendarYear = ref(new Date().getFullYear())

const loadBMIData = async () => {
  // Check cache first
  const cached = getCachedBmiData()
  if (cached) {
    bmiData.value = cached
    return
  }

  isBMILoading.value = true
  try {
    const { success, data } = await getLatestBMIRecord()
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
    setCachedBmiData(result)  // Cache the result
  } catch (error) {
    console.error('Failed to load BMI data:', error)
    bmiData.value = { bmi: null, category: '', height: null, weight: null, age: null }
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

  // Status mapping
  let statusKey = 'excellent'
  if (score >= 85) statusKey = 'excellent'
  else if (score >= 70) statusKey = 'good'
  else if (score >= 50) statusKey = 'fair'
  else statusKey = 'poor'

  const badgeMap = { excellent: 'bg-green-500', good: 'bg-teal-500', fair: 'bg-yellow-500', poor: 'bg-orange-500' }
  const progressMap = { excellent: 'bg-green-500', good: 'bg-teal-500', fair: 'bg-yellow-500', poor: 'bg-orange-500' }

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

  return { score, statusKey, summary: t(`home.overallAnalysis.summary.${statusKey}`), advice, badgeClass: badgeMap[statusKey], progressClass: progressMap[statusKey] }
})

const updateSidebarState = (state) => sidebarHidden.value = state

// Format date for display
const formatDateForDisplay = (dateString) => {
  const date = new Date(dateString)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const loc = locale.value === 'zh' ? 'zh-TW' : 'en-US'
  return date.toLocaleDateString(loc, options)
}

// Calendar computed properties
const calendarMonthYear = computed(() => {
  const date = new Date(calendarYear.value, calendarMonth.value, 1)
  const loc = locale.value === 'zh' ? 'zh-TW' : 'en-US'
  return date.toLocaleDateString(loc, { month: 'long', year: 'numeric' })
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
    return date.toLocaleDateString(loc, { month: 'long', year: 'numeric' })
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
  // Check cache first
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

  try {
    const response = await getHeartRateDates()

    if (response.success && response.data.dates && response.data.dates.length > 0) {
      availableDates.value = response.data.dates
      setCachedHeartRateDates(response.data.dates)  // Cache the result
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

  try {
    const response = await getStressDates()
    if (response.success && response.data && Array.isArray(response.data.dates) && response.data.dates.length > 0) {
      availableStressDates.value = response.data.dates
      setCachedStressDates(response.data.dates)
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
    hasStressData.value = false
    return false
  }
}

// Load heart rate data from backend for selected date (aggregated format)
const loadHeartRateData = async () => {
  if (!selectedDate.value) return

  isHeartRateLoading.value = true
  try {
    const response = await getHeartRateRecords({ date: selectedDate.value })

    if (response.success && response.data.records.length > 0) {
      const record = response.data.records[0]  // One document per day

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
      // Create pressure visualization (mock) based on available heart rate data
      generateMockPressure()
    } else {
      heartRateData.value = []
      stats.value = { min: 0, max: 0, avg: 0, resting: 0, count: 0 }
      chartData.value = null
    }
  } catch (error) {
    console.error('Error loading heart rate data:', error)
    heartRateData.value = []
    stats.value = { min: 0, max: 0, avg: 0, resting: 0, count: 0 }
    chartData.value = null
  } finally {
    isHeartRateLoading.value = false
  }
}

// Stats are now loaded directly from aggregated data in loadHeartRateData

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

// Generate a simple mock pressure profile derived from heart rate presence (placeholder until backend exists)
const generateMockPressure = (date) => {
  if (!heartRateData.value || heartRateData.value.length === 0) {
    pressureChartData.value = null
    pressureSummaryData.value = null
    hasPressureData.value = false
    return
  }

  isPressureLoading.value = true

  // Pattern matching the reference image: first hours relaxed (3), then a drop to lower level (1) and stays
  // Optionally vary slightly by date to simulate changes
  const base = date ? new Date(date).getDate() % 3 : 0
  const values = Array.from({ length: 24 }, (_, i) => {
    if (i < 4) return 3
    // small variation using base
    return 1 + (base === 1 ? 0 : 0)
  })

  // small delay for UX
  setTimeout(() => {
    pressureData.value = values
    hasPressureData.value = true
    updatePressureChartFromData(values)
    updatePressureSummaryChart(values)
    isPressureLoading.value = false
  }, 60)
}

const updatePressureChartFromData = (values) => {
  if (!values || values.length === 0) {
    pressureChartData.value = null
    return
  }
  pressureChartData.value = {
    labels: Array.from({ length: values.length }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
    datasets: [{
      label: t('home.stress.scoreLabel'),
      data: values,
      borderColor: '#059669',
      backgroundColor: 'rgba(5,150,105,0.06)',
      fill: true,
      tension: 0.4,
      pointRadius: 0
    }]
  }
}

const updatePressureSummaryChart = (values) => {
  if (!values || values.length === 0) {
    pressureSummaryData.value = null
    return
  }
  const mean = values.reduce((s, v) => s + v, 0) / values.length
  pressureSummaryData.value = { mean, min: Math.min(...values), max: Math.max(...values) }
}


// Load stress data from backend for selected date (aggregated format)
const loadStressData = async (date) => {
  // Use passed date -> selectedStressDate -> fallback to selected heart-rate date
  const useDate = date || selectedStressDate.value || selectedDate.value
  if (!useDate) return
  isStressLoading.value = true
  try {
    const response = await getStressRecords({ date: useDate })
    if (response.success && response.data.records && response.data.records.length > 0) {
      const record = response.data.records[0]
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
    stressData.value = []
    stressStats.value = { min: null, max: null, avg: null }
    stressChartData.value = null
    hasStressData.value = false
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
      label: t('home.stress.stressScore'),
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

const forceReloadStressData = async () => {
  try {
    const response = await getStressDates()
    if (response.success && response.data.dates && response.data.dates.length > 0) {
      setCachedStressDates(response.data.dates)
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
  if (pressureData.value && pressureData.value.length > 0) {
    updatePressureChartFromData(pressureData.value)
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
  if (pressureData.value && pressureData.value.length > 0) {
    updatePressureChartFromData(pressureData.value)
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
    legend: { display: false },
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

// Force reload BMI data (bypassing cache)
const forceReloadBMIData = async () => {
  isBMILoading.value = true
  try {
    const { success, data } = await getLatestBMIRecord()
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
    setCachedBmiData(result)
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
    const response = await getHeartRateDates()
    if (response.success && response.data.dates && response.data.dates.length > 0) {
      availableDates.value = response.data.dates
      setCachedHeartRateDates(response.data.dates)
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

onMounted(() => {
  initHeartRateData()
  loadBMIData()
  // Also attempt to load stress dates (if stress-only CSV was uploaded)
  forceReloadStressData()
  // Also load cached/available stress dates and set default stress date
  loadAvailableStressDates()
  window.addEventListener('bmiDataUpdated', forceReloadBMIData)
  window.addEventListener('heartRateDataUpdated', forceReloadHeartRateData)
  window.addEventListener('stressDataUpdated', forceReloadStressData)
  document.addEventListener('click', closeDatePicker)
})

onUnmounted(() => {
  window.removeEventListener('bmiDataUpdated', forceReloadBMIData)
  window.removeEventListener('heartRateDataUpdated', forceReloadHeartRateData)
  window.removeEventListener('stressDataUpdated', forceReloadStressData)
  document.removeEventListener('click', closeDatePicker)
})
</script>

<style scoped>
/* Make date picker calendar icon visible in dark mode */
.dark-date-picker::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>