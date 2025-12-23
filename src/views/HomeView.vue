<template>
  <div :class="themeClasses.background">
    <div class="min-h-full" :class="themeClasses.background">
      <Sidebar @update:sidebarState="updateSidebarState" />
      <div :class="[
        'transition-all duration-300 ease-in-out pt-16',
        sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
      ]">
        <main>
          <div class="px-3 sm:px-4 md:px-6 lg:px-6 pb-4">

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
          </div>
        </main>
      </div>
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const sidebarHidden = ref(false)
const { isDarkMode, themeClasses } = useTheme()
const heartRateData = ref([])
const chartData = ref(null)
const selectedDate = ref('') // Selected date in YYYY-MM-DD format
const currentDate = ref('')
const stats = ref({
  min: 0,
  max: 0,
  avg: 0,
  resting: 0,
})

// BMI Data from API
const bmiData = ref({
  bmi: null,
  category: '',
  height: null,
  weight: null,
  age: null
})
const isBMILoading = ref(false)

// Load BMI data from API
const loadBMIData = async () => {
  isBMILoading.value = true
  try {
    const response = await getLatestBMIRecord()
    
    if (response.success && response.data) {
      bmiData.value = {
        bmi: response.data.bmi,
        category: response.data.category,
        height: response.data.height,
        weight: response.data.weight,
        age: response.data.age || null,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt
      }
    } else {
      // No BMI data found
      bmiData.value = {
        bmi: null,
        category: '',
        height: null,
        weight: null,
        age: null
      }
    }
  } catch (error) {
    console.error('Failed to load BMI data:', error)
    bmiData.value = {
      bmi: null,
      category: '',
      height: null,
      weight: null,
      age: null
    }
  } finally {
    isBMILoading.value = false
  }
}

// BMI Category styling
const bmiCategoryStyle = computed(() => {
  const category = bmiData.value.category
  if (category === 'Underweight') return 'bg-blue-500'
  if (category === 'Normal') return 'bg-green-500'
  if (category === 'Overweight') return 'bg-yellow-500'
  if (category === 'Obese') return 'bg-orange-500'
  return 'bg-gray-500'
})

// BMI slider position (percentage)
const bmiSliderPosition = computed(() => {
  const bmi = parseFloat(bmiData.value.bmi)
  if (!bmi) return 50
  // Map BMI range 15-35 to 0-100%
  const minBMI = 15
  const maxBMI = 35
  const position = ((bmi - minBMI) / (maxBMI - minBMI)) * 100
  return Math.max(0, Math.min(100, position))
})

const updateSidebarState = (state) => {
  sidebarHidden.value = state
}

// Format date from CSV timestamp
const formatDateFromTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

// Parse CSV data
const parseCSVData = async () => {
  try {
    console.log('Loading heart rate data from CSV...')

    const response = await fetch('/heartRate.csv')
    console.log('Fetch response status:', response.status)

    if (!response.ok) {
      console.error('Failed to fetch CSV:', response.statusText)
      return
    }

    const csvText = await response.text()
    console.log('CSV file size:', csvText.length, 'bytes')

    const lines = csvText.split('\n')
    console.log('Total lines:', lines.length)

    const data = []
    let parseCount = 0
    let failCount = 0

    // Parse all lines from CSV
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      try {
        // Find the JSON object in the line
        const startIdx = line.indexOf('{')
        const endIdx = line.lastIndexOf('}')

        if (startIdx !== -1 && endIdx !== -1) {
          let jsonStr = line.substring(startIdx, endIdx + 1)
          // Unescape double quotes
          jsonStr = jsonStr.replace(/""/g, '"')

          const entry = JSON.parse(jsonStr)
          if (entry.time && typeof entry.bpm === 'number') {
            data.push(entry)
            parseCount++
          }
        }
      } catch (e) {
        failCount++
      }
    }

    console.log('Parsed CSV: ', parseCount, 'records, Failed:', failCount)

    if (data.length === 0) {
      console.error('No data parsed from CSV!')
      return
    }

    data.sort((a, b) => a.time - b.time)
    heartRateData.value = data

    console.log('Data loaded successfully')
    console.log('First entry:', heartRateData.value[0])
    console.log('Last entry:', heartRateData.value[heartRateData.value.length - 1])

    // Set date from first data point
    if (data.length > 0) {
      currentDate.value = formatDateFromTimestamp(data[0].time)
      // Initialize selectedDate to first data point date
      const firstDate = new Date(data[0].time * 1000)
      selectedDate.value = firstDate.toISOString().split('T')[0]
    }
    updateChart()
  } catch (error) {
    console.error('Error loading heart rate data:', error)
  }
}

// Filter data for selected date
const getFilteredData = () => {
  if (heartRateData.value.length === 0 || !selectedDate.value) return []

  const selectedDateObj = new Date(selectedDate.value)
  const selectedDateStart = selectedDateObj.getTime() / 1000
  const selectedDateEnd = selectedDateStart + 86400 // 24 hours later

  return heartRateData.value.filter(d => d.time >= selectedDateStart && d.time < selectedDateEnd)
}

