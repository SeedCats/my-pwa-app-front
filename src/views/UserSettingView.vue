<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <Sidebar @update:sidebarState="updateSidebarState" />
    <div :class=" [
      'transition-all duration-300 ease-in-out pt-16',
      sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
    ]">
      <main class="px-3 sm:px-4 md:px-6 lg:px-8 pb-8">
        
        <!-- Admin banner when editing another user's settings -->
        <div v-if="isViewingOtherUser" class="mb-4 p-3 rounded-md text-sm" :class="[themeClasses.border, isDarkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-900']">
          <div class="flex items-center justify-between">
            <div>
              <strong class="mr-2">{{ $t('home.viewingUser') }}</strong>
              <span>
                <template v-if="profileForm.email">{{ profileForm.email }}</template>
                <template v-else-if="viewedUserEmail">{{ viewedUserEmail }}</template>
                <template v-else>{{ viewedUserId }}</template>
              </span>
            </div>

            <div class="flex items-center gap-2">
              <button @click="goBackToUserManagement" class="underline text-sm">{{ $t('home.returnToUserManagement') }}</button>
            </div>
          </div>
        </div>

        <!-- Header -->
        <div class="mb-8 pt-4">
          <h1 class="text-3xl font-bold" :class="themeClasses.textPrimary">{{ $t('userSettings.title') }}</h1>
          <p class="mt-2 text-sm" :class="themeClasses.textSecondary">{{ $t('userSettings.subtitle') }}</p>
        </div>

          <!-- Success/Error Messages -->
          <div v-if="successMessage" class="mb-6 p-4 rounded-lg" :class="isDarkMode ? 'bg-green-900 border border-green-700' : 'bg-green-50 border border-green-200'">
            <p class="text-sm" :class="isDarkMode ? 'text-green-200' : 'text-green-600'">{{ successMessage }}</p>
          </div>
          
          <div v-if="errorMessage" class="mb-6 p-4 rounded-lg" :class="isDarkMode ? 'bg-red-900 border border-red-700' : 'bg-red-50 border border-red-200'">
            <p class="text-sm" :class="isDarkMode ? 'text-red-200' : 'text-red-600'">{{ errorMessage }}</p>
          </div>

          <div class="space-y-8">
            <!-- Profile Information -->
            <div class="shadow-sm rounded-lg border" :class="[themeClasses.cardBackground, themeClasses.border]">
              <div class="px-6 py-4 border-b" :class="themeClasses.border">
                <h2 class="text-xl font-semibold" :class="themeClasses.textPrimary">{{ $t('userSettings.profile') }}</h2>
                <p class="mt-1 text-sm" :class="themeClasses.textSecondary">{{ $t('userSettings.profileDesc') }}</p>
              </div>
              
              <form @submit.prevent="updateProfile" class="p-6 space-y-6">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <!-- Name -->
                  <div>
                    <label for="name" class="block text-sm font-medium mb-2" :class="themeClasses.textPrimary">{{ $t('userSettings.name') }}</label>
                    <input 
                      type="text" 
                      id="name" 
                      v-model="profileForm.name"
                      :class=" [
                        'block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200',
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      ]"
                      :placeholder="$t('userSettings.namePlaceholder')"
                      required
                    />
                  </div>

                  <!-- Email -->
                  <div>
                    <label for="email" class="block text-sm font-medium mb-2" :class="themeClasses.textPrimary">{{ $t('userSettings.email') }}</label>
                    <input 
                      type="email" 
                      id="email" 
                      v-model="profileForm.email"
                      :class=" [
                        'block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200',
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      ]"
                      :placeholder="$t('userSettings.emailPlaceholder')"
                      required
                    />
                  </div>
                </div>

                <div class="flex justify-end pt-4">
                  <button 
                    type="submit" 
                    :disabled="profileLoading"
                    class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                  >
                    <svg v-if="profileLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ profileLoading ? $t('userSettings.updating') : $t('userSettings.updateProfile') }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Change Password -->
            <div class="shadow-sm rounded-lg border" :class="[themeClasses.cardBackground, themeClasses.border]">
              <div class="px-6 py-4 border-b" :class="themeClasses.border">
                <h2 class="text-xl font-semibold" :class="themeClasses.textPrimary">{{ $t('userSettings.changePassword') }}</h2>
                <p class="mt-1 text-sm" :class="themeClasses.textSecondary">{{ $t('userSettings.changePasswordDesc') }}</p>
              </div>
              
              <form @submit.prevent="updatePassword" class="p-6 space-y-6">
                <div class="grid grid-cols-1 gap-6">
                  <!-- Current Password -->
                  <div>
                    <label for="current-password" class="block text-sm font-medium mb-2" :class="themeClasses.textPrimary">{{ $t('userSettings.currentPassword') }}</label>
                    <input 
                      type="password" 
                      id="current-password"
                      v-model="passwordForm.currentPassword"
                      :class=" [
                        'block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200',
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      ]"
                      :placeholder="$t('userSettings.currentPasswordPlaceholder')"
                      required
                    />
                  </div>

                  <!-- New Password -->
                  <div>
                    <label for="new-password" class="block text-sm font-medium mb-2" :class="themeClasses.textPrimary">{{ $t('userSettings.newPassword') }}</label>
                    <input 
                      type="password" 
                      id="new-password"
                      v-model="passwordForm.newPassword"
                      :class=" [
                        'block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200',
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      ]"
                      :placeholder="$t('userSettings.newPasswordPlaceholder')"
                      required
                    />
                  </div>

                  <!-- Confirm New Password -->
                  <div>
                    <label for="confirm-password" class="block text-sm font-medium mb-2" :class="themeClasses.textPrimary">{{ $t('userSettings.confirmNewPassword') }}</label>
                    <input 
                      type="password" 
                      id="confirm-password"
                      v-model="passwordForm.confirmPassword"
                      :class=" [
                        'block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200',
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      ]"
                      :placeholder="$t('userSettings.confirmPasswordPlaceholder')"
                      required
                    />
                  </div>
                </div>

                <div class="flex justify-end pt-4">
                  <button 
                    type="submit" 
                    :disabled="passwordLoading"
                    class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                  >
                    <svg v-if="passwordLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ passwordLoading ? $t('userSettings.updating') : $t('userSettings.updatePassword') }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Delete Account -->
            <div class="shadow-sm rounded-lg border" :class="isDarkMode ? 'bg-gray-800 border-red-600' : 'bg-white border-red-200'">
              <div class="px-6 py-4 border-b" :class="isDarkMode ? 'border-red-600' : 'border-red-200'">
                <h2 class="text-xl font-semibold text-red-600">{{ $t('userSettings.deleteAccount') }}</h2>
                <p class="mt-1 text-sm" :class="themeClasses.textSecondary">{{ $t('userSettings.deleteAccountWarning') }}</p>
              </div>
              
              <div class="p-6">
                <div class="max-w-full text-sm mb-4" :class="themeClasses.textSecondary">
                  <p>{{ $t('userSettings.deleteAccountDesc') }}</p>
                </div>
                
                <!-- Password confirmation input (appears when delete is clicked) -->
                <div v-if="showDeletePassword" class="mb-4">
                  <label for="delete-password" class="block text-sm font-medium mb-2" :class="themeClasses.textPrimary">
                    {{ $t('userSettings.enterPasswordToConfirmDeletion') }}
                  </label>
                  <input 
                    type="password" 
                    id="delete-password" 
                    v-model="deletePassword"
                    :class=" [
                      'block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200',
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                    ]"
                    :placeholder="$t('userSettings.enterPasswordToConfirmDeletion')"
                    @keyup.enter="deleteAccount"
                  />
                </div>
                
                <div class="flex gap-3">
                  <button 
                    v-if="!showDeletePassword"
                    @click="showDeletePassword = true"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    {{ $t('userSettings.deleteAccount') }}
                  </button>
                  
                  <template v-if="showDeletePassword">
                    <button 
                      @click="deleteAccount"
                      :disabled="deleteLoading || !deletePassword.trim()"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg v-if="deleteLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ deleteLoading ? $t('userSettings.deleting') : $t('userSettings.confirmDelete') }}
                    </button>
                    
                    <button 
                      @click="showDeletePassword = false; deletePassword = ''"
                      class="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" :class="isDarkMode ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'"
                    >
                      {{ $t('common.close') }}
                    </button>
                  </template>
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
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import Sidebar from '../components/Side_and_Top_Bar.vue'
import { getUserById } from '../services/adminService'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const route = useRoute()
const userState = useUserStore()
const { isDarkMode, themeClasses } = useTheme()
const API_URL = import.meta.env.VITE_API_URL || ''

