<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <main class="px-3 sm:px-4 md:px-6 lg:px-8 pt-4 pb-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold" :class="themeClasses.textPrimary">{{ $t('booking.title') }}</h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Booking Form -->
        <div class="p-6 rounded-lg shadow-md border" :class="[themeClasses.cardBackground, themeClasses.border]">
          <h2 class="text-xl font-semibold mb-6" :class="themeClasses.textPrimary">{{ $t('booking.bookService') }}</h2>
          
          <form @submit.prevent="submitBooking" class="space-y-4">
            <!-- Service Selection -->
            <div>
              <label class="block text-sm font-medium mb-1" :class="themeClasses.textSecondary">{{ $t('booking.service') }}</label>
              <select v-model="form.service" required class="w-full p-2 rounded border focus:ring-2 focus:ring-blue-500 outline-none" :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]">
                <option value="" disabled>{{ $t('booking.selectService') }}</option>
                <option value="GeneralCheckup">{{ $t('booking.generalCheckup') }}</option>
                <option value="Health Status Checkup">{{ $t('booking.healthStatusCheckup') }}</option>
                <option value="Health Consultation">{{ $t('booking.healthConsultation') }}</option>
                <option value="therapy">{{ $t('booking.therapy') }}</option>
              </select>
            </div>

            <!-- Provider Selection -->
            <div>
              <label class="block text-sm font-medium mb-1" :class="themeClasses.textSecondary">{{ $t('booking.provider') }}</label>
              <select v-model="form.provider" required :disabled="providers.length === 1" class="w-full p-2 rounded border focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-70" :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]">
                <option value="" disabled>{{ $t('booking.selectProvider') }}</option>
                <option v-for="provider in providers" :key="provider.id" :value="provider.id">
                  {{ provider.name }}
                </option>
              </select>
              <p v-if="providers.length === 1" class="text-xs mt-1" :class="themeClasses.textSecondary">
                {{ $t('booking.designatedProvider') || 'Your designated healthcare provider' }}
              </p>
            </div>

            <!-- Date and Time -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1" :class="themeClasses.textSecondary">{{ $t('booking.date') }}</label>
                <input type="date" v-model="form.date" required :min="minDate" class="w-full p-2 rounded border focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300 focus:scale-[1.02] hover:shadow-md cursor-pointer" :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1" :class="themeClasses.textSecondary">{{ $t('booking.time') }}</label>
                <input type="time" v-model="form.time" required class="w-full p-2 rounded border focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300 focus:scale-[1.02] hover:shadow-md cursor-pointer" :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]" />
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium mb-1" :class="themeClasses.textSecondary">{{ $t('booking.notes') }}</label>
              <textarea v-model="form.notes" rows="3" class="w-full p-2 rounded border focus:ring-2 focus:ring-blue-500 outline-none resize-none" :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]"></textarea>
            </div>

            <!-- Submit Button -->
            <button type="submit" :disabled="isSubmitting" class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50">
              {{ isSubmitting ? $t('common.loading') : $t('booking.submit') }}
            </button>
            
            <p v-if="successMessage" class="text-green-500 text-sm mt-2 text-center">{{ successMessage }}</p>
            <p v-if="errorMessage" class="text-red-500 text-sm mt-2 text-center">{{ errorMessage }}</p>
          </form>
        </div>

        <!-- Upcoming Appointments -->
        <div class="p-6 rounded-lg shadow-md border flex flex-col" :class="[themeClasses.cardBackground, themeClasses.border]">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 class="text-xl font-semibold" :class="themeClasses.textPrimary">{{ $t('booking.upcoming') }}</h2>
            <div class="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
              <button 
                @click="toggleSort"
                class="w-full sm:w-auto px-3 py-2 rounded-lg border flex items-center justify-center gap-1 transition-colors"
                :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border, themeClasses.hoverBackground]"
                :title="$t('common.sort') || 'Sort by Date'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span v-if="sortOrder === 'asc'">↑</span>
                <span v-else>↓</span>
              </button>
              <input 
                type="text" 
                v-model="searchQuery" 
                :placeholder="$t('common.search') || 'Search...'" 
                class="w-full sm:w-48 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]"
              />
            </div>
          </div>
          
          <div v-if="isLoading" class="text-center py-8 flex-grow" :class="themeClasses.textSecondary">
            {{ $t('common.loading') || 'Loading...' }}
          </div>
          <div v-else-if="filteredBookings.length === 0" class="text-center py-8 flex-grow" :class="themeClasses.textSecondary">
            {{ $t('booking.noUpcoming') }}
          </div>
          
          <div v-else class="space-y-4 flex-grow">
            <div v-for="booking in paginatedBookings" :key="booking._id || booking.id" class="p-4 rounded-md border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" :class="[themeClasses.background, themeClasses.border]">
              <div>
                <h3 class="font-semibold" :class="themeClasses.textPrimary">{{ $t(`booking.${getServiceKey(booking.service)}`) }}</h3>
                <p class="text-sm" :class="themeClasses.textSecondary">
                  {{ booking.date }} at {{ booking.time }}
                </p>
                <p class="text-sm" :class="themeClasses.textSecondary">
                  {{ $t('booking.provider') }}: {{ getProviderName(booking.providerID || booking.providerId) }}
                </p>
              </div>
              <div class="flex flex-col sm:items-end gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                <span :class="getStatusClass(booking.status)" class="inline-block w-full sm:w-24 text-center px-4 py-1 rounded-full text-xs font-medium">
                  {{ $t(`booking.${booking.status}`) }}
                </span>
                <button 
                  v-if="booking.status === 'pending'"
                  @click="cancelBooking(booking._id || booking.id)"
                  class="w-full sm:w-24 text-center text-xs px-4 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors duration-200"
                >
                  {{ $t('booking.cancel') || 'Cancel' }}
                </button>
              </div>
            </div>

            <!-- Pagination Controls -->
            <div v-if="totalPages > 1" class="flex justify-center items-center space-x-4 mt-6">
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

          <!-- Chat with Provider Button -->
          <div class="mt-8 pt-6 border-t text-center" :class="themeClasses.border">
            <p class="text-sm mb-3" :class="themeClasses.textSecondary">{{ $t('booking.needHelp') || 'Need help?' }}</p>
            <router-link 
              to="/chat" 
              class="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 rounded-full font-medium transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
              </svg>
              {{ $t('booking.chatWithProvider') || 'Chat with your provider' }}
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useI18n } from 'vue-i18n'
import { fetchBookings, createBooking, updateBooking } from '../services/bookingService'
import { fetchCurrentUserProfile } from '../services/userChatService'

