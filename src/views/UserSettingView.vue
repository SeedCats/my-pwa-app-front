<template>
  <div class="min-h-full bg-gray-50">
    <Sidebar @update:sidebarState="updateSidebarState" />
    <div :class="[
      'transition-all duration-300 ease-in-out',
      sidebarHidden ? 'lg:ml-0' : 'lg:ml-72'
    ]">
      <main>
        <div class="px-3 sm:px-4 md:px-6 lg:px-8 pt-16 pb-8">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold ml-2 text-gray-900">Account Settings</h1>
            <p class="mt-2 text-sm text-gray-600 ml-2">Manage your account information and preferences</p>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-600">{{ successMessage }}</p>
          </div>
          
          <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <div class="space-y-8">
            <!-- Profile Information -->
            <div class="bg-white shadow-sm rounded-lg border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-xl font-semibold text-gray-900">Profile Information</h2>
                <p class="mt-1 text-sm text-gray-600">Update your account's profile information and email address.</p>
              </div>
              
              <form @submit.prevent="updateProfile" class="p-6 space-y-6">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <!-- Name -->
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      v-model="profileForm.name"
                      class="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <!-- Email -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      v-model="profileForm.email"
                      class="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your email address"
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
            <div class="bg-white shadow-sm rounded-lg border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-xl font-semibold text-gray-900">Change Password</h2>
                <p class="mt-1 text-sm text-gray-600">Ensure your account is using a long, random password to stay secure.</p>
              </div>
              
              <form @submit.prevent="updatePassword" class="p-6 space-y-6">
                <div class="grid grid-cols-1 gap-6">
                  <!-- Current Password -->
                  <div>
                    <label for="current-password" class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input 
                      type="password" 
                      id="current-password" 
                      v-model="passwordForm.currentPassword"
                      class="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your current password"
                      required
                    />
                  </div>

                  <!-- New Password -->
                  <div>
                    <label for="new-password" class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input 
                      type="password" 
                      id="new-password" 
                      v-model="passwordForm.newPassword"
                      class="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your new password"
                      required
                    />
                  </div>

                  <!-- Confirm New Password -->
                  <div>
                    <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input 
                      type="password" 
                      id="confirm-password" 
                      v-model="passwordForm.confirmPassword"
                      class="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Confirm your new password"
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
            <div class="bg-white shadow-sm rounded-lg border border-red-200">
              <div class="px-6 py-4 border-b border-red-200">
                <h2 class="text-xl font-semibold text-red-600">Delete Account</h2>
                <p class="mt-1 text-sm text-gray-600">Once your account is deleted, all of its resources and data will be permanently deleted.</p>
              </div>
              
              <div class="p-6">
                <div class="max-w-full text-sm text-gray-600 mb-4">
                  <p>Before deleting your account, please download any data or information that you wish to retain.</p>
                </div>
                
                <!-- Password confirmation input (appears when delete is clicked) -->
                <div v-if="showDeletePassword" class="mb-4">
                  <label for="delete-password" class="block text-sm font-medium text-gray-700 mb-2">
                    Enter your password to confirm deletion
                  </label>
                  <input 
                    type="password" 
                    id="delete-password" 
                    v-model="deletePassword"
                    class="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
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
                      class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
import Sidebar from '../components/Side_and_Top_Bar.vue'

const router = useRouter()
const sidebarHidden = ref(false)

// Form data
const profileForm = ref({
  name: '',
  email: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Loading states
const profileLoading = ref(false)
const passwordLoading = ref(false)
const deleteLoading = ref(false)

// Messages
const successMessage = ref('')
const errorMessage = ref('')

// Delete functionality
const showDeletePassword = ref(false)
const deletePassword = ref('')

// Load user data
onMounted(() => {
  try {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      profileForm.value.name = user.name || ''
      profileForm.value.email = user.email || ''
    }
  } catch (error) {
    console.error('Error loading user data:', error)
  }
})

const updateSidebarState = (state) => {
  sidebarHidden.value = state
}

const clearMessages = () => {
  successMessage.value = ''
  errorMessage.value = ''
  console.log('Messages cleared') // Debug log
}

// Update profile
const updateProfile = async () => {
  clearMessages()
  profileLoading.value = true
  
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileForm.value)
    })
    
    const data = await response.json()
    console.log('Update profile response:', data) // Debug log
    
    if (response.ok && data.success) {
      // Extract user data from the correct path in backend response
      const updatedUser = data.data.user // Backend returns data.data.user
      
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      // Trigger a custom event to notify other components of user data change
      window.dispatchEvent(new CustomEvent('userUpdated', { 
        detail: updatedUser 
      }))
      
      successMessage.value = data.message || 'Profile updated successfully!'
      
      // Scroll to top to show the success message
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      console.log('Updated user data:', updatedUser) // Debug log
      console.log('Profile success message set:', successMessage.value) // Debug log
    } else {
      errorMessage.value = data.message || 'Failed to update profile'
      
      // Scroll to top to show the error message
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      console.log('Profile error message set:', errorMessage.value) // Debug log
    }
  } catch (error) {
    console.error('Profile update error:', error)
    errorMessage.value = 'Network error. Please try again.'
    
    // Scroll to top to show the error message
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    profileLoading.value = false
  }
}

// Update password
const updatePassword = async () => {
  clearMessages()
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errorMessage.value = 'New password does not match'
    return
  }
  
  passwordLoading.value = true
  
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/user/password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      })
    })
    
    const data = await response.json()
    
    if (response.ok && data.success) {
      successMessage.value = 'Password updated successfully!'
      // Clear form
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }

      window.scrollTo({ top: 0, behavior: 'smooth' })

      setTimeout(() => {
        // Clear all user data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('remember_me')
        
        // Redirect to login
        router.push('/')
      }, 1500) // 1.5 second delay to show the success message

    } else {
      errorMessage.value = data.message || 'Failed to update password'

      window.scrollTo({ top: 0, behavior: 'smooth' })

    }
  } catch (error) {
    console.error('Password update error:', error)
    errorMessage.value = 'Network error. Please try again.'
  } finally {
    passwordLoading.value = false
  }
}

// Delete account
const deleteAccount = async () => {
  deleteLoading.value = true
  
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/user/delete', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: deletePassword.value
      })
    })
    
    const data = await response.json()
    console.log('Delete account response:', data) // Debug log
    
    if (response.ok && data.success) {
      // Clear any previous error messages first
      errorMessage.value = ''
      
      // Show success message from backend
      successMessage.value = data.message || 'Account deleted successfully!'
      
      // Hide the password input and reset form
      showDeletePassword.value = false
      deletePassword.value = ''
      
      // Scroll to top to show the success message
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      console.log('Success message set:', successMessage.value) // Debug log
      
      // Wait a moment to show the message before redirecting
      setTimeout(() => {
        // Clear all user data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('remember_me')
        
        // Redirect to login
        router.push('/')
      }, 1500) // 1.5 second delay to show the success message

    } else {
      // Clear any previous success messages first
      successMessage.value = ''
      
      errorMessage.value = data.message || 'Failed to delete account'
      showDeletePassword.value = false
      deletePassword.value = ''
      
      // Scroll to top to show the error message
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      console.log('Error message set:', errorMessage.value) // Debug log
    }
  } catch (error) {
    console.error('Account deletion error:', error)
    
    // Clear any previous success messages first
    successMessage.value = ''
    
    errorMessage.value = 'Network error. Please try again.'
    showDeletePassword.value = false
    deletePassword.value = ''
    
    // Scroll to top to show the error message
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    deleteLoading.value = false
  }
}
</script>