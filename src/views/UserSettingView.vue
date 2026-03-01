<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <main class="px-3 sm:px-4 md:px-6 lg:px-8 pb-8">

      <!-- Admin banner when editing another user's settings -->
      <div v-if="isViewingOtherUser" class="mb-4 p-3 rounded-md text-sm"
        :class="[themeClasses.border, isDarkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-900']">
        <div class="flex items-center justify-between">
          <div>
            <strong class="mr-2">{{ $t('home.viewingUser') }}</strong>
            <span>
              <template v-if="displayedUserEmail">{{ displayedUserEmail }}</template> <template v-else>{{ viewedUserId
                }}</template>
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button @click="goBackToUserManagement" class="underline text-sm">{{ $t('home.returnToUserManagement')
              }}</button>
          </div>
        </div>
      </div>

      <!-- Header -->
      <div class="mb-8 pt-4">
        <h1 class="text-3xl font-bold" :class="themeClasses.textPrimary">{{ $t('userSettings.title') }}</h1>
        <p class="mt-2 text-sm" :class="themeClasses.textSecondary">{{ $t('userSettings.subtitle') }}</p>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="mb-6 p-4 rounded-lg"
        :class="isDarkMode ? 'bg-green-900 border border-green-700' : 'bg-green-50 border border-green-200'">
        <p class="text-sm" :class="isDarkMode ? 'text-green-200' : 'text-green-600'">{{ successMessage }}</p>
      </div>

      <div v-if="errorMessage" class="mb-6 p-4 rounded-lg"
        :class="isDarkMode ? 'bg-red-900 border border-red-700' : 'bg-red-50 border border-red-200'">
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
            <!-- Profile Icon -->
            <div class="flex items-center gap-6 mb-6">
              <div class="relative group cursor-pointer" @click="triggerIconUpload">
                <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-90" enter-to-class="opacity-100 scale-100" mode="out-in">
                  <img v-if="profileForm.icon" :key="profileForm.icon" :src="profileForm.icon" class="w-24 h-24 rounded-full object-cover border-2 shadow-sm transition-all duration-200 group-hover:brightness-75" :class="themeClasses.border" />
                  <div v-else class="w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed transition-colors duration-200" :class="[themeClasses.border, themeClasses.textSecondary, 'group-hover:border-indigo-500 group-hover:text-indigo-500']">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                </transition>
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full bg-black/30">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <button type="button" class="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full shadow-md transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <input type="file" ref="iconInput" class="hidden" accept="image/*" @change="onIconSelected" />
              </div>
              <div>
                <h3 class="text-sm font-medium" :class="themeClasses.textPrimary">{{ $t('userSettings.profileIcon') || 'Profile Icon' }}</h3>
                <p class="text-xs mt-1" :class="themeClasses.textSecondary">{{ $t('userSettings.profileIconDesc') || 'Upload a picture to personalize your profile.' }}</p>
                <button v-if="profileForm.icon" type="button" @click="removeIcon" class="mt-3 inline-flex items-center px-3 py-1.5 border border-red-200 text-xs font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/50">
                  <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  {{ $t('userSettings.removeIcon') || 'Remove Icon' }}
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- Name -->
              <div>
                <label for="name" class="block text-sm font-medium mb-2" :class="themeClasses.textPrimary">{{
                  $t('userSettings.name') }}</label>
                <input type="text" id="name" v-model="profileForm.name" :class="[
                  'block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200',
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                ]" :placeholder="$t('userSettings.namePlaceholder')" required />
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium mb-2" :class="themeClasses.textPrimary">{{
                  $t('userSettings.email') }}</label>
                <input type="email" id="email" v-model="profileForm.email" :class="[
                  'block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200',
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                ]" :placeholder="$t('userSettings.emailPlaceholder')" required />
              </div>
            </div>

            <!-- Address (admin only) -->
            <div v-if="showAddressField">
              <label for="address" class="block text-sm font-medium mb-2" :class="themeClasses.textPrimary">{{
                $t('userSettings.address') }}</label>
              <input type="text" id="address" v-model="profileForm.address" :class="[
                'block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200',
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
              ]" :placeholder="$t('userSettings.addressPlaceholder')" />
            </div>

            <div class="flex justify-end pt-4">
              <button type="submit" :disabled="profileLoading"
                class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105">
                <svg v-if="profileLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                {{ profileLoading ? $t('userSettings.updating') : $t('userSettings.updateProfile') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password -->
        <div class="shadow-sm rounded-lg border" :class="[themeClasses.cardBackground, themeClasses.border]">
          <div class="px-6 py-4 border-b" :class="themeClasses.border">
            <h2 class="text-xl font-semibold" :class="themeClasses.textPrimary">{{ $t('userSettings.changePassword') }}
            </h2>
            <p class="mt-1 text-sm" :class="themeClasses.textSecondary">{{ $t('userSettings.changePasswordDesc') }}</p>
          </div>

          <!-- Admin notice when editing another user -->
          <div v-if="isViewingOtherUser" class="px-6 pt-4 pb-2">
            <div class="p-3 rounded-md text-sm"
              :class="isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-900'">
              <strong>{{ $t('home.adminNote') }}:</strong> {{ $t('home.adminPasswordNote') }}
            </div>
          </div>

          <form @submit.prevent="updatePassword" class="p-6 space-y-6">
            <div class="grid grid-cols-1 gap-6">
              <!-- Current Password (only shown when user is editing their own password) -->
              <div v-if="!isViewingOtherUser">
                <label for="current-password" class="block text-sm font-medium mb-2"
                  :class="themeClasses.textPrimary">{{
                    $t('userSettings.currentPassword') }}</label>
                <input type="password" id="current-password" v-model="passwordForm.currentPassword" :class="[
                  'block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200',
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                ]" :placeholder="$t('userSettings.currentPasswordPlaceholder')" required />
              </div>

              <!-- New Password -->
              <div>
                <label for="new-password" class="block text-sm font-medium mb-2" :class="themeClasses.textPrimary">{{
                  $t('userSettings.newPassword') }}</label>
                <input type="password" id="new-password" v-model="passwordForm.newPassword" :class="[
                  'block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200',
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                ]" :placeholder="$t('userSettings.newPasswordPlaceholder')" required />
              </div>

              <!-- Confirm New Password -->
              <div>
                <label for="confirm-password" class="block text-sm font-medium mb-2"
                  :class="themeClasses.textPrimary">{{
                    $t('userSettings.confirmNewPassword') }}</label>
                <input type="password" id="confirm-password" v-model="passwordForm.confirmPassword" :class="[
                  'block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200',
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                ]" :placeholder="$t('userSettings.confirmPasswordPlaceholder')" required />
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <button type="submit" :disabled="passwordLoading"
                class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105">
                <svg v-if="passwordLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                {{ passwordLoading ? $t('userSettings.updating') : $t('userSettings.updatePassword') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Delete Account -->
        <div class="shadow-sm rounded-lg border"
          :class="isDarkMode ? 'bg-gray-800 border-red-600' : 'bg-white border-red-200'">
          <div class="px-6 py-4 border-b" :class="isDarkMode ? 'border-red-600' : 'border-red-200'">
            <h2 class="text-xl font-semibold text-red-600">{{ $t('userSettings.deleteAccount') }}</h2>
            <p class="mt-1 text-sm" :class="themeClasses.textSecondary">{{ $t('userSettings.deleteAccountWarning') }}
            </p>
          </div>

          <div class="p-6">
            <!-- Admin warning when trying to delete own account -->
            <div v-if="userState.user && userState.user.role === 'admin' && !isViewingOtherUser"
              class="mb-4 p-3 rounded-md text-sm"
              :class="isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-900'">
              <strong>{{ $t('userSettings.adminCannotDeleteSelf') }}</strong>
            </div>

            <div v-else class="max-w-full text-sm mb-4" :class="themeClasses.textSecondary">
              <p>{{ $t('userSettings.deleteAccountDesc') }}</p>
            </div>

            <!-- Password confirmation input (appears when delete is clicked and user is not admin viewing other user) -->
            <div v-if="showDeletePassword && !isViewingOtherUser" class="mb-4">
              <label for="delete-password" class="block text-sm font-medium mb-2" :class="themeClasses.textPrimary">
                {{ $t('userSettings.enterPasswordToConfirmDeletion') }}
              </label>
              <input type="password" id="delete-password" v-model="deletePassword" :class="[
                'block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200',
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
              ]" :placeholder="$t('userSettings.enterPasswordToConfirmDeletion')" @keyup.enter="deleteAccount" />
            </div>

            <div class="flex gap-3">
              <button
                v-if="!showDeletePassword && !(userState.user && userState.user.role === 'admin' && !isViewingOtherUser)"
                @click="showDeletePassword = true"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                {{ $t('userSettings.deleteAccount') }}
              </button>

              <template v-if="showDeletePassword">
                <button @click="deleteAccount"
                  :disabled="deleteLoading || (!isViewingOtherUser && !deletePassword.trim())"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg v-if="deleteLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  {{ deleteLoading ? $t('userSettings.deleting') : $t('userSettings.confirmDelete') }}
                </button>

                <button @click="showDeletePassword = false; deletePassword = ''"
                  class="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  :class="isDarkMode ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'">
                  {{ $t('common.close') }}
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Cropper Modal -->
    <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showCropper" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col transform transition-all" style="height: 80vh; max-height: 800px;">
          <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center shrink-0">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('userSettings.cropImage') || 'Crop Image' }}</h3>
            <button @click="cancelCrop" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="flex-1 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
            <div class="relative w-full h-full flex items-center justify-center"
                 @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag" @mouseleave="endDrag"
                 @touchstart="startDrag" @touchmove="onDrag" @touchend="endDrag"
                 @wheel.prevent="onZoom">
              <img ref="cropImageRef" :src="cropImageUrl" class="max-w-none absolute cursor-move transition-transform duration-75" 
                   :style="{ left: '50%', top: '50%', transform: `translate(-50%, -50%) translate(${cropX}px, ${cropY}px) scale(${cropZoom})` }" draggable="false" />
              <div class="absolute inset-0 pointer-events-none" style="box-shadow: 0 0 0 9999px rgba(0,0,0,0.5); border-radius: 50%; width: 300px; height: 300px; left: 50%; top: 50%; transform: translate(-50%, -50%); border: 2px solid white;"></div>
            </div>
          </div>
          <div class="p-4 border-t dark:border-gray-700 flex justify-between items-center shrink-0">
            <div class="flex items-center gap-2">
              <button @click="cropZoom = Math.max(0.1, cropZoom - 0.1)" class="p-1.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
              </button>
              <input type="range" min="0.1" max="3" step="0.05" v-model.number="cropZoom" class="w-24 accent-indigo-600" />
              <button @click="cropZoom = Math.min(3, cropZoom + 0.1)" class="p-1.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
            <div class="flex gap-2">
              <button @click="cancelCrop" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors">{{ $t('common.cancel') || 'Cancel' }}</button>
              <button @click="applyCrop" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">{{ $t('common.apply') || 'Apply' }}</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import { getUserById, updateUserById, deleteUserById, updateUserPasswordById } from '../services/adminService'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const route = useRoute()
