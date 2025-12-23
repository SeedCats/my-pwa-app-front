<template>
  <div class="min-h-full" :class="themeClasses.background">
    <Sidebar @update:sidebarState="updateSidebarState" />
    <div :class="[
      'transition-all duration-300 ease-in-out pt-16',
      sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
    ]">
      <main class="px-3 sm:px-4 md:px-6 lg:px-6 pb-4">

            <!-- BMI Information Section -->
            <div class="mb-8 pt-4">
              <div class="rounded-lg shadow-sm p-6 border" :class="[themeClasses.cardBackground, themeClasses.border]">
                <!-- BMI Title -->
                <div class="flex items-center justify-center mb-6">
                  <div class="text-center">
                    <h2 class="text-3xl font-bold" :class="themeClasses.textPrimary">BMI Information</h2>
                  </div>
                </div>

                <!-- Loading State -->
                <div v-if="isBMILoading" class="text-center py-8">
                  <svg class="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p :class="themeClasses.textSecondary" class="mt-2">Loading BMI data...</p>
                </div>

                <!-- No Data Message -->
                <div v-else-if="!bmiData.bmi" class="text-center py-8">
                  <p :class="themeClasses.textSecondary" class="mb-4">No BMI data available</p>
                  <router-link to="/addData" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Add BMI Data
                  </router-link>
                </div>

                <!-- BMI Value and Status -->
                <div v-else>
                  <div class="text-center mb-8">
                    <div class="text-6xl font-bold mb-2" :class="themeClasses.textPrimary">{{ bmiData.bmi }}</div>
                    <div class="inline-block text-white px-4 py-1 rounded-full text-sm font-semibold mb-4" :class="bmiCategoryStyle">{{ bmiData.category }}</div>
                  </div>

                  <!-- BMI Slider -->
                  <div class="mb-8">
                    <div class="relative h-2 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-orange-500 rounded-full mb-2">
                      <!-- BMI Indicator -->
                      <div 
                        class="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow-lg"
                        :style="{ left: bmiSliderPosition + '%' }"
                      ></div>
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
                      <div class="w-4 h-4 rounded-full bg-blue-400 mb-2" :class="{ 'ring-2 ring-offset-2 ring-blue-400': bmiData.category === 'Underweight' }"></div>
                      <span :class="[themeClasses.textSecondary, { 'font-bold': bmiData.category === 'Underweight' }]">Underweight</span>
                    </div>
                    <div class="flex flex-col items-center">
                      <div class="w-4 h-4 rounded-full bg-green-400 mb-2" :class="{ 'ring-2 ring-offset-2 ring-green-400': bmiData.category === 'Normal' }"></div>
                      <span :class="[themeClasses.textSecondary, { 'font-bold': bmiData.category === 'Normal' }]">Normal</span>
                    </div>
                    <div class="flex flex-col items-center">
                      <div class="w-4 h-4 rounded-full bg-yellow-400 mb-2" :class="{ 'ring-2 ring-offset-2 ring-yellow-400': bmiData.category === 'Overweight' }"></div>
                      <span :class="[themeClasses.textSecondary, { 'font-bold': bmiData.category === 'Overweight' }]">Overweight</span>
                    </div>
                    <div class="flex flex-col items-center">
                      <div class="w-4 h-4 rounded-full bg-orange-500 mb-2" :class="{ 'ring-2 ring-offset-2 ring-orange-500': bmiData.category === 'Obese' }"></div>
                      <span :class="[themeClasses.textSecondary, { 'font-bold': bmiData.category === 'Obese' }]">Obese</span>
                    </div>
                  </div>

                  <!-- Data Analysis Section -->
                  <div class="border-t pt-6" :class="themeClasses.border">
                    <h4 class="text-lg font-semibold mb-6" :class="themeClasses.textPrimary">Data Analysis</h4>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center pb-4 border-b" :class="themeClasses.border">
                        <span :class="themeClasses.textSecondary">Age</span>
                        <span class="text-lg font-semibold" :class="themeClasses.textPrimary">{{ bmiData.age || '--' }}</span>
                      </div>
                      <div class="flex justify-between items-center pb-4 border-b" :class="themeClasses.border">
                        <span :class="themeClasses.textSecondary">Height (cm)</span>
                        <span class="text-lg font-semibold" :class="themeClasses.textPrimary">{{ bmiData.height || '--' }}</span>
                      </div>
                      <div class="flex justify-between items-center pb-4 border-b" :class="themeClasses.border">
                        <span :class="themeClasses.textSecondary">Weight (kg)</span>
                        <span class="text-lg font-semibold" :class="themeClasses.textPrimary">{{ bmiData.weight || '--' }}</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span :class="themeClasses.textSecondary">BMI Range (kg/m²)</span>
                        <span class="text-lg font-semibold" :class="themeClasses.textPrimary">18.5 - 24.9</span>
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
                  <h1 class="text-3xl font-bold" :class="themeClasses.textPrimary">Heart Rate</h1>
                </div>
              </div>

              <!-- Date Picker -->
              <div class="flex justify-center gap-4 mb-4 items-center">
                <button @click="previousDate" class="px-4 py-2 rounded-lg transition-colors"
                  :class="isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'">
                  <svg class="w-6 h-6" :class="isDarkMode ? 'text-white' : 'text-gray-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <input type="date" v-model="selectedDate" @change="onDateChange" class="px-4 py-2 rounded-lg border date-picker-input"
                  :class="[themeClasses.cardBackground, themeClasses.border, isDarkMode ? 'text-white dark-date-picker' : 'text-gray-800']" />
                <button @click="nextDate" class="px-4 py-2 rounded-lg transition-colors"
                  :class="isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'">
                  <svg class="w-6 h-6" :class="isDarkMode ? 'text-white' : 'text-gray-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>

              <!-- Main Heart Rate Stats -->
              <div class="text-center mb-6">
                <div class="text-6xl font-bold mb-1" :class="themeClasses.textPrimary">{{ stats.avg }}</div>
                <div class="text-lg mb-4" :class="themeClasses.textSecondary">Average bpm</div>
              </div>
            </div>

            <!-- Heart Rate Chart -->
            <div class="mb-8">
              <div class="rounded-lg shadow-sm pb-4 pl-4 pr-4 border" :class="[themeClasses.cardBackground, themeClasses.border]">
                <div class="relative" style="height: 500px;">
                  <Line v-if="chartData" :data="chartData" :options="chartOptions" />
                  <div v-else class="h-full flex items-center justify-center"
                    :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-50'">
                    <span :class="themeClasses.textSecondary">Loading data or no data...</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Today Overview Section -->
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
                  <h3 class="text-xl font-semibold" :class="themeClasses.textPrimary">Today Overview</h3>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center p-3">
                    <div class="text-4xl font-bold mb-2" :class="themeClasses.textPrimary">{{ stats.resting }}</div>
                    <div class="text-sm" :class="themeClasses.textSecondary">Resting Heart Rate</div>
                  </div>
                  <div class="text-center p-3">
                    <div class="text-4xl font-bold mb-2" :class="themeClasses.textPrimary">{{ stats.max }}</div>
                    <div class="text-sm" :class="themeClasses.textSecondary">Max Heart Rate</div>
                  </div>
                  <div class="text-center p-3">
                    <div class="text-4xl font-bold mb-2" :class="themeClasses.textPrimary">{{ stats.min }}</div>
                    <div class="text-sm" :class="themeClasses.textSecondary">Min Heart Rate</div>
                  </div>
                  <div class="text-center p-3">
                    <div class="text-4xl font-bold mb-2" :class="themeClasses.textPrimary">{{ stats.avg }}</div>
                    <div class="text-sm" :class="themeClasses.textSecondary">Average Heart Rate</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Log Heart Rate Card -->
              <router-link to="/addData" class="block transform transition-transform duration-200 hover:scale-105">
                <div class="rounded-lg shadow-sm p-6 border cursor-pointer hover:shadow-md transition-shadow"
                  :class="[themeClasses.cardBackground, themeClasses.border, 'hover:border-blue-300']">
                  <div class="flex items-center mb-4">
                    <div class="p-3 rounded-full mr-4" :class="isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'">
                      <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-base font-semibold" :class="themeClasses.textPrimary">Log Heart Rate</h3>
                      <p class="text-xs" :class="themeClasses.textSecondary">Quick Add</p>
                    </div>
                  </div>
                  <p class="text-sm mb-4 leading-relaxed" :class="themeClasses.textSecondary">
                    Record your heart rate data immediately to help us better track your health status.
                  </p>
                  <div class="flex items-center text-blue-600 text-xs font-medium">
                    <span>Add Record</span>
                    <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </router-link>

              <!-- Get Advice Card -->
              <router-link to="/ai-support" class="block transform transition-transform duration-200 hover:scale-105">
                <div class="rounded-lg shadow-sm p-6 border cursor-pointer hover:shadow-md transition-shadow"
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
                      <h3 class="text-base font-semibold" :class="themeClasses.textPrimary">AI Advice</h3>
                      <p class="text-xs" :class="themeClasses.textSecondary">24/7 Available</p>
                    </div>
                  </div>
                  <p class="text-sm mb-4 leading-relaxed" :class="themeClasses.textSecondary">
                    Get personalized health advice powered by AI, based on your heart rate data and health trends.
                  </p>
                  <div class="flex items-center text-purple-600 text-xs font-medium">
                    <span>Get Advice</span>
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
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line } from 'vue-chartjs'
import { getLatestBMIRecord } from '../services/bmiService'
import { getHeartRateRecords, getHeartRateDates } from '../services/heartRateService'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const { isDarkMode, themeClasses } = useTheme()