// State
const sidebarHidden = ref(false)
const profileForm = ref({ name: '', email: '' })
const targetUserId = ref(null)
const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })

// Computed property to check if viewing another user (similar to HomeView)
const currentUserId = computed(() => userState.user?.id || null)
const viewedUserId = computed(() => route.query.userId || null)
const viewedUserEmail = computed(() => route.query.userEmail || null)
const isViewingOtherUser = computed(() => {
  // Check if we have a userId in query params and it's different from current user
  return viewedUserId.value && currentUserId.value && String(viewedUserId.value) !== String(currentUserId.value)
})
const profileLoading = ref(false)
const passwordLoading = ref(false)
const deleteLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const showDeletePassword = ref(false)
const deletePassword = ref('')

const loadUserData = async () => {
  try {
    // If an admin is viewing another user's settings, allow loading that user via ?userId=...
    const idFromQuery = route.query.userId || null
    let user = null

    if (idFromQuery && userState.user && userState.user.role === 'admin') {
      try {
        const res = await getUserById(idFromQuery)
        if (res) {
          // handle different response shapes as other services do
          user = res?.data?.user || res?.data || res?.user || res || null
          if (user && user.id) targetUserId.value = user.id
        }
      } catch (e) {
        // fallback to current user if admin fetch fails
        console.warn('Failed to load specified user, falling back to current user:', e)
      }
    }

    // If no target user loaded, load current user
    if (!user) {
      const res = await fetch(`${API_URL}/api/user/me`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        user = data.data?.user || data.user || data.data || data
      }
    }

    if (user) {
      // populate profile form
      profileForm.value = { name: user.name || '', email: user.email || '' }
      // If no explicit targetUserId set above, set it to the current user's id
      if (!targetUserId.value && user.id) targetUserId.value = user.id
    }
  } catch (err) {
    console.error('Failed to load user data:', err)
  }
}

