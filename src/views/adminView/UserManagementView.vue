<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <Sidebar @update:sidebarState="updateSidebarState" />
    <div :class="[
      'transition-all duration-300 ease-in-out pt-16',
      sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
    ]">
      <main class="px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
        <div class="p-6">
          <h1 class="text-2xl font-bold mb-4">{{ $t('nav.userManagement') }}</h1>

          <div v-if="loading" class="text-gray-500">{{ $t('common.loading') }}</div>

          <div v-else class="overflow-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th class="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="u in users" :key="u.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ u.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ u.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ u.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ u.role }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <select v-model="u.role" @change="changeRole(u)" class="mr-2 border rounded px-2 py-1">
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                    <button @click="deleteUser(u)" class="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="error" class="mt-4 text-red-600">{{ error }}</div>
          <div v-if="success" class="mt-4 text-green-600">{{ success }}</div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '../../components/Side_and_Top_Bar.vue'
import { useTheme } from '../../composables/useTheme'
const API_URL = import.meta.env.VITE_API_URL || ''

const users = ref([])
const loading = ref(true)
const error = ref('')
const success = ref('')

const loadUsers = async () => {
  loading.value = true
  error.value = ''
  try {
    // Try admin endpoint first
    let res = await fetch(`${API_URL}/api/admin/users`, { credentials: 'include' })
    if (!res.ok) {
      // Fallback
      res = await fetch(`${API_URL}/api/users`, { credentials: 'include' })
    }
    if (!res.ok) throw new Error('Failed to load users')
    const json = await res.json()
    users.value = json.data?.users || json.users || json || []
  } catch (err) {
    error.value = err.message || 'Failed to load users'
  } finally {
    loading.value = false
  }
}

const changeRole = async (user) => {
  error.value = ''
  success.value = ''
  try {
    const res = await fetch(`${API_URL}/api/admin/users/${user.id}/role`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: user.role })
    })
    if (!res.ok) throw new Error('Failed to update role')
    success.value = 'Role updated'
  } catch (err) {
    error.value = err.message || 'Failed to update role'
    await loadUsers()
  }
}

const deleteUser = async (user) => {
  if (!confirm(`Delete user ${user.email}?`)) return
  error.value = ''
  success.value = ''
  try {
    const res = await fetch(`${API_URL}/api/admin/users/${user.id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    if (!res.ok) throw new Error('Failed to delete user')
    success.value = 'User deleted'
    await loadUsers()
  } catch (err) {
    error.value = err.message || 'Failed to delete user'
  }
}

const sidebarHidden = ref(false)
const updateSidebarState = (state) => sidebarHidden.value = state

const { themeClasses } = useTheme()

onMounted(loadUsers)
</script>