const userState = useUserStore()
const { isDarkMode, themeClasses } = useTheme()
const API_URL = import.meta.env.VITE_API_URL || ''

// State
const profileForm = ref({ name: '', email: '', icon: '', address: '' })
const targetUserId = ref(null)
const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })

// Cropper State
const iconInput = ref(null)
const showCropper = ref(false)
const cropImageUrl = ref('')
const cropImageRef = ref(null)
const cropX = ref(0)
const cropY = ref(0)
const cropZoom = ref(1)
let isDragging = false
let startDragX = 0
let startDragY = 0
let startCropX = 0
let startCropY = 0

// For admin viewing another user: keep the loaded user separate from the editable form
const viewedUserData = ref(null)

const displayedUserEmail = computed(() => {
  // When an admin is viewing another user, show the saved email (not the live edit buffer)
  if (isViewingOtherUser.value) {
    return viewedUserData.value?.email || viewedUserEmail.value || viewedUserId.value
  }
  // When viewing self, show the live form value (so changes reflect immediately)
  return profileForm.value.email || viewedUserEmail.value || viewedUserId.value
})

// Computed property to check if viewing another user (similar to HomeView)
const isCurrentUserAdmin = computed(() => userState.user?.role === 'admin')
const viewedUserIsAdmin = computed(() => viewedUserData.value?.role === 'admin')
// Show address field only for admins: when viewing self (is admin) or viewing another admin user
const showAddressField = computed(() => {
  if (!isCurrentUserAdmin.value) return false
  if (!isViewingOtherUser.value) return true   // admin editing own profile
  return viewedUserIsAdmin.value                // admin editing another admin
})
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
      profileForm.value = { name: user.name || '', email: user.email || '', icon: user.icon || '', address: user.address || '' }
      // If no explicit targetUserId set above, set it to the current user's id
      if (!targetUserId.value && user.id) targetUserId.value = user.id

      // If an admin is viewing another user's settings, keep the loaded user separate
      if (isViewingOtherUser.value && userState.user && userState.user.role === 'admin') {
        viewedUserData.value = user
      } else {
        // viewing self or no special view: clear viewedUserData so banner reflects live form
        viewedUserData.value = null
      }
    }
  } catch (err) {
    console.error('Failed to load user data:', err)
  }
}

