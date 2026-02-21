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
                <option value="generalCheckup">{{ $t('booking.generalCheckup') }}</option>
                <option value="dental">{{ $t('booking.dental') }}</option>
                <option value="cardiology">{{ $t('booking.cardiology') }}</option>
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
                <input type="date" v-model="form.date" required :min="minDate" class="w-full p-2 rounded border focus:ring-2 focus:ring-blue-500 outline-none" :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1" :class="themeClasses.textSecondary">{{ $t('booking.time') }}</label>
                <input type="time" v-model="form.time" required class="w-full p-2 rounded border focus:ring-2 focus:ring-blue-500 outline-none" :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]" />
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
        <div class="p-6 rounded-lg shadow-md border" :class="[themeClasses.cardBackground, themeClasses.border]">
          <h2 class="text-xl font-semibold mb-6" :class="themeClasses.textPrimary">{{ $t('booking.upcoming') }}</h2>
          
          <div v-if="isLoading" class="text-center py-8" :class="themeClasses.textSecondary">
            {{ $t('common.loading') || 'Loading...' }}
          </div>
          <div v-else-if="bookings.length === 0" class="text-center py-8" :class="themeClasses.textSecondary">
            {{ $t('booking.noUpcoming') }}
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="booking in bookings" :key="booking._id || booking.id" class="p-4 rounded-md border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" :class="[themeClasses.background, themeClasses.border]">
              <div>
                <h3 class="font-semibold" :class="themeClasses.textPrimary">{{ $t(`booking.${booking.service}`) }}</h3>
                <p class="text-sm" :class="themeClasses.textSecondary">
                  {{ booking.date }} at {{ booking.time }}
                </p>
                <p class="text-sm" :class="themeClasses.textSecondary">
                  {{ $t('booking.provider') }}: {{ getProviderName(booking.providerID || booking.providerId) }}
                </p>
              </div>
              <span :class="getStatusClass(booking.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ $t(`booking.${booking.status}`) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useI18n } from 'vue-i18n'
import { fetchBookings, createBooking } from '../services/bookingService'
import { fetchCurrentUserProfile } from '../services/userChatService'

const { themeClasses } = useTheme()
const { t } = useI18n()

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const isLoading = ref(true)

const currentUser = ref(null)
const providerName = ref('')
const providerId = ref('')

// Mock providers (fallback if no designated provider)
const providers = ref([
  { id: 'p1', name: 'Dr. Smith' },
  { id: 'p2', name: 'Dr. Johnson' },
  { id: 'p3', name: 'Dr. Williams' }
])

const bookings = ref([])

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
</script>