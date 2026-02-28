<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <main class="px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
      <div class="py-6">
        <div class="mb-6">
          <h1 class="text-2xl font-bold mb-2" :class="themeClasses.textPrimary">{{ $t('booking.adminTitle') }}</h1>
          <p :class="themeClasses.textSecondary">{{ $t('booking.adminDesc') }}</p>
        </div>

        <!-- ── Availability Calendar ─────────────────────────────────── -->
        <div class="mb-8 rounded-lg shadow-md border overflow-hidden" :class="[themeClasses.cardBackground, themeClasses.border]">
          <!-- Header -->
          <div class="flex items-center gap-3 p-4 border-b" :class="themeClasses.border">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" :class="themeClasses.textSecondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div class="flex-1 min-w-0">
              <h2 class="text-base font-semibold" :class="themeClasses.textPrimary">{{ $t('booking.availabilityCalendar') }}</h2>
              <p class="text-xs" :class="themeClasses.textSecondary">{{ $t('booking.availabilityDesc') }}</p>
            </div>
            <!-- Refresh button -->
            <button
              @click="refreshAvailability"
              :disabled="isRefreshingCal"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
              :class="[
                isRefreshingCal
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:shadow-sm',
                themeClasses.inputBackground, themeClasses.border, themeClasses.textPrimary
              ]"
              :title="$t('common.refresh')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5 transition-transform duration-500"
                :class="isRefreshingCal ? 'animate-spin' : ''"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="hidden sm:inline">{{ isRefreshingCal ? $t('common.loading') : $t('common.refresh') }}</span>
            </button>
          </div>

          <div class="p-4">
            <div class="flex flex-col lg:flex-row gap-6">

              <!-- ── Monthly Calendar ─── -->
              <div class="flex-shrink-0 w-full lg:w-72">
                <!-- Month nav -->
                <div class="flex items-center justify-between mb-3">
                  <button
                    @click="calPrevMonth"
                    class="p-1.5 rounded-lg border transition-colors"
                    :class="[themeClasses.inputBackground, themeClasses.border, themeClasses.hoverBackground, themeClasses.textPrimary]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span class="font-semibold text-sm" :class="themeClasses.textPrimary">{{ calendarTitle }}</span>
                  <button
                    @click="calNextMonth"
                    class="p-1.5 rounded-lg border transition-colors"
                    :class="[themeClasses.inputBackground, themeClasses.border, themeClasses.hoverBackground, themeClasses.textPrimary]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <!-- Day headers -->
                <div class="grid grid-cols-7 mb-1">
                  <div
                    v-for="h in CAL_DAY_HEADERS"
                    :key="h"
                    class="text-center text-xs font-medium py-1"
                    :class="themeClasses.textSecondary"
                  >{{ h }}</div>
                </div>

                <!-- Calendar cells -->
                <div class="grid grid-cols-7 gap-0.5">
                  <div v-for="(cell, idx) in calendarCells" :key="idx">
                    <!-- empty leading cell -->
                    <div v-if="cell === null" class="aspect-square" />
                    <!-- date cell -->
                    <button
                      v-else
                      @click="selectCalDate(cell)"
                      class="relative aspect-square w-full flex items-center justify-center rounded-lg text-xs font-medium transition-all"
                      :class="[
                        calIsSelected(cell)
                          ? 'bg-blue-600 text-white shadow-md'
                          : calIsToday(cell)
                            ? ['ring-2 ring-blue-500 ring-inset', themeClasses.textPrimary, themeClasses.inputBackground]
                            : calIsPast(cell)
                              ? ['opacity-40 cursor-not-allowed', themeClasses.textSecondary]
                              : [themeClasses.hoverBackground, themeClasses.textPrimary]
                      ]"
                      :disabled="calIsPast(cell)"
                    >
                      {{ cell }}
                      <!-- green dot: has slots -->
                      <span
                        v-if="calHasSlots(cell)"
                        class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                        :class="calIsSelected(cell) ? 'bg-white' : 'bg-green-500'"
                      />
                    </button>
                  </div>
                </div>

                <!-- Legend -->
                <div class="mt-3 flex items-center gap-4 text-xs flex-wrap" :class="themeClasses.textSecondary">
                  <span class="flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-green-500 inline-block" /> {{ $t('booking.hasSlots') }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-blue-600 inline-block" /> {{ $t('booking.selectedDate') }}
                  </span>
                </div>
              </div>

              <!-- ── Time Slot Panel ─── -->
              <div class="flex-1 min-w-0">
                <template v-if="selectedCalDate">
                  <div class="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <h3 class="font-semibold text-sm" :class="themeClasses.textPrimary">
                      {{ $t('booking.date') }}: <span class="text-blue-500">{{ selectedCalDate }}</span>
                    </h3>
                    <button
                      @click="calToggleAll"
                      class="text-xs px-3 py-1 rounded-lg border transition-colors"
                      :class="[themeClasses.inputBackground, themeClasses.border, themeClasses.hoverBackground, themeClasses.textPrimary]"
                    >
                      {{ $t('booking.toggleAll') }}
                    </button>
                  </div>

                  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    <button
                      v-for="slot in CAL_TIME_SLOTS"
                      :key="slot"
                      @click="calToggleSlot(slot)"
                      class="py-2 rounded-lg text-xs font-medium border transition-all"
                      :class="calIsSlotActive(slot)
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : [themeClasses.inputBackground, themeClasses.border, themeClasses.textPrimary, themeClasses.hoverBackground]
                      "
                    >
                      {{ slot }}
                    </button>
                  </div>

                  <!-- Save -->
                  <div class="mt-4 flex items-center gap-3 flex-wrap">
                    <button
                      @click="calSaveSlots"
                      :disabled="isSavingSlots"
                      class="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm rounded-lg transition-colors shadow-sm font-medium"
                    >
                      {{ isSavingSlots ? ($t('common.loading')) : $t('booking.saveSlots') }}
                    </button>
                    <span
                      v-if="slotSaveMsg === 'saved'"
                      class="text-xs text-green-500 font-medium"
                    >{{ $t('booking.slotsSaved') }}</span>
                    <span
                      v-else-if="slotSaveMsg === 'error'"
                      class="text-xs text-red-500 font-medium"
                    >{{ $t('booking.slotsSaveFailed') }}</span>
                  </div>
                </template>

                <!-- No date selected -->
                <div v-else class="h-full flex items-center justify-center py-12">
                  <div class="text-center" :class="themeClasses.textSecondary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="text-sm">{{ $t('booking.noDateSelected') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- ── End Availability Calendar ──────────────────────────────── -->

        <div class="flex flex-col sm:flex-row justify-end gap-2 flex-wrap mb-4">
          <button 
            @click="toggleSort('date')"
            class="w-full sm:w-auto px-3 py-2 rounded-lg border flex items-center justify-center gap-1 transition-colors flex-shrink-0"
            :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border, themeClasses.hoverBackground]"
            :title="$t('common.sort') || 'Sort by Date'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span v-if="sortKey === 'date' && sortOrder === 'asc'">↑</span>
            <span v-else-if="sortKey === 'date'">↓</span>
          </button>
          <select 
            v-model="serviceFilter"
            class="w-full sm:w-auto px-2 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-colors flex-shrink-0"
            :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]"
          >
            <option value="">{{ $t('booking.allServices') || 'All Services' }}</option>
            <option value="GeneralCheckup">{{ $t('booking.generalCheckup') }}</option>
            <option value="Health Status Checkup">{{ $t('booking.healthStatusCheckup') }}</option>
            <option value="Health Consultation">{{ $t('booking.healthConsultation') }}</option>
            <option value="therapy">{{ $t('booking.therapy') }}</option>
          </select>
          <select 
            v-model="statusFilter"
            class="w-full sm:w-auto px-2 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-colors flex-shrink-0"
            :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]"
          >
            <option value="">{{ $t('booking.allStatus') || 'All Status' }}</option>
            <option value="pending">{{ $t('booking.pending') }}</option>
            <option value="confirmed">{{ $t('booking.confirmed') }}</option>
            <option value="completed">{{ $t('booking.completed') }}</option>
            <option value="rejected">{{ $t('booking.rejected') }}</option>
            <option value="cancelled">{{ $t('booking.cancelled') }}</option>
          </select>
          <input 
            type="text" 
            v-model="searchQuery" 
            :placeholder="$t('common.search') || 'Search...'" 
            class="w-full sm:w-64 md:w-80 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]"
          />
        </div>

        <div class="rounded-lg shadow-md border overflow-hidden" :class="[themeClasses.cardBackground, themeClasses.border]">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b" :class="[themeClasses.border, themeClasses.background]">
                  <th class="p-4 font-semibold whitespace-nowrap" :class="themeClasses.textPrimary">
                    <div class="flex items-center gap-1">
                      {{ $t('booking.patient') }}
                    </div>
                  </th>
                  <th class="p-4 font-semibold whitespace-nowrap" :class="themeClasses.textPrimary">
                    <div class="flex items-center gap-1">
                      {{ $t('booking.service') }}
                    </div>
                  </th>
                  <th class="p-4 font-semibold whitespace-nowrap" :class="themeClasses.textPrimary">
                    <div class="flex items-center gap-1">
                      {{ $t('booking.date') }} & {{ $t('booking.time') }}
                    </div>
                  </th>
                  <th class="p-4 font-semibold whitespace-nowrap" :class="themeClasses.textPrimary">{{ $t('booking.notes') }}</th>
                  <th class="p-4 font-semibold whitespace-nowrap" :class="themeClasses.textPrimary">
                    <div class="flex items-center gap-1">
                      {{ $t('booking.status') }}
                    </div>
                  </th>
                  <th class="p-4 font-semibold text-right whitespace-nowrap" :class="themeClasses.textPrimary">{{ $t('booking.action') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading">
                  <td colspan="6" class="p-8 text-center" :class="themeClasses.textSecondary">
                    {{ $t('common.loading') || 'Loading...' }}
                  </td>
                </tr>
                <tr v-else-if="bookings.length === 0">
                  <td colspan="6" class="p-8 text-center" :class="themeClasses.textSecondary">
                    {{ $t('common.noResults') }}
                  </td>
                </tr>
                <tr v-for="booking in paginatedBookings" :key="booking._id || booking.id" class="border-b last:border-0 hover:bg-opacity-50" :class="[themeClasses.border, themeClasses.hoverBackground]">
                  <td class="p-4">
                    <div class="font-medium" :class="themeClasses.textPrimary">{{ booking.name || booking.patientName }}</div>
                    <div class="text-sm" :class="themeClasses.textSecondary">{{ booking.email || booking.patientEmail }}</div>
                  </td>
                  <td class="p-4" :class="themeClasses.textPrimary">
                    {{ $t(`booking.${getServiceKey(booking.service)}`) }}
                  </td>
                  <td class="p-4 whitespace-nowrap">
                    <div :class="themeClasses.textPrimary">{{ booking.date }}</div>
                    <div class="text-sm" :class="themeClasses.textSecondary">{{ booking.time }}</div>
                  </td>
                  <td class="p-4">
                    <div class="text-sm max-w-[150px] whitespace-normal break-words" :class="themeClasses.textSecondary" :title="booking.notes">
                      {{ booking.notes || '-' }}
                    </div>
                  </td>
                  <td class="p-4">
                    <span :class="getStatusClass(booking.status)" class="inline-block w-24 text-center px-3 py-1 rounded-full text-xs font-medium">
                      {{ $t(`booking.${booking.status}`) }}
                    </span>
                  </td>
                  <td class="p-2">
                    <div class="flex flex-col sm:flex-row flex-wrap justify-end gap-2 items-center">
                      <button 
                        v-if="booking.status === 'pending'"
                        @click="updateStatus(booking._id || booking.id, 'confirmed')"
                        class="w-full sm:w-22 text-center px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors shadow-sm whitespace-nowrap"
                      >
                        {{ $t('booking.approve') }}
                      </button>
                      <button 
                        v-if="booking.status === 'pending'"
                        @click="updateStatus(booking._id || booking.id, 'rejected')"
                        class="w-full sm:w-22 text-center px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors shadow-sm whitespace-nowrap"
                      >
                        {{ $t('booking.reject') }}
                      </button>
                      <button 
                        v-if="booking.status === 'confirmed'"
                        @click="updateStatus(booking._id || booking.id, 'completed')"
                        class="w-full sm:w-22 text-center px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors shadow-sm whitespace-nowrap"
                      >
                        {{ $t('booking.complete') || 'Complete' }}
                      </button>
                      <button 
                        @click="deleteBookingRecord(booking._id || booking.id)"
                        class="w-full sm:w-22 text-center px-2 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-sm rounded transition-colors duration-200 whitespace-nowrap"
                      >
                        {{ $t('booking.delete') || 'Delete' }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination Controls -->
          <div v-if="totalPages > 1" class="flex justify-center items-center space-x-4 p-4 border-t" :class="themeClasses.border">
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded border disabled:opacity-50 transition-colors duration-200"
              :class="[themeClasses.border, themeClasses.textPrimary, themeClasses.hoverBackground]"
            >
              {{ $t('common.prev') || 'Prev' }}
            </button>
            <span class="text-sm" :class="themeClasses.textSecondary">
              {{ currentPage }} / {{ totalPages }}
            </span>
            <button 
              @click="currentPage++" 
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded border disabled:opacity-50 transition-colors duration-200"
              :class="[themeClasses.border, themeClasses.textPrimary, themeClasses.hoverBackground]"
            >
              {{ $t('common.next') || 'Next' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { useI18n } from 'vue-i18n'
import { fetchBookings, updateBooking, deleteBooking, fetchTimeSlots, updateTimeSlots } from '../../services/bookingService'
import { sendAdminChatMessage, fetchCurrentUserProfile } from '../../services/userChatService'

const { themeClasses } = useTheme()
const { t } = useI18n()

const adminId = ref(null)

const loadProfile = async () => {
  try {
    const profile = await fetchCurrentUserProfile()
    const userData = profile?.data?.user || profile?.data || profile?.user || profile
    adminId.value = userData?.id || userData?._id || null
  } catch (error) {
    console.error('Failed to load admin profile:', error)
  }
}

const getServiceKey = (service) => {
  if (!service) return ''
  const map = {
    'GeneralCheckup': 'generalCheckup',
    'Health Status Checkup': 'healthStatusCheckup',
    'Health Consultation': 'healthConsultation',
    'therapy': 'therapy'
  }
  return map[service] || service
}

const bookings = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const currentPage = ref(1)
const itemsPerPage = 10

const _adminSort = (() => {
  try { return JSON.parse(localStorage.getItem('adminBookingSort') || '{}') } catch { return {} }
})()

const searchQuery   = ref('')
const sortKey       = ref(_adminSort.sortKey     || 'date')
const sortOrder     = ref(_adminSort.sortOrder   || 'desc')
const serviceFilter = ref(_adminSort.serviceFilter || '')
const statusFilter  = ref(_adminSort.statusFilter  || '')

const toggleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

watch([searchQuery, sortKey, sortOrder, serviceFilter, statusFilter], () => {
  currentPage.value = 1
})

watch([sortKey, sortOrder, serviceFilter, statusFilter], () => {
  localStorage.setItem('adminBookingSort', JSON.stringify({
    sortKey: sortKey.value,
    sortOrder: sortOrder.value,
    serviceFilter: serviceFilter.value,
    statusFilter: statusFilter.value
  }))
})

const filteredBookings = computed(() => {
  let result = bookings.value

  if (serviceFilter.value) {
    result = result.filter(b => b.service === serviceFilter.value)
  }

  if (statusFilter.value) {
    result = result.filter(b => b.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(b => {
      const name = (b.name || b.patientName || '').toLowerCase()
      const email = (b.email || b.patientEmail || '').toLowerCase()
      const service = (t(`booking.${getServiceKey(b.service)}`) || '').toLowerCase()
      const status = (t(`booking.${b.status}`) || '').toLowerCase()
      return name.includes(query) || email.includes(query) || service.includes(query) || status.includes(query)
    })
  }

  const statusPriority = (s) => s === 'pending' ? 0 : s === 'confirmed' ? 1 : 2

  return result.slice().sort((a, b) => {
    // Active statuses always float to top unless user is explicitly sorting by status
    if (sortKey.value !== 'status') {
      const pd = statusPriority(a.status) - statusPriority(b.status)
      if (pd !== 0) return pd
    }

    let valA, valB
    if (sortKey.value === 'name') {
      valA = (a.name || a.patientName || '').toLowerCase()
      valB = (b.name || b.patientName || '').toLowerCase()
    } else if (sortKey.value === 'date') {
      valA = new Date(`${a.date}T${a.time || '00:00'}`).getTime()
      valB = new Date(`${b.date}T${b.time || '00:00'}`).getTime()
    } else if (sortKey.value === 'service') {
      valA = (t(`booking.${getServiceKey(a.service)}`) || '').toLowerCase()
      valB = (t(`booking.${getServiceKey(b.service)}`) || '').toLowerCase()
    } else if (sortKey.value === 'status') {
      valA = statusPriority(a.status)
      valB = statusPriority(b.status)
      return sortOrder.value === 'asc' ? valA - valB : valB - valA
    }

    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

const totalPages = computed(() => Math.ceil(filteredBookings.value.length / itemsPerPage))

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredBookings.value.slice(start, end)
})

const loadBookings = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const res = await fetchBookings()
    if (res?.success) {
      bookings.value = res.bookings || []
    } else {
      errorMessage.value = res?.message || 'Failed to load bookings'
    }
  } catch (error) {
    console.error('Error loading bookings:', error)
    errorMessage.value = error.message || 'Failed to load bookings'
  } finally {
    isLoading.value = false
  }
}

// ── Availability Calendar ──────────────────────────────────────────────────
const CAL_TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', "18:00", "18:30", "19:00"
]
const CAL_DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calYear  = ref(new Date().getFullYear())
const calMonth = ref(new Date().getMonth()) // 0-indexed
const selectedCalDate = ref(null)           // 'YYYY-MM-DD'
const availability    = ref({})             // { 'YYYY-MM-DD': ['08:00', ...] }
const isSavingSlots      = ref(false)
const slotSaveMsg        = ref('')             // '' | 'saved' | 'error'
const isRefreshingCal    = ref(false)

const calendarTitle = computed(() =>
  new Date(calYear.value, calMonth.value, 1)
    .toLocaleString('default', { month: 'long', year: 'numeric' })
)

const calendarCells = computed(() => {
  const firstDay    = new Date(calYear.value, calMonth.value, 1).getDay()
  const daysInMonth = new Date(calYear.value, calMonth.value + 1, 0).getDate()
  const cells = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
})

const calDateKey = (day) => {
  const mm = String(calMonth.value + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${calYear.value}-${mm}-${dd}`
}

const calIsSelected = (day) => selectedCalDate.value === calDateKey(day)
const calHasSlots   = (day) => (availability.value[calDateKey(day)] || []).length > 0
const calIsToday    = (day) => {
  const now = new Date()
  return day === now.getDate() && calMonth.value === now.getMonth() && calYear.value === now.getFullYear()
}
const calIsPast     = (day) => {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return new Date(calYear.value, calMonth.value, day) < today
}

const calPrevMonth = () => {
  if (calMonth.value === 0) { calMonth.value = 11; calYear.value-- }
  else calMonth.value--
}
const calNextMonth = () => {
  if (calMonth.value === 11) { calMonth.value = 0; calYear.value++ }
  else calMonth.value++
}

const selectCalDate = (day) => {
  if (!day || calIsPast(day)) return
  selectedCalDate.value = calDateKey(day)
  slotSaveMsg.value = ''
}

const calIsSlotActive = (slot) =>
  (availability.value[selectedCalDate.value] || []).includes(slot)

const calToggleSlot = (slot) => {
  if (!selectedCalDate.value) return
  const key     = selectedCalDate.value
  const current = [...(availability.value[key] || [])]
  const idx     = current.indexOf(slot)
  if (idx >= 0) current.splice(idx, 1)
  else current.push(slot)
  current.sort()
  availability.value = { ...availability.value, [key]: current }
}

const calToggleAll = () => {
  if (!selectedCalDate.value) return
  const key     = selectedCalDate.value
  const current = availability.value[key] || []
  availability.value = {
    ...availability.value,
    [key]: current.length === CAL_TIME_SLOTS.length ? [] : [...CAL_TIME_SLOTS]
  }
}

const calSaveSlots = async () => {
  isSavingSlots.value = true
  slotSaveMsg.value   = ''
  try {
    const slots = []
    for (const [date, times] of Object.entries(availability.value)) {
      for (const time of times) slots.push({ date, time })
    }
    const res = await updateTimeSlots(slots)
    slotSaveMsg.value = res?.success === false ? 'error' : 'saved'
  } catch (e) {
    console.error('Failed to save slots:', e)
    slotSaveMsg.value = 'error'
  } finally {
    isSavingSlots.value = false
    setTimeout(() => { slotSaveMsg.value = '' }, 3500)
  }
}

const loadAvailability = async () => {
  if (!adminId.value) return
  try {
    const res   = await fetchTimeSlots(adminId.value)
    const slots = res?.slots || res?.data?.slots || []
    const map   = {}
    for (const s of slots) {
      if (!map[s.date]) map[s.date] = []
      map[s.date].push(s.time)
    }
    availability.value = map
  } catch (e) {
    console.error('Failed to load time slots:', e)
  }
}

const refreshAvailability = async () => {
  isRefreshingCal.value = true
  await loadAvailability()
  isRefreshingCal.value = false
}
// ── End Availability Calendar ───────────────────────────────────────────────

onMounted(async () => {
  await loadProfile()
  loadAvailability()
  loadBookings()
})

const getStatusClass = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

const updateStatus = async (id, newStatus) => {
  let rejectReason = ''
  if (newStatus === 'rejected') {
    rejectReason = prompt(t('booking.rejectReasonPrompt') || 'Please fill the reject reason:')
    if (rejectReason === null) return // User cancelled the prompt
  }

  try {
    const res = await updateBooking(id, { status: newStatus })
    if (res?.success) {
      const booking = bookings.value.find(b => b._id === id || b.id === id)
      if (booking) {
        booking.status = newStatus
        
        // Send chat message
        const userId = booking.userId || booking.patientId || booking.patientID
        if (userId) {
          let messageText = ''
          const serviceName = t(`booking.${getServiceKey(booking.service)}`)
          const bookingDate = booking.date
          const bookingTime = booking.time

          if (newStatus === 'confirmed') {
            messageText = t('booking.approveMessage', { service: serviceName, date: bookingDate, time: bookingTime })
          } else if (newStatus === 'rejected') {
            messageText = `${t('booking.rejectMessage', { service: serviceName, date: bookingDate, time: bookingTime })} ${rejectReason}`
          }
          
          if (messageText) {
            try {
              await sendAdminChatMessage(userId, messageText, adminId.value)
            } catch (chatError) {
              console.error('Failed to send chat message:', chatError)
            }
          }
        }
      }
    } else {
      alert(res?.message || 'Failed to update status')
    }
  } catch (error) {
    console.error('Error updating status:', error)
    alert(error.message || 'Failed to update status')
  }
}

const deleteBookingRecord = async (id) => {
  if (!confirm(t('booking.confirmDelete') || 'Are you sure you want to delete this appointment?')) return
  
  try {
    const res = await deleteBooking(id)
    if (res?.success) {
      bookings.value = bookings.value.filter(b => b._id !== id && b.id !== id)
    } else {
      alert(res?.message || 'Failed to delete appointment')
    }
  } catch (error) {
    console.error('Error deleting booking:', error)
    alert(error.message || 'Failed to delete appointment')
  }
}
</script>