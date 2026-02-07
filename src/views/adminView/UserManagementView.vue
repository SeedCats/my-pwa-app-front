<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <Sidebar @update:sidebarState="updateSidebarState" />
    <div :class="[
      'transition-all duration-300 ease-in-out pt-16',
      sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
    ]">
      <main class="px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
        <div class="p-6">
          <h1 class="text-2xl font-bold mb-4" :class="themeClasses.textPrimary">{{ $t('admin.userManagementTitle') }}</h1>

          <div class="mb-4 flex items-center">
            <div class="ml-auto">
              <span :class="['text-sm', themeClasses.textSecondary]">{{ $t('admin.userCount', { count: total }) }}</span>
            </div>
          </div>

          <div v-if="loading" :class="themeClasses.textSecondary">{{ $t('common.loading') }}</div>

          <div v-else>
            <div v-if="users.length === 0" class="text-gray-500">{{ $t('admin.noAssignedUsers') }}</div>

            <div v-else class="overflow-auto">
              <table :class="['min-w-full divide-y', isDarkMode ? 'divide-gray-700' : 'divide-gray-200']">
                <thead>
                  <tr>
                    <th :class="['px-6 py-3 text-left text-xs font-medium uppercase tracking-wider', themeClasses.textSecondary]">{{ $t('admin.name') }}</th>
                    <th :class="['px-6 py-3 text-left text-xs font-medium uppercase tracking-wider', themeClasses.textSecondary]">{{ $t('admin.email') }}</th>
                    <th :class="['px-6 py-3 text-left text-xs font-medium uppercase tracking-wider', themeClasses.textSecondary]">{{ $t('admin.role') }}</th>
                    <th :class="['px-6 py-3 text-left text-xs font-medium uppercase tracking-wider', themeClasses.textSecondary]">{{ $t('admin.id') }}</th>
                    <th :class="['px-6 py-3 text-left text-xs font-medium uppercase tracking-wider', themeClasses.textSecondary]">{{ $t('admin.created') }}</th>
                    <th :class="['px-6 py-3 text-center text-xs font-medium uppercase tracking-wider', themeClasses.textSecondary]">{{ $t('admin.operation') }}</th>
                    <th :class="['px-6 py-3 text-center text-xs font-medium uppercase tracking-wider', themeClasses.textSecondary]">{{ $t('admin.status') }}</th>
                  </tr>
                </thead>
                <tbody :class="[themeClasses.cardBackground, 'divide-y', isDarkMode ? 'divide-gray-700' : 'divide-gray-200']">
                  <tr v-for="u in users" :key="u.id" :class="themeClasses.cardBackground">
                    <td :class="['px-6 py-4 whitespace-nowrap text-sm', themeClasses.textPrimary]">{{ u.name }}</td>
                    <td :class="['px-6 py-4 whitespace-nowrap text-sm', themeClasses.textSecondary]">{{ u.email }}</td>
                    <td :class="['px-6 py-4 whitespace-nowrap text-sm', themeClasses.textSecondary]">{{ u.role }}</td>
                    <td :class="['px-6 py-4 whitespace-nowrap text-sm', themeClasses.textSecondary]">{{ u.id }}</td>
                    <td :class="['px-6 py-4 whitespace-nowrap text-sm', themeClasses.textSecondary]">{{ formatDate(u.createdAt) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button @click="openOperations(u)" class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mx-auto">{{ $t('admin.operation') }}</button>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <span :class="['inline-block px-2 py-1 rounded text-xs font-semibold', u.serviceStatusKey === 'completed' ? (isDarkMode ? 'bg-green-700 text-white' : 'bg-green-100 text-green-800') : (isDarkMode ? 'bg-yellow-700 text-white' : 'bg-yellow-100 text-yellow-800')]">
                        {{ u.serviceStatusKey === 'completed' ? $t('admin.statusCompleted') : $t('admin.statusOnGoing') }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex items-center justify-between mt-4">
              <div>
                <button @click="prevPage" :disabled="page <= 1" :class="['px-3 py-1 rounded mr-2', themeClasses.textPrimary, themeClasses.border, themeClasses.inputBackground, { 'opacity-50 cursor-not-allowed': page <= 1 }]">{{ $t('aiSupport.prev') }}</button>
                <button @click="nextPage" :disabled="page >= totalPages" :class="['px-3 py-1 rounded', themeClasses.textPrimary, themeClasses.border, themeClasses.inputBackground, { 'opacity-50 cursor-not-allowed': page >= totalPages }]">{{ $t('aiSupport.next') }}</button>
              </div>

              <div :class="['text-sm', themeClasses.textSecondary]">
                {{ $t('aiSupport.showingPage', { page, total: totalPages }) }}
              </div>
            </div>

          </div>

          <div v-if="error" class="mt-4 text-red-600">{{ error }}</div>

          <!-- Operations Modal -->
          <div v-if="showOperationsModal" class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="fixed inset-0 bg-black opacity-50" @click="closeOperations"></div>
            <div :class="['rounded-lg shadow-lg z-60 max-w-lg w-full p-6', themeClasses.cardBackground, themeClasses.textPrimary, themeClasses.border]">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold" :class="themeClasses.textPrimary">{{ $t('admin.operation') }} - {{ selectedUser ? selectedUser.name : '' }}</h3>
                <button @click="closeOperations" class="p-2 rounded hover:bg-gray-100 text-gray-600" aria-label="Close">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div>
                <p :class="['text-sm mb-2', themeClasses.textSecondary]">{{ selectedUser ? selectedUser.email : '' }}</p>
                <div class="mb-2">
                  <strong class="text-sm mr-2">{{ $t('admin.status') }}:</strong>
                  <span :class="['inline-block px-2 py-1 rounded text-sm font-semibold', (selectedUser && selectedUser.serviceStatusKey === 'completed') ? (isDarkMode ? 'bg-green-700 text-white' : 'bg-green-100 text-green-800') : (isDarkMode ? 'bg-yellow-700 text-white' : 'bg-yellow-100 text-yellow-800') ]">
                    {{ selectedUser ? (selectedUser.serviceStatusKey === 'completed' ? $t('admin.statusCompleted') : $t('admin.statusOnGoing')) : $t('admin.statusOnGoing') }}
                  </span>
                </div>
                <div class="mb-4">
                  <div>
                    <button @click="viewDetails" :class="['flex items-center gap-2 px-4 py-2 rounded text-sm', themeClasses.inputBackground, themeClasses.textSecondary, themeClasses.border, themeClasses.hoverBackground]" :aria-label="selectedUser ? `${$t('admin.view')} ${selectedUser.name}` : $t('admin.view')">
                      <svg class="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{{ $t('admin.view') }}</span>
                    </button>
                  </div>

                  <div class="mt-3 flex flex-col gap-3">
                    <div class="flex gap-3">
                      <button @click="goToDashboard(selectedUser)" class="flex-1 flex items-center gap-2 px-4 py-2 rounded text-sm bg-blue-600 text-white hover:bg-blue-700">
                        <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3v18h18" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9h18M9 21V9" />
                        </svg>
                        {{ $t('admin.dashboard') }}
                      </button>

                      <button @click="goToUserSetting(selectedUser)" class="flex-1 flex items-center gap-2 px-4 py-2 rounded text-sm bg-indigo-600 text-white hover:bg-indigo-700">
                        <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5v14" />
                        </svg>
                        {{ $t('admin.userSetting') }}
                      </button>
                    </div>

                    <div class="flex gap-3">
                      <button @click="setOnGoingService(selectedUser)" class="flex-1 flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700">
                        <svg class="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5a1 1 0 112 0v4l3 2a1 1 0 11-1 1l-3-2V5z" clip-rule="evenodd" />
                        </svg>
                        {{ $t('admin.ongoingService') }}
                      </button>
                    </div>

                    <div class="flex gap-3">
                      <button @click="completeService(selectedUser)" class="flex-1 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                        <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {{ $t('admin.serviceCompletion') }}
                      </button>
                    </div>
                  </div>

                  <div v-if="info" :class="['mt-2 text-sm', (info === t('admin.serviceSetOnGoing') ? (isDarkMode ? 'text-orange-400' : 'text-orange-600') : (isDarkMode ? 'text-green-400' : 'text-green-600'))]">{{ info }}</div>
                </div>

                <div v-if="showDetails" :class="['mt-2 border rounded p-4 text-sm', themeClasses.inputBackground, themeClasses.textSecondary, themeClasses.border]">
                  <dl class="grid grid-cols-1 gap-2">
                    <div><dt class="font-semibold inline">{{ $t('admin.name') }}:</dt> <dd class="inline">{{ selectedUser ? selectedUser.name : '' }}</dd></div>
                    <div><dt class="font-semibold inline">{{ $t('admin.id') }}:</dt> <dd class="inline">{{ selectedUser ? selectedUser.id : '' }}</dd></div>
                    <div><dt class="font-semibold inline">{{ $t('admin.role') }}:</dt> <dd class="inline">{{ selectedUser ? selectedUser.role : '' }}</dd></div>
                    <div><dt class="font-semibold inline">{{ $t('admin.created') }}:</dt> <dd class="inline">{{ selectedUser ? formatDate(selectedUser.createdAt) : '' }}</dd></div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../../components/Side_and_Top_Bar.vue'
import { useTheme } from '../../composables/useTheme'
import { useLanguage } from '../../composables/useLanguage'
import { fetchWithAuth } from '../../utils/fetchWithAuth'
const { t } = useLanguage()
const API_URL = import.meta.env.VITE_API_URL || ''


const users = ref([])
const loading = ref(true)
const error = ref('')
const page = ref(1)
const limit = ref(10) // show up to 10 users per page
const total = ref(0)

const loadUsers = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_URL}/api/admin/assigned-users?page=${page.value}&limit=${limit.value}`, { credentials: 'include' })
    if (!res.ok) throw new Error(t('admin.failedLoadAssignedUsers'))
    const json = await res.json()
    const data = json.data || json
    // Initialize users with a default 'ongoing' status, then fetch actual status (if any)
    users.value = (data.users || []).map(u => ({ ...u, serviceStatusKey: 'ongoing', serviceStatus: t('admin.statusOnGoing') }))
    // Fetch each user's status in parallel using the new API endpoint
    await Promise.all(users.value.map(async (u, idx) => {
      try {
        const resStatus = await fetchWithAuth(`${API_URL}/api/data/status?userId=${u.id}`, { credentials: 'include' })
        if (resStatus.ok) {
          const jsonStatus = await resStatus.json().catch(() => null)
          const statusText = jsonStatus?.data?.status || 'On-going'
          const key = String(statusText).toLowerCase() === 'completed' ? 'completed' : 'ongoing'
          users.value[idx] = { ...users.value[idx], serviceStatusKey: key, serviceStatus: key === 'completed' ? t('admin.statusCompleted') : t('admin.statusOnGoing') }
        }
      } catch (e) {
        // Keep default status if status fetch fails
      }
    }))

    total.value = data.total || users.value.length
    page.value = data.page || page.value
    limit.value = data.limit || limit.value
    sortUsers()
  } catch (err) {
    error.value = err.message || t('admin.failedLoadAssignedUsers')
  } finally {
    loading.value = false
  }
}

const sortUsers = () => {
  users.value.sort((a, b) => {
    const rank = (u) => u.serviceStatusKey === 'ongoing' ? 0 : 1
    return rank(a) - rank(b)
  })
}

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

const prevPage = async () => {
  if (page.value <= 1) return
  page.value--
  await loadUsers()
}

const nextPage = async () => {
  if (page.value >= totalPages.value) return
  page.value++
  await loadUsers()
}

// Modal & operation state
const showOperationsModal = ref(false)
const selectedUser = ref(null)
const showDetails = ref(false)

const openOperations = (u) => {
  selectedUser.value = u
  showDetails.value = false
  showOperationsModal.value = true
}

const closeOperations = () => {
  showOperationsModal.value = false
  selectedUser.value = null
  showDetails.value = false
}

const viewDetails = () => {
  showDetails.value = !showDetails.value
}

const info = ref('')
const router = useRouter()

const completeService = async (user) => {
  if (!user) return
  if (!confirm(t('admin.confirmServiceComplete', { email: user.email }))) return
  error.value = ''
  info.value = ''
  try {
    const res = await fetchWithAuth(`${API_URL}/api/data/status/complete?userId=${user.id}`, {
      method: 'POST',
      credentials: 'include'
    })
    if (!res.ok) throw new Error(t('admin.serviceCompleteFailed'))
    info.value = t('admin.serviceCompleted')
    // Update local status immediately and re-sort
    const idx = users.value.findIndex(u => u.id === user.id)
    if (idx !== -1) {
      users.value[idx] = { ...users.value[idx], serviceStatusKey: 'completed', serviceStatus: t('admin.statusCompleted') }
      if (selectedUser.value && selectedUser.value.id === user.id) {
        selectedUser.value.serviceStatusKey = 'completed'
        selectedUser.value.serviceStatus = t('admin.statusCompleted')
      }
      sortUsers()
    }
    await loadUsers()
  } catch (err) {
    error.value = err.message || t('admin.serviceCompleteFailed')
  }
}

const goToDashboard = (user) => {
  if (!user) return
  closeOperations()
  router.push({ name: 'home', query: { userId: user.id, userEmail: user.email } })
}

const goToUserSetting = (user) => {
  if (!user) return
  closeOperations()
  // Navigate to the User Setting page and pass the user's id and email via query
  router.push({ name: 'UserSetting', query: { userId: user.id, userEmail: user.email } })
}

const setOnGoingService = async (user) => {
  if (!user) return
  if (!confirm(t('admin.confirmSetOnGoing', { email: user.email }))) return
  error.value = ''
  info.value = ''
  try {
    // Try a dedicated endpoint first, then fallback to a generic status update
    let res = await fetchWithAuth(`${API_URL}/api/data/status/ongoing?userId=${user.id}`, { method: 'POST', credentials: 'include' })
    if (!res.ok) {
      // fallback: POST /api/data/status with JSON body { status: 'On-going' }
      res = await fetchWithAuth(`${API_URL}/api/data/status?userId=${user.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'On-going' })
      })
    }

    if (!res.ok) throw new Error(t('admin.serviceSetOnGoingFailed'))

    info.value = t('admin.serviceSetOnGoing')
    // Update local status immediately and re-sort
    const idx = users.value.findIndex(u => u.id === user.id)
    if (idx !== -1) {
      users.value[idx] = { ...users.value[idx], serviceStatusKey: 'ongoing', serviceStatus: t('admin.statusOnGoing') }
      if (selectedUser.value && selectedUser.value.id === user.id) {
        selectedUser.value.serviceStatusKey = 'ongoing'
        selectedUser.value.serviceStatus = t('admin.statusOnGoing')
      }
      sortUsers()
    }

    await loadUsers()
  } catch (err) {
    error.value = err.message || t('admin.serviceSetOnGoingFailed')
  }
}

const formatDate = (d) => {
  try {
    return d ? new Date(d).toLocaleString() : ''
  } catch (e) {
    return ''
  }
}

const sidebarHidden = ref(false)
const updateSidebarState = (state) => sidebarHidden.value = state

const { themeClasses, isDarkMode } = useTheme()

onMounted(loadUsers)
</script>
