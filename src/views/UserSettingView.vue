<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <Sidebar @update:sidebarState="updateSidebarState" />
    <div :class=" [
      'transition-all duration-300 ease-in-out',
      sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
    ]">
      <main>
        <div class="px-3 sm:px-4 md:px-6 lg:px-8 pt-4 pb-8">
          <!-- Header -->
          <div class="mb-8 pt-16">
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
                    {{ profileLoading ? 'Updating...' : 'Update Profile' }}
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
                    {{ passwordLoading ? 'Updating...' : 'Update Password' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Delete Account -->
            <div class="shadow-sm rounded-lg border" :class="isDarkMode ? 'bg-gray-800 border-red-600' : 'bg-white border-red-200'">
              <div class="px-6 py-4 border-b" :class="isDarkMode ? 'border-red-600' : 'border-red-200'">
                <h2 class="text-xl font-semibold text-red-600">Delete Account</h2>
                <p class="mt-1 text-sm" :class="themeClasses.textSecondary">Once your account is deleted, all of its resources and data will be permanently deleted.</p>
              </div>
              
              <div class="p-6">
                <div class="max-w-full text-sm mb-4" :class="themeClasses.textSecondary">
                  <p>Before deleting your account, please download any data or information that you wish to retain.</p>
                </div>
                
                <!-- Password confirmation input (appears when delete is clicked) -->
                <div v-if="showDeletePassword" class="mb-4">
                  <label for="delete-password" class="block text-sm font-medium mb-2" :class="themeClasses.textPrimary">
                    Enter your password to confirm deletion
                  </label>
                  <input 
                    type="password" 
                    id="delete-password" 
                    v-model="deletePassword"
                    :class=" [
                      'block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200',
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                    ]"
                    placeholder="Enter your password"
                    @keyup.enter="deleteAccount"
                  />
                </div>
                
                <div class="flex gap-3">
                  <button 
                    v-if="!showDeletePassword"
                    @click="showDeletePassword = true"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete Account
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
                      {{ deleteLoading ? 'Deleting...' : 'Confirm Delete' }}
                    </button>
                    
                    <button 
                      @click="showDeletePassword = false; deletePassword = ''"
                      class="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" :class="isDarkMode ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'"
                    >
                      Cancel
                    </button>
                  </template>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import Sidebar from '../components/Side_and_Top_Bar.vue'

const router = useRouter()
const { isDarkMode, themeClasses } = useTheme()
const API_URL = import.meta.env.VITE_API_URL || ''

// State
const sidebarHidden = ref(false)
const profileForm = ref({ name: '', email: '' })
const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })
const profileLoading = ref(false)
const passwordLoading = ref(false)
const deleteLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const showDeletePassword = ref(false)
const deletePassword = ref('')

const loadUserData = async () => {
  try {
    const res = await fetch(`${API_URL}/api/user/me`, { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      const user = data.data?.user || data.user || data.data || data
      console.log('User data loaded:', user)
      profileForm.value = { name: user.name || '', email: user.email || '' }
    }
  } catch (err) {
    console.error('Failed to load user data:', err)
  }
}

onMounted(loadUserData)

const updateSidebarState = (state) => sidebarHidden.value = state
const clearMessages = () => { successMessage.value = ''; errorMessage.value = '' }
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const updateProfile = async () => {
  clearMessages()
  profileLoading.value = true
  
  try {
    const response = await fetch(`${API_URL}/api/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(profileForm.value)
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