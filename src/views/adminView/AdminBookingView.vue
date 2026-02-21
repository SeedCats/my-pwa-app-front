<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <main class="px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
      <div class="py-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold mb-2" :class="themeClasses.textPrimary">{{ $t('booking.adminTitle') }}</h1>
            <p :class="themeClasses.textSecondary">{{ $t('booking.adminDesc') }}</p>
          </div>
        </div>

        <div class="rounded-lg shadow-md border overflow-hidden" :class="[themeClasses.cardBackground, themeClasses.border]">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b" :class="[themeClasses.border, themeClasses.background]">
                  <th class="p-4 font-semibold" :class="themeClasses.textPrimary">{{ $t('booking.patient') }}</th>
                  <th class="p-4 font-semibold" :class="themeClasses.textPrimary">{{ $t('booking.service') }}</th>
                  <th class="p-4 font-semibold" :class="themeClasses.textPrimary">{{ $t('booking.date') }} & {{ $t('booking.time') }}</th>
                  <th class="p-4 font-semibold" :class="themeClasses.textPrimary">{{ $t('booking.status') }}</th>
                  <th class="p-4 font-semibold text-right" :class="themeClasses.textPrimary">{{ $t('booking.action') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading">
                  <td colspan="5" class="p-8 text-center" :class="themeClasses.textSecondary">
                    {{ $t('common.loading') || 'Loading...' }}
                  </td>
                </tr>
                <tr v-else-if="bookings.length === 0">
                  <td colspan="5" class="p-8 text-center" :class="themeClasses.textSecondary">
                    {{ $t('common.noResults') }}
                  </td>
                </tr>
                <tr v-for="booking in bookings" :key="booking._id || booking.id" class="border-b last:border-0 hover:bg-opacity-50" :class="[themeClasses.border, themeClasses.hoverBackground]">
                  <td class="p-4">
                    <div class="font-medium" :class="themeClasses.textPrimary">{{ booking.name || booking.patientName }}</div>
                    <div class="text-sm" :class="themeClasses.textSecondary">{{ booking.email || booking.patientEmail }}</div>
                  </td>
                  <td class="p-4" :class="themeClasses.textPrimary">
                    {{ $t(`booking.${booking.service}`) }}
                  </td>
                  <td class="p-4">
                    <div :class="themeClasses.textPrimary">{{ booking.date }}</div>
                    <div class="text-sm" :class="themeClasses.textSecondary">{{ booking.time }}</div>
                  </td>
                  <td class="p-4">
                    <span :class="getStatusClass(booking.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                      {{ $t(`booking.${booking.status}`) }}
                    </span>
                  </td>
                  <td class="p-4 text-right space-x-2">
                    <button 
                      v-if="booking.status === 'pending'"
                      @click="updateStatus(booking._id || booking.id, 'confirmed')"
                      class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                    >
                      {{ $t('booking.approve') }}
                    </button>
                    <button 
                      v-if="booking.status === 'pending'"
                      @click="updateStatus(booking._id || booking.id, 'cancelled')"
                      class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                    >
                      {{ $t('booking.reject') }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { useI18n } from 'vue-i18n'
import { fetchBookings, updateBooking } from '../../services/bookingService'

const { themeClasses } = useTheme()
const { t } = useI18n()

const bookings = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

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
  loadBookings()
})

const getStatusClass = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

const updateStatus = async (id, newStatus) => {
  try {
    const res = await updateBooking(id, { status: newStatus })
    if (res?.success) {
      const booking = bookings.value.find(b => b._id === id || b.id === id)
      if (booking) {
        booking.status = newStatus
      }
    } else {
      alert(res?.message || 'Failed to update status')
    }
  } catch (error) {
    console.error('Error updating status:', error)
    alert(error.message || 'Failed to update status')
  }
}
</script>