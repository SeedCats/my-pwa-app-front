<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <main class="px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
      <div class="py-6">
        <div class="flex items-start justify-between gap-3 mb-6">
          <div>
            <h1 class="text-2xl font-bold" :class="themeClasses.textPrimary">{{ $t('admin.overviewTitle') }}</h1>
            <p class="mt-1 text-sm" :class="themeClasses.textSecondary">{{ $t('admin.overviewDesc') }}</p>
          </div>
          <button
            @click="loadDashboardData"
            :disabled="isLoading"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
            :class="[
              isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-sm',
              themeClasses.inputBackground,
              themeClasses.border,
              themeClasses.textPrimary
            ]"
            :title="$t('common.refresh')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3.5 w-3.5 transition-transform duration-500"
              :class="isLoading ? 'animate-spin' : ''"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="hidden sm:inline">{{ isLoading ? $t('common.loading') : $t('common.refresh') }}</span>
          </button>
        </div>

        <!-- ── Patients ── -->
        <p class="text-xs font-semibold uppercase tracking-widest mb-2" :class="themeClasses.textSecondary">{{ $t('admin.totalPatients') }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <!-- Total Patients -->
          <div class="rounded-xl border shadow-sm overflow-hidden flex flex-col" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="h-1 bg-gray-400 dark:bg-gray-500" />
            <div class="p-4 flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-medium" :class="themeClasses.textSecondary">{{ $t('admin.totalPatients') }}</p>
                <p class="text-3xl font-extrabold leading-none mt-0.5" :class="themeClasses.textPrimary">{{ patientSummary.total }}</p>
              </div>
            </div>
          </div>

          <!-- On-going -->
          <div class="rounded-xl border shadow-sm overflow-hidden flex flex-col" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="h-1 bg-amber-400" />
            <div class="p-4 flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-50 dark:bg-amber-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-medium" :class="themeClasses.textSecondary">{{ $t('admin.statusOnGoing') }}</p>
                <p class="text-3xl font-extrabold leading-none mt-0.5 text-amber-500">{{ patientSummary.ongoing }}</p>
              </div>
            </div>
          </div>

          <!-- Completed patients -->
          <div class="rounded-xl border shadow-sm overflow-hidden flex flex-col" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="h-1 bg-green-500" />
            <div class="p-4 flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-50 dark:bg-green-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-medium" :class="themeClasses.textSecondary">{{ $t('admin.statusCompleted') }}</p>
                <p class="text-3xl font-extrabold leading-none mt-0.5 text-green-500">{{ patientSummary.completed }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Bookings ── -->
        <p class="text-xs font-semibold uppercase tracking-widest mb-2" :class="themeClasses.textSecondary">{{ $t('admin.totalBookings') }}</p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <!-- Total bookings -->
          <div class="rounded-xl border shadow-sm overflow-hidden flex flex-col" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="h-1 bg-gray-400 dark:bg-gray-500" />
            <div class="p-4 flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-medium" :class="themeClasses.textSecondary">{{ $t('admin.totalBookings') }}</p>
                <p class="text-3xl font-extrabold leading-none mt-0.5" :class="themeClasses.textPrimary">{{ bookingSummary.total }}</p>
              </div>
            </div>
          </div>

          <!-- Pending -->
          <div class="rounded-xl border shadow-sm overflow-hidden flex flex-col" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="h-1 bg-amber-400" />
            <div class="p-4 flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-50 dark:bg-amber-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-medium" :class="themeClasses.textSecondary">{{ $t('booking.pending') }}</p>
                <p class="text-3xl font-extrabold leading-none mt-0.5 text-amber-500">{{ bookingSummary.pending }}</p>
              </div>
            </div>
          </div>

          <!-- Confirmed -->
          <div class="rounded-xl border shadow-sm overflow-hidden flex flex-col" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="h-1 bg-green-500" />
            <div class="p-4 flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-50 dark:bg-green-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-medium" :class="themeClasses.textSecondary">{{ $t('booking.confirmed') }}</p>
                <p class="text-3xl font-extrabold leading-none mt-0.5 text-green-500">{{ bookingSummary.confirmed }}</p>
              </div>
            </div>
          </div>

          <!-- Completed bookings -->
          <div class="rounded-xl border shadow-sm overflow-hidden flex flex-col" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="h-1 bg-blue-500" />
            <div class="p-4 flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-50 dark:bg-blue-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-medium" :class="themeClasses.textSecondary">{{ $t('booking.completed') }}</p>
                <p class="text-3xl font-extrabold leading-none mt-0.5 text-blue-500">{{ bookingSummary.completed }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
          <div class="rounded-xl border p-4 shadow-sm" :class="[themeClasses.cardBackground, themeClasses.border]">
            <h2 class="text-sm font-semibold mb-3" :class="themeClasses.textPrimary">{{ $t('admin.patientStatusChart') }}</h2>
            <div class="h-72">
              <Doughnut :data="patientChartData" :options="doughnutOptions" />
            </div>
          </div>

          <div class="rounded-xl border p-4 shadow-sm" :class="[themeClasses.cardBackground, themeClasses.border]">
            <h2 class="text-sm font-semibold mb-3" :class="themeClasses.textPrimary">{{ $t('admin.bookingStatusChart') }}</h2>
            <div class="h-72">
              <Bar :data="bookingChartData" :options="barOptions" />
            </div>
          </div>
        </div>

        <p class="text-xs font-semibold uppercase tracking-widest mb-3" :class="themeClasses.textSecondary">Quick Access</p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <router-link to="/admin/users" class="group p-4 rounded-xl border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-start gap-3.5" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-50 dark:bg-blue-900/30 group-hover:scale-110 transition-transform duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="min-w-0">
              <h3 class="font-semibold text-sm" :class="themeClasses.textPrimary">{{ $t('admin.userManagementTitle') }}</h3>
              <p class="text-xs mt-0.5" :class="themeClasses.textSecondary">{{ $t('admin.manageUsersCard') }}</p>
            </div>
            <svg class="w-4 h-4 ml-auto mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" :class="themeClasses.textSecondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
          
          <router-link to="/admin/chats" class="group p-4 rounded-xl border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-start gap-3.5" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-purple-50 dark:bg-purple-900/30 group-hover:scale-110 transition-transform duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div class="min-w-0">
              <h3 class="font-semibold text-sm" :class="themeClasses.textPrimary">{{ $t('admin.patientMessagesTitle') }}</h3>
              <p class="text-xs mt-0.5" :class="themeClasses.textSecondary">{{ $t('admin.patientMessagesDesc') }}</p>
            </div>
            <svg class="w-4 h-4 ml-auto mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" :class="themeClasses.textSecondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>

          <router-link to="/admin/bookings" class="group p-4 rounded-xl border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-start gap-3.5" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-50 dark:bg-green-900/30 group-hover:scale-110 transition-transform duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="min-w-0">
              <h3 class="font-semibold text-sm" :class="themeClasses.textPrimary">{{ $t('booking.adminTitle') }}</h3>
              <p class="text-xs mt-0.5" :class="themeClasses.textSecondary">{{ $t('booking.adminDesc') }}</p>
            </div>
            <svg class="w-4 h-4 ml-auto mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" :class="themeClasses.textSecondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>

        <p v-if="errorMessage" class="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '../../composables/useTheme'
import { fetchBookings } from '../../services/bookingService'
import { fetchWithAuth } from '../../utils/fetchWithAuth'
import { Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const API_URL = import.meta.env.VITE_API_URL || ''
const { t } = useI18n()
const { themeClasses, isDarkMode } = useTheme()

const isLoading = ref(false)
const errorMessage = ref('')
const users = ref([])
const bookings = ref([])

const patientSummary = computed(() => {
  const completed = users.value.filter(u => u.serviceStatusKey === 'completed').length
  const ongoing = users.value.filter(u => u.serviceStatusKey !== 'completed').length
  return {
    total: users.value.length,
    ongoing,
    completed
  }
})

const bookingSummary = computed(() => ({
  total: bookings.value.length,
  pending: bookings.value.filter(b => b.status === 'pending').length,
  confirmed: bookings.value.filter(b => b.status === 'confirmed').length,
  completed: bookings.value.filter(b => b.status === 'completed').length
}))

const patientChartData = computed(() => ({
  labels: [t('admin.statusOnGoing'), t('admin.statusCompleted')],
  datasets: [{
    data: [patientSummary.value.ongoing, patientSummary.value.completed],
    backgroundColor: ['#f59e0b', '#22c55e'],
    borderWidth: 0
  }]
}))

const bookingChartData = computed(() => ({
  labels: [t('booking.pending'), t('booking.confirmed'), t('booking.completed')],
  datasets: [{
    label: t('admin.totalBookings'),
    data: [bookingSummary.value.pending, bookingSummary.value.confirmed, bookingSummary.value.completed],
    backgroundColor: ['#f59e0b', '#22c55e', '#3b82f6'],
    borderRadius: 6,
    maxBarThickness: 46
  }]
}))

const axisColor = computed(() => (isDarkMode.value ? '#d1d5db' : '#4b5563'))
const gridColor = computed(() => (isDarkMode.value ? 'rgba(255,255,255,0.12)' : 'rgba(17,24,39,0.1)'))

const doughnutOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: axisColor.value, boxWidth: 14, boxHeight: 14 }
    }
  }
}))

const barOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      labels: { color: axisColor.value }
    },
    tooltip: {
      callbacks: {
        label: (context) => ` ${context.parsed.y}`
      }
    }
  },
  scales: {
    x: {
      ticks: { color: axisColor.value },
      grid: { color: gridColor.value }
    },
    y: {
      beginAtZero: true,
      ticks: { color: axisColor.value, precision: 0 },
      grid: { color: gridColor.value }
    }
  }
}))

const loadUsers = async () => {
  const res = await fetchWithAuth(`${API_URL}/api/admin/assigned-users?page=1&limit=200`, { credentials: 'include' })
  if (!res.ok) throw new Error(t('admin.failedLoadAssignedUsers'))
  const json = await res.json()
  const data = json.data || json
  const loadedUsers = (data.users || []).map(u => ({ ...u, serviceStatusKey: 'ongoing' }))

  await Promise.all(loadedUsers.map(async (u, idx) => {
    try {
      const statusRes = await fetchWithAuth(`${API_URL}/api/admin/users/${u.id}/status`, { credentials: 'include' })
      if (!statusRes.ok) return
      const statusJson = await statusRes.json().catch(() => null)
      const statusText = statusJson?.data?.status || 'On-going'
      loadedUsers[idx].serviceStatusKey = String(statusText).toLowerCase() === 'completed' ? 'completed' : 'ongoing'
    } catch {
      loadedUsers[idx].serviceStatusKey = 'ongoing'
    }
  }))

  users.value = loadedUsers
}

const loadBookings = async () => {
  const res = await fetchBookings()
  if (res?.success) bookings.value = res.bookings || []
  else throw new Error(res?.message || t('booking.adminDesc'))
}

const loadDashboardData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    await Promise.all([loadUsers(), loadBookings()])
  } catch (error) {
    errorMessage.value = error?.message || t('admin.failedLoadAssignedUsers')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>