const { themeClasses } = useTheme()
const { t } = useI18n()

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

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const isLoading = ref(true)

const currentUser = ref(null)
const providerName = ref('')
const providerId = ref('')

const providers = ref([])

const bookings = ref([])

const currentPage = ref(1)
const itemsPerPage = 3

const searchQuery = ref('')
const sortOrder = ref('desc')

const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

watch([searchQuery, sortOrder], () => {
  currentPage.value = 1
})

const filteredBookings = computed(() => {
  let result = bookings.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(b => {
      const service = (t(`booking.${getServiceKey(b.service)}`) || '').toLowerCase()
      const provider = (getProviderName(b.providerID || b.providerId) || '').toLowerCase()
      const status = (t(`booking.${b.status}`) || '').toLowerCase()
      return service.includes(query) || provider.includes(query) || status.includes(query)
    })
  }
  
  return result.slice().sort((a, b) => {
    const valA = new Date(`${a.date}T${a.time || '00:00'}`).getTime()
    const valB = new Date(`${b.date}T${b.time || '00:00'}`).getTime()
    
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

const form = ref({
  service: '',
  provider: '',
  date: '',
  time: '',
  notes: ''
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const getProviderName = (id) => {
  if (id === providerId.value) return providerName.value
  const provider = providers.value.find(p => p.id === id)
  return provider ? provider.name : 'Unknown'
}

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

const loadData = async () => {
  isLoading.value = true
  try {
    // Load user profile to get designated provider
    const profileRes = await fetchCurrentUserProfile()
    const userData = profileRes?.data?.user || profileRes?.data || profileRes?.user || profileRes
    currentUser.value = userData
    
    if (userData?.providerId) {
      providerId.value = userData.providerId
      providerName.value = userData.provider || userData.providerName || userData.assignedProvider || 'Designated Provider'
      
      // Set form provider to designated provider
      form.value.provider = providerId.value
      
      // Update providers list to only show designated provider
      providers.value = [{ id: providerId.value, name: providerName.value }]
    }

    // Load bookings
    const bookingsRes = await fetchBookings()
    if (bookingsRes?.success) {
      bookings.value = bookingsRes.bookings || []
    }
  } catch (error) {
    console.error('Error loading booking data:', error)
    errorMessage.value = 'Failed to load data. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

const submitBooking = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const bookingData = {
      service: form.value.service,
      providerID: form.value.provider,
      providerName: getProviderName(form.value.provider),
      date: form.value.date,
      time: form.value.time,
      notes: form.value.notes
    }
    
    const res = await createBooking(bookingData)
    
    if (res?.success) {
      bookings.value.unshift(res.booking)
      
      // Reset form
      form.value = {
        service: '',
        provider: providerId.value || '',
        date: '',
        time: '',
        notes: ''
      }
      
      successMessage.value = t('booking.success') || 'Appointment created successfully'
      
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      errorMessage.value = res?.message || 'Failed to create appointment'
    }
  } catch (error) {
    console.error('Error creating booking:', error)
    errorMessage.value = error.message || 'Failed to create appointment'
  } finally {
    isSubmitting.value = false
  }
}

const cancelBooking = async (id) => {
  if (!confirm(t('booking.confirmCancel') || 'Are you sure you want to cancel this appointment?')) return
  
  try {
    const res = await updateBooking(id, { status: 'cancelled' })
    if (res?.success) {
      const booking = bookings.value.find(b => b._id === id || b.id === id)
      if (booking) {
        booking.status = 'cancelled'
      }
    } else {
      alert(res?.message || 'Failed to cancel appointment')
    }
  } catch (error) {
    console.error('Error cancelling booking:', error)
    alert(error.message || 'Failed to cancel appointment')
  }
}
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
}

input[type="date"]::-webkit-calendar-picker-indicator:hover,
input[type="time"]::-webkit-calendar-picker-indicator:hover {
  transform: scale(1.1);
  filter: brightness(0.8);
}

input[type="date"]::-webkit-calendar-picker-indicator:active,
input[type="time"]::-webkit-calendar-picker-indicator:active {
  transform: scale(0.95);
}
</style>