const goBackToUserManagement = () => {
  router.push({ name: 'UserManagement' })
}

onMounted(loadUserData)

const updateSidebarState = (state) => sidebarHidden.value = state
const clearMessages = () => { successMessage.value = ''; errorMessage.value = '' }
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const updateProfile = async () => {
  clearMessages()
  profileLoading.value = true
  
  try {
    // If an admin is editing another user, send the update to the admin endpoint
    let url = `${API_URL}/api/user/profile`
    let method = 'PUT'
    let body = JSON.stringify(profileForm.value)

    if (targetUserId.value && userState.user && userState.user.role === 'admin' && String(targetUserId.value) !== String(userState.user?.id)) {
      // Use admin endpoint to update target user
      url = `${API_URL}/api/admin/users/${targetUserId.value}`
      method = 'PUT'
      body = JSON.stringify(profileForm.value)
    }

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body
    })
    
    const data = await response.json()
    
    if (response.ok && data.success) {
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: data.data.user }))
      successMessage.value = data.message || 'Profile updated successfully!'
    } else {
      errorMessage.value = data.message || 'Failed to update profile'
    }
    scrollToTop()
  } catch {
    errorMessage.value = 'Network error. Please try again.'
    scrollToTop()
  } finally {
    profileLoading.value = false
  }
}

const updatePassword = async () => {
  clearMessages()
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errorMessage.value = 'New passwords do not match'
    scrollToTop()
    return
  }
  
  passwordLoading.value = true
  
  try {
    const response = await fetch(`${API_URL}/api/user/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      })
    })
    
    const data = await response.json()
    
    if (response.ok && data.success) {
      // Clear the password form
      passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
      
      // Logout to clear cookies/tokens
      try {
        await fetch(`${API_URL}/api/logout`, {
          method: 'POST',
          credentials: 'include'
        })
      } catch (err) {
        console.error('Logout error:', err)
      }
      
      // Force page reload to login page to clear all state
      window.location.href = '/'
    } else {
      errorMessage.value = data.message || 'Failed to update password'
      scrollToTop()
    }
  } catch {
    errorMessage.value = 'Network error. Please try again.'
    scrollToTop()
  } finally {
    passwordLoading.value = false
  }
}

const deleteAccount = async () => {
  deleteLoading.value = true
  
  try {
    const response = await fetch(`${API_URL}/api/user/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password: deletePassword.value })
    })
    
    const data = await response.json()
    
    if (response.ok && data.success) {
      errorMessage.value = ''
      successMessage.value = data.message || 'Account deleted successfully!'
      showDeletePassword.value = false
      deletePassword.value = ''
      scrollToTop()
      setTimeout(() => router.push('/'), 3000)
    } else {
      successMessage.value = ''
      errorMessage.value = data.message || 'Failed to delete account'
      showDeletePassword.value = false
      deletePassword.value = ''
      scrollToTop()
    }
  } catch {
    successMessage.value = ''
    errorMessage.value = 'Network error. Please try again.'
    showDeletePassword.value = false
    deletePassword.value = ''
    scrollToTop()
  } finally {
    deleteLoading.value = false
  }
}
</script>