// State
const sidebarHidden = ref(false)
const heartRateData = ref([])
const chartData = ref(null)
const selectedDate = ref('')
const currentDate = ref('')
const availableDates = ref([])
const stats = ref({ min: 0, max: 0, avg: 0, resting: 0 })
const bmiData = ref({ bmi: null, category: '', height: null, weight: null, age: null })
const isBMILoading = ref(false)
const isHeartRateLoading = ref(false)
const hasHeartRateData = ref(false)

const loadBMIData = async () => {
  isBMILoading.value = true
  try {
    const { success, data } = await getLatestBMIRecord()
    bmiData.value = success && data ? {
      bmi: data.bmi,
      category: data.category,
      height: data.height,
      weight: data.weight,
      age: data.age || null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    } : { bmi: null, category: '', height: null, weight: null, age: null }
  } catch (error) {
    console.error('Failed to load BMI data:', error)
    bmiData.value = { bmi: null, category: '', height: null, weight: null, age: null }
  } finally {
    isBMILoading.value = false
  }
}

const bmiCategoryStyle = computed(() => {
  const styles = { Underweight: 'bg-blue-500', Normal: 'bg-green-500', Overweight: 'bg-yellow-500', Obese: 'bg-orange-500' }
  return styles[bmiData.value.category] || 'bg-gray-500'
})