// Calculate statistics
const calculateStats = (data) => {
  if (data.length === 0) {
    stats.value = {
      min: 0,
      max: 0,
      avg: 0,
      resting: 0,
      normal: 0,
      elevated: 0,
      high: 0,
      normalDuration: '0h 0m',
      elevatedDuration: '0h 0m',
      highDuration: '0h 0m'
    }
    return
  }

  const bpms = data.map(d => d.bpm)
  const min = Math.min(...bpms)
  const max = Math.max(...bpms)
  const avg = Math.round(bpms.reduce((a, b) => a + b, 0) / bpms.length)

  // Count categories
  let normalCount = 0
  let elevatedCount = 0
  let highCount = 0

  bpms.forEach(bpm => {
    if (bpm <= 100) normalCount++
    else if (bpm <= 120) elevatedCount++
    else highCount++
  })

  const total = bpms.length
  const normalPct = Math.round((normalCount / total) * 100)
  const elevatedPct = Math.round((elevatedCount / total) * 100)
  const highPct = Math.round((highCount / total) * 100)

  // Estimate duration (assuming one measurement per ~5 minutes)
  const measurementInterval = 5 * 60 // 5 minutes in seconds
  const normalMinutes = normalCount * measurementInterval / 60
  const elevatedMinutes = elevatedCount * measurementInterval / 60
  const highMinutes = highCount * measurementInterval / 60

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}h ${mins}m`
  }

  stats.value = {
    min,
    max,
    avg,
    resting: Math.round(min * 0.95), // Estimate resting as ~95% of min
    normal: normalPct,
    elevated: elevatedPct,
    high: highPct,
    normalDuration: formatDuration(normalMinutes),
    elevatedDuration: formatDuration(elevatedMinutes),
    highDuration: formatDuration(highMinutes)
  }
}

// Update chart
const updateChart = () => {
  const filtered = getFilteredData()
  calculateStats(filtered)

  if (filtered.length === 0) {
    console.warn('No filtered data available')
    chartData.value = null
    return
  }

  console.log('Filtered data count:', filtered.length)

  // Group data by hour for 24-hour view (0:00 to 23:00)
  let labels = []
  let dataPoints = []

  const hourlyData = {}

  // Initialize all 24 hours
  for (let h = 0; h < 24; h++) {
    hourlyData[h] = []
  }

  // Group data by hour
  filtered.forEach(d => {
    const date = new Date(d.time * 1000)
    const hour = date.getHours()
    hourlyData[hour].push(d.bpm)
  })

  // Create labels and data points for all 24 hours
  for (let h = 0; h < 24; h++) {
    labels.push(`${h.toString().padStart(2, '0')}:00`)
    if (hourlyData[h].length > 0) {
      const avgBpm = Math.round(hourlyData[h].reduce((a, b) => a + b, 0) / hourlyData[h].length)
      dataPoints.push(avgBpm)
    } else {
      dataPoints.push(null) // Show as gap if no data for that hour
    }
  }

  console.log('Chart labels:', labels.length, 'dataPoints:', dataPoints.length)

  chartData.value = {
    labels,
    datasets: [
      {
        label: 'Heart Rate (bpm)',
        data: dataPoints,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 5
      }
    ]
  }
}

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    legend: {
      display: true,
      labels: {
        color: isDarkMode.value ? '#9ca3af' : '#6b7280',
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: 'bold'
        }
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
      titleFont: {
        size: 14
      },
      bodyFont: {
        size: 14
      },
      callbacks: {
        label: function (context) {
          return context.parsed.y ? `${context.parsed.y} bpm` : 'No data'
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      min: 40,
      max: 140,
      ticks: {
        color: isDarkMode.value ? '#9ca3af' : '#6b7280',
        font: {
          size: 14
        },
        callback: function (value) {
          return value
        }
      },
      grid: {
        color: isDarkMode.value ? '#374151' : '#e5e7eb',
        drawBorder: false
      }
    },
    x: {
      ticks: {
        color: isDarkMode.value ? '#9ca3af' : '#6b7280'
      },
      grid: {
        display: false,
        drawBorder: false
      }
    }
  }
}))

watch(isDarkMode, () => {
  updateChart()
}, { deep: true })

watch(selectedDate, () => {
  updateChart()
  if (selectedDate.value) {
    const date = new Date(selectedDate.value)
    currentDate.value = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
})

const onDateChange = () => {
  updateChart()
  if (selectedDate.value) {
    const date = new Date(selectedDate.value)
    currentDate.value = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
}

const previousDate = () => {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() - 1)
  selectedDate.value = date.toISOString().split('T')[0]
}

const nextDate = () => {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() + 1)
  selectedDate.value = date.toISOString().split('T')[0]
}

// Handler for BMI data updates from other components
const handleBMIUpdate = () => {
  loadBMIData()
}

onMounted(() => {
  parseCSVData()
  loadBMIData()
  
  // Listen for BMI updates from DataSettingView
  window.addEventListener('bmiDataUpdated', handleBMIUpdate)
})

onUnmounted(() => {
  // Clean up event listener
  window.removeEventListener('bmiDataUpdated', handleBMIUpdate)
})
</script>

<style scoped>
/* Make date picker calendar icon visible in dark mode */
.dark-date-picker::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>