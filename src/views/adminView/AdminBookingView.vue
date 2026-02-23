<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <main class="px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
      <div class="py-6">
        <div class="mb-6">
          <h1 class="text-2xl font-bold mb-2" :class="themeClasses.textPrimary">{{ $t('booking.adminTitle') }}</h1>
          <p :class="themeClasses.textSecondary">{{ $t('booking.adminDesc') }}</p>
        </div>

        <!-- Manage Time Slots -->
        <div class="mb-8 p-6 rounded-lg shadow-md border" :class="[themeClasses.cardBackground, themeClasses.border]">
          <h2 class="text-xl font-semibold mb-4" :class="themeClasses.textPrimary">{{ $t('booking.manageTimeSlots') || 'Manage Available Time Slots' }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="day in daysOfWeek" :key="day.value" class="p-4 rounded border" :class="[themeClasses.background, themeClasses.border]">
              <h3 class="font-medium mb-2" :class="themeClasses.textPrimary">{{ $t(`booking.days.${day.value}`) || day.label }}</h3>
              <div class="flex flex-wrap gap-2 mb-3">
                <span v-for="(time, index) in timeSlots[day.value]" :key="index" class="inline-flex items-center px-2 py-1 rounded text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {{ time }}
                  <button @click="removeTimeSlot(day.value, index)" class="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100">&times;</button>
                </span>
              </div>
              <div class="flex gap-2">
                <input type="time" v-model="newTimeSlot[day.value]" class="flex-1 p-1 rounded border text-sm outline-none" :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]" />
                <button @click="addTimeSlot(day.value)" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">+</button>
              </div>
            </div>
          </div>
          <div class="mt-4 flex justify-end">
            <button @click="saveTimeSlots" :disabled="isSavingSlots" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50">
              {{ isSavingSlots ? ($t('common.loading') || 'Saving...') : ($t('common.apply') || 'Save Time Slots') }}
            </button>
          </div>
        </div>

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

const daysOfWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
]

const timeSlots = ref({
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: []
})

const newTimeSlot = ref({
  monday: '',
  tuesday: '',
  wednesday: '',
  thursday: '',
  friday: '',
  saturday: '',
  sunday: ''
})

const isSavingSlots = ref(false)

const addTimeSlot = (day) => {
  const time = newTimeSlot.value[day]
  if (time && !timeSlots.value[day].includes(time)) {
    timeSlots.value[day].push(time)
    timeSlots.value[day].sort()
    newTimeSlot.value[day] = ''
  }
}

const removeTimeSlot = (day, index) => {
  timeSlots.value[day].splice(index, 1)
}

const loadTimeSlots = async () => {
  if (!adminId.value) return
  try {
    const res = await fetchTimeSlots(adminId.value)
    if (res?.success && res.slots) {
      timeSlots.value = { ...timeSlots.value, ...res.slots }
    }
  } catch (error) {
    console.error('Failed to load time slots:', error)
  }
}

const saveTimeSlots = async () => {
  isSavingSlots.value = true
  try {
    const res = await updateTimeSlots(timeSlots.value)
    if (res?.success) {
      alert('Time slots saved successfully')
    } else {
      alert(res?.message || 'Failed to save time slots')
    }
  } catch (error) {
    console.error('Error saving time slots:', error)
    alert(error.message || 'Failed to save time slots')
  } finally {
    isSavingSlots.value = false
  }
}

const loadProfile = async () => {
  try {
    const profile = await fetchCurrentUserProfile()
    const userData = profile?.data?.user || profile?.data || profile?.user || profile
    adminId.value = userData?.id || userData?._id || null
    if (adminId.value) {
      await loadTimeSlots()
    }
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

const searchQuery = ref('')
const sortKey = ref('date')
const sortOrder = ref('desc')
const serviceFilter = ref('')
const statusFilter = ref('')

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
  
  return result.slice().sort((a, b) => {
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
      valA = (t(`booking.${a.status}`) || '').toLowerCase()
      valB = (t(`booking.${b.status}`) || '').toLowerCase()
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

onMounted(() => {
  loadProfile()
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