const goBackToUserManagement = () => {
  router.push({ name: 'UserManagement' })
}

onMounted(loadUserData)

const clearMessages = () => { successMessage.value = ''; errorMessage.value = '' }
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const updateProfile = async () => {
  clearMessages()
  profileLoading.value = true

  try {
    // Admin editing another user's profile
    if (targetUserId.value && userState.user && userState.user.role === 'admin' && String(targetUserId.value) !== String(userState.user?.id)) {
      const data = await updateUserById(targetUserId.value, profileForm.value)
      if (data && data.success) {
        // Sync the saved user data with the viewing buffer so the banner updates only on success
        const updatedUser = data?.data?.user || data?.user || data
        if (updatedUser) {
          viewedUserData.value = updatedUser
          profileForm.value = { name: updatedUser.name || '', email: updatedUser.email || '', icon: updatedUser.icon || '', address: updatedUser.address || '' }
        }
        successMessage.value = data.message || 'Profile updated successfully!'
      } else {
        errorMessage.value = data?.message || 'Failed to update profile'
      }
      scrollToTop()
      return
    }

    // Regular user updating own profile
    const response = await fetch(`${API_URL}/api/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(profileForm.value)
    })

    const data = await response.json()

    if (response.ok && data.success) {
      const updatedUser = data.data?.user || data.data || data
      if (updatedUser) profileForm.value = { name: updatedUser.name || '', email: updatedUser.email || '', icon: updatedUser.icon || '', address: updatedUser.address || '' }
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

// Cropper Methods
const triggerIconUpload = () => {
  iconInput.value?.click()
}

const onIconSelected = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    cropImageUrl.value = e.target.result
    cropX.value = 0
    cropY.value = 0
    cropZoom.value = 1
    showCropper.value = true
  }
  reader.readAsDataURL(file)
  
  if (iconInput.value) iconInput.value.value = ''
}

const startDrag = (e) => {
  isDragging = true
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  startDragX = clientX
  startDragY = clientY
  startCropX = cropX.value
  startCropY = cropY.value
}

const onDrag = (e) => {
  if (!isDragging) return
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  cropX.value = startCropX + (clientX - startDragX)
  cropY.value = startCropY + (clientY - startDragY)
}

const endDrag = () => {
  isDragging = false
}

const onZoom = (e) => {
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  cropZoom.value = Math.max(0.1, Math.min(3, cropZoom.value + delta))
}

const cancelCrop = () => {
  showCropper.value = false
  cropImageUrl.value = ''
}

const applyCrop = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const size = 300
  canvas.width = size
  canvas.height = size
  
  const img = cropImageRef.value
  if (!img) return
  
  ctx.clearRect(0, 0, size, size)
  ctx.translate(size / 2, size / 2)
  ctx.translate(cropX.value, cropY.value)
  ctx.scale(cropZoom.value, cropZoom.value)
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
  
  profileForm.value.icon = canvas.toDataURL('image/jpeg', 0.9)
  showCropper.value = false
}

const removeIcon = () => {
  profileForm.value.icon = ''
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
    // Admin editing another user's password
    if (targetUserId.value && userState.user && userState.user.role === 'admin' && String(targetUserId.value) !== String(userState.user?.id)) {
      const data = await updateUserPasswordById(targetUserId.value, passwordForm.value.newPassword)
      if (data && data.success) {
        // Clear the password form
        passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
        successMessage.value = data.message || 'Password updated successfully!'
      } else {
        errorMessage.value = data?.message || 'Failed to update password'
      }
      scrollToTop()
      passwordLoading.value = false
      return
    }

    // Regular user updating own password
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
  // Prevent admin from deleting themselves
  if (userState.user && userState.user.role === 'admin' && !isViewingOtherUser.value) {
    errorMessage.value = 'Admins cannot delete their own account'
    scrollToTop()
    return
  }

  deleteLoading.value = true

  try {
    // If admin is viewing another user, call admin delete endpoint
    if (isViewingOtherUser.value && userState.user && userState.user.role === 'admin' && targetUserId.value) {
      const data = await deleteUserById(targetUserId.value)
      if (data && data.success) {
        errorMessage.value = ''
        successMessage.value = data.message || 'User deleted successfully!'
        showDeletePassword.value = false
        deletePassword.value = ''
        scrollToTop()
        setTimeout(() => router.push({ name: 'UserManagement' }), 1500)
      } else {
        successMessage.value = ''
        errorMessage.value = data?.message || 'Failed to delete user'
        scrollToTop()
      }
      deleteLoading.value = false
      return
    }

    // Regular user delete self
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