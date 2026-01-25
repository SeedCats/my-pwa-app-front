<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <Sidebar @update:sidebarState="updateSidebarState" />
    <div :class="[
      'transition-all duration-300 ease-in-out pt-16',
      sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
    ]">
      <main class="px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
        <div class="p-6">
          <h1 class="text-2xl font-bold mb-4">{{ $t('admin.userManagementTitle') }}</h1>

          <div class="mb-4 flex items-center">
            <div class="ml-auto text-sm text-gray-600">
              <span v-if="total">{{ total }} {{ $t('nav.userManagement') }}</span>
            </div>
          </div>

          <div v-if="loading" class="text-gray-500">{{ $t('common.loading') }}</div>

          <div v-else>
            <div v-if="users.length === 0" class="text-gray-500">{{ $t('admin.noAssignedUsers') }}</div>

            <div v-else class="overflow-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('admin.name') }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('admin.email') }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('admin.role') }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('admin.id') }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('admin.operation') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="u in users" :key="u.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ u.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ u.email }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ u.role }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ u.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(u.createdAt) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button @click="deleteUser(u)" class="text-red-600 hover:underline">{{ $t('common.delete') }}</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex items-center justify-between mt-4">
              <div>
                <button @click="prevPage" :disabled="page <= 1" class="px-3 py-1 rounded border mr-2" :class="{ 'opacity-50 cursor-not-allowed': page <= 1 }">{{ $t('aiSupport.prev') }}</button>
                <button @click="nextPage" :disabled="page >= totalPages" class="px-3 py-1 rounded border" :class="{ 'opacity-50 cursor-not-allowed': page >= totalPages }">{{ $t('aiSupport.next') }}</button>
              </div>

              <div class="text-sm text-gray-600">
                {{ $t('aiSupport.showingPage', { page, total: totalPages }) }}
              </div>
            </div>

          </div>

          <div v-if="error" class="mt-4 text-red-600">{{ error }}</div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Sidebar from '../../components/Side_and_Top_Bar.vue'
import { useTheme } from '../../composables/useTheme'
import { useLanguage } from '../../composables/useLanguage'
const { t } = useLanguage()
const API_URL = import.meta.env.VITE_API_URL || ''


const users = ref([])
const loading = ref(true)
const error = ref('')
const page = ref(1)
const limit = ref(50)
const total = ref(0)

const loadUsers = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_URL}/api/admin/assigned-users?page=${page.value}&limit=${limit.value}`, { credentials: 'include' })
    if (!res.ok) throw new Error(t('admin.failedLoadAssignedUsers'))
    const json = await res.json()
    const data = json.data || json
    users.value = data.users || []
    total.value = data.total || users.value.length
    page.value = data.page || page.value
    limit.value = data.limit || limit.value
  } catch (err) {
    error.value = err.message || t('admin.failedLoadAssignedUsers')
  } finally {
    loading.value = false
  }
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



const deleteUser = async (user) => {
  if (!confirm(t('admin.confirmDelete', { email: user.email }))) return
  error.value = ''
  try {
    const res = await fetch(`${API_URL}/api/admin/users/${user.id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    if (!res.ok) throw new Error(t('admin.failedDeleteUser'))
    await loadUsers()
  } catch (err) {
    error.value = err.message || t('admin.failedDeleteUser')
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

const { themeClasses } = useTheme()

onMounted(loadUsers)
</script>