const bmiSliderPosition = computed(() => {
  const bmi = parseFloat(bmiData.value.bmi)
  if (!bmi) return 50
  return Math.max(0, Math.min(100, ((bmi - 15) / 20) * 100))
})

const updateSidebarState = (state) => sidebarHidden.value = state

// Format date for display
const formatDateForDisplay = (dateString) => {
  const date = new Date(dateString)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

// Load available dates from backend
const loadAvailableDates = async () => {
  try {
    const response = await getHeartRateDates()
    console.log('Available dates response:', response)
    
    if (response.success && response.data.dates && response.data.dates.length > 0) {
      availableDates.value = response.data.dates
      hasHeartRateData.value = true
      // Set the most recent date as default
      selectedDate.value = response.data.dates[0]
      currentDate.value = formatDateForDisplay(response.data.dates[0])
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
      
      // Set stats from daily stats
      const dailyStats = record.dailyStats
      stats.value = {
        min: dailyStats.min,
        max: dailyStats.max,
        avg: dailyStats.avg,
        resting: Math.round(dailyStats.min * 0.95),
        count: dailyStats.count
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
      label: 'Heart Rate (bpm)',
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
        label: (ctx) => ctx.parsed.y ? `${ctx.parsed.y} bpm` : 'No data'
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
  // Re-render chart when theme changes
  if (heartRateData.value && heartRateData.value.length > 0) {
    updateChartFromAggregated(heartRateData.value)
  }
})

watch(selectedDate, () => {
  if (selectedDate.value) {
    currentDate.value = formatDateForDisplay(selectedDate.value)
    loadHeartRateData()
  }
})

const onDateChange = () => {
  if (selectedDate.value) {
    currentDate.value = formatDateForDisplay(selectedDate.value)
    loadHeartRateData()
  }
}

const changeDate = (days) => {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() + days)
  selectedDate.value = date.toISOString().split('T')[0]
}

const previousDate = () => changeDate(-1)
const nextDate = () => changeDate(1)

const initHeartRateData = async () => {
  const hasData = await loadAvailableDates()
  if (hasData) {
    await loadHeartRateData()
  }
}

onMounted(() => {
  initHeartRateData()
  loadBMIData()
  window.addEventListener('bmiDataUpdated', loadBMIData)
  window.addEventListener('heartRateDataUpdated', initHeartRateData)
})

onUnmounted(() => {
  window.removeEventListener('bmiDataUpdated', loadBMIData)
  window.removeEventListener('heartRateDataUpdated', initHeartRateData)
})
</script>

<style scoped>
/* Make date picker calendar icon visible in dark mode */
.dark-date-picker::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>