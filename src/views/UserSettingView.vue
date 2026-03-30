<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <main class="px-3 sm:px-4 md:px-6 lg:px-8 pb-12">

      <!-- Admin banner when editing another user's settings -->
      <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
        <div v-if="isViewingOtherUser" class="mb-6 rounded-xl border shadow-sm overflow-hidden"
          :class="isDarkMode ? 'bg-indigo-900/40 border-indigo-700' : 'bg-indigo-50 border-indigo-200'">
          <div class="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                :class="isDarkMode ? 'bg-indigo-700' : 'bg-indigo-100'">
                <svg class="w-4 h-4" :class="isDarkMode ? 'text-indigo-300' : 'text-indigo-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-medium uppercase tracking-wide" :class="isDarkMode ? 'text-indigo-400' : 'text-indigo-500'">{{ $t('home.viewingUser') }}</p>
                <p class="text-sm font-semibold truncate" :class="isDarkMode ? 'text-white' : 'text-indigo-900'">
                  <template v-if="displayedUserEmail">{{ displayedUserEmail }}</template>
                  <template v-else>{{ viewedUserId }}</template>
                </p>
              </div>
            </div>
            <button @click="goBackToUserManagement"
              class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              :class="isDarkMode ? 'bg-indigo-700 hover:bg-indigo-600 text-white' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              {{ $t('home.returnToUserManagement') }}
            </button>
          </div>
        </div>
      </transition>

      <!-- Header -->
      <div class="mb-8 pt-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-full flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600 shadow-md">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold" :class="themeClasses.textPrimary">{{ $t('userSettings.title') }}</h1>
            <p class="text-sm" :class="themeClasses.textSecondary">{{ $t('userSettings.subtitle') }}</p>
          </div>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="successMessage" class="mb-6 p-4 rounded-xl border flex items-start gap-3"
          :class="isDarkMode ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-200'">
          <div class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5" :class="isDarkMode ? 'bg-green-700' : 'bg-green-200'">
            <svg class="w-3 h-3" :class="isDarkMode ? 'text-green-300' : 'text-green-700'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <p class="text-sm flex-1" :class="isDarkMode ? 'text-green-200' : 'text-green-700'">{{ successMessage }}</p>
        </div>
      </transition>

      <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="errorMessage" class="mb-6 p-4 rounded-xl border flex items-start gap-3"
          :class="isDarkMode ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-200'">
          <div class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5" :class="isDarkMode ? 'bg-red-700' : 'bg-red-200'">
            <svg class="w-3 h-3" :class="isDarkMode ? 'text-red-300' : 'text-red-700'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <p class="text-sm flex-1" :class="isDarkMode ? 'text-red-200' : 'text-red-700'">{{ errorMessage }}</p>
        </div>
      </transition>

      <div class="space-y-6">
        <!-- Profile Information -->
        <div class="shadow-sm rounded-xl border overflow-hidden" :class="[themeClasses.cardBackground, themeClasses.border]">
          <div class="px-6 py-5 border-b flex items-center gap-3" :class="themeClasses.border">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="isDarkMode ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-50 text-indigo-600'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              <h2 class="text-base sm:text-lg font-semibold" :class="themeClasses.textPrimary">{{ $t('userSettings.profile') }}</h2>
              <p class="text-xs sm:text-sm" :class="themeClasses.textSecondary">{{ $t('userSettings.profileDesc') }}</p>
            </div>
          </div>

          <form @submit.prevent="updateProfile" class="p-6 space-y-6">
            <!-- Profile Icon -->
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 p-4 rounded-xl" :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
              <div class="relative group cursor-pointer shrink-0" @click="triggerIconUpload">
                <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-90" enter-to-class="opacity-100 scale-100" mode="out-in">
                  <img v-if="profileForm.icon" :key="profileForm.icon" :src="profileForm.icon" class="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 shadow-lg transition-all duration-200" :class="isDarkMode ? 'border-gray-600' : 'border-white'" />
                  <div v-else class="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center border-2 border-dashed transition-colors duration-200" :class="[themeClasses.border, themeClasses.textSecondary, 'group-hover:border-indigo-500 group-hover:text-indigo-500']">
                    <svg class="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                </transition>
                <button type="button" class="absolute bottom-1 right-1 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg border-2 transition-all duration-200 group-hover:scale-110 group-active:scale-95" :class="isDarkMode ? 'border-gray-700' : 'border-white'">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <input type="file" ref="iconInput" class="hidden" accept="image/*" @change="onIconSelected" />
              </div>
              <div class="text-center sm:text-left">
                <h3 class="text-sm font-semibold" :class="themeClasses.textPrimary">{{ $t('userSettings.profileIcon') }}</h3>
                <p class="text-xs mt-1 leading-relaxed" :class="themeClasses.textSecondary">{{ $t('userSettings.profileIconDesc') }}</p>
                <div class="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                  <button type="button" @click="triggerIconUpload"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs font-medium rounded-lg transition-all duration-200"
                    :class="isDarkMode ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    {{ $t('userSettings.uploadIcon') }}
                  </button>
                  <button v-if="profileForm.icon" type="button" @click="removeIcon"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs font-medium rounded-lg transition-all duration-200"
                    :class="isDarkMode ? 'border-red-800 text-red-400 bg-red-900/30 hover:bg-red-900/50' : 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100'">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    {{ $t('userSettings.removeIcon') }}
                  </button>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
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

              <!-- Address (Admins Only) -->
              <div v-if="userState.user?.role === 'admin'" class="sm:col-span-2">
                <label for="address" class="block text-sm font-medium mb-2" :class="themeClasses.textPrimary">{{
                  $t('userSettings.address') || 'Address' }}</label>
                <input type="text" id="address" v-model="profileForm.address" :class="[
                  'block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200',
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                ]" :placeholder="$t('userSettings.addressPlaceholder') || 'Address'" />
              </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
              <button type="submit" :disabled="profileLoading"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md active:scale-95">
                <svg v-if="profileLoading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                {{ profileLoading ? $t('userSettings.updating') : $t('userSettings.updateProfile') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password -->
        <div class="shadow-sm rounded-xl border overflow-hidden" :class="[themeClasses.cardBackground, themeClasses.border]">
          <div class="px-6 py-5 border-b flex items-center gap-3" :class="themeClasses.border">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="isDarkMode ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-50 text-amber-600'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <div>
              <h2 class="text-base sm:text-lg font-semibold" :class="themeClasses.textPrimary">{{ $t('userSettings.changePassword') }}</h2>
              <p class="text-xs sm:text-sm" :class="themeClasses.textSecondary">{{ $t('userSettings.changePasswordDesc') }}</p>
            </div>
          </div>

          <!-- Admin notice when editing another user -->
          <div v-if="isViewingOtherUser" class="px-6 pt-4 pb-2">
            <div class="p-3 rounded-lg text-sm flex items-start gap-2"
              :class="isDarkMode ? 'bg-blue-900/50 border border-blue-700 text-blue-200' : 'bg-blue-50 border border-blue-200 text-blue-800'">
              <svg class="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span><strong>{{ $t('home.adminNote') }}:</strong> {{ $t('home.adminPasswordNote') }}</span>
            </div>
          </div>

          <form @submit.prevent="updatePassword" class="p-6 space-y-5">
            <div class="grid grid-cols-1 gap-5">
              <!-- Current Password (only shown when user is editing their own password) -->
              <div v-if="!isViewingOtherUser">
                <label for="current-password" class="block text-sm font-medium mb-2"
                  :class="themeClasses.textPrimary">{{
                    $t('userSettings.currentPassword') }}</label>
                <div class="relative">
                  <input :type="showCurrentPassword ? 'text' : 'password'" id="current-password" v-model="passwordForm.currentPassword" :class="[
                    'block w-full px-3 py-2.5 pr-10 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200',
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  ]" :placeholder="$t('userSettings.currentPasswordPlaceholder')" required />
                  <button type="button" @click="showCurrentPassword = !showCurrentPassword"
                    class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <svg v-if="!showCurrentPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  </button>
                </div>
              </div>

              <!-- New Password -->
              <div class="space-y-1.5">
                <label for="new-password" class="block text-sm font-medium" :class="themeClasses.textPrimary">{{
                  $t('userSettings.newPassword') }}</label>
                <div class="relative">
                  <input :type="showNewPassword ? 'text' : 'password'" id="new-password" v-model="passwordForm.newPassword" :class="[
                    'block w-full px-3 py-2.5 pr-10 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200',
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  ]" :placeholder="$t('userSettings.newPasswordPlaceholder')" required />
                  <button type="button" @click="showNewPassword = !showNewPassword"
                    class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <svg v-if="!showNewPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  </button>
                </div>
                <!-- Password strength indicator -->
                <div v-if="passwordForm.newPassword" class="mt-2 space-y-1">
                  <div class="flex gap-1">
                    <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-all duration-300"
                      :class="i <= passwordStrength.score ? passwordStrength.barColor : (isDarkMode ? 'bg-gray-600' : 'bg-gray-200')"></div>
                  </div>
                  <p class="text-xs font-medium" :class="passwordStrength.textColor">{{ passwordStrength.label }}</p>
                </div>
              </div>

              <!-- Confirm New Password -->
              <div class="space-y-1.5">
                <label for="confirm-password" class="block text-sm font-medium"
                  :class="themeClasses.textPrimary">{{
                    $t('userSettings.confirmNewPassword') }}</label>
                <div class="relative">
                  <input :type="showConfirmPassword ? 'text' : 'password'" id="confirm-password" v-model="passwordForm.confirmPassword" :class="[
                    'block w-full px-3 py-2.5 pr-10 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200',
                    passwordMatchState === 'match' ? 'border-green-500 focus:ring-green-500 focus:border-green-500' :
                    passwordMatchState === 'mismatch' ? 'border-red-500 focus:ring-red-500 focus:border-red-500' :
                    'focus:ring-indigo-500 focus:border-indigo-500',
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  ]" :placeholder="$t('userSettings.confirmPasswordPlaceholder')" required />
                  <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <svg v-if="!showConfirmPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  </button>
                </div>
                <transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0">
                  <p v-if="passwordMatchState === 'match'" class="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                    {{ $t('userSettings.passwordsMatch') }}
                  </p>
                  <p v-else-if="passwordMatchState === 'mismatch'" class="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    {{ $t('userSettings.passwordsDoNotMatch') }}
                  </p>
                </transition>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
              <button type="submit" :disabled="passwordLoading"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md active:scale-95">
                <svg v-if="passwordLoading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                {{ passwordLoading ? $t('userSettings.updating') : $t('userSettings.updatePassword') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Delete Account -->
        <div class="shadow-sm rounded-xl border overflow-hidden"
          :class="isDarkMode ? 'bg-gray-800 border-red-800' : 'bg-white border-red-200'">
          <div class="px-6 py-5 border-b flex items-center gap-3" :class="isDarkMode ? 'border-red-800' : 'border-red-200'">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="isDarkMode ? 'bg-red-900/60 text-red-400' : 'bg-red-50 text-red-600'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <div>
              <h2 class="text-base sm:text-lg font-semibold text-red-600">{{ $t('userSettings.deleteAccount') }}</h2>
              <p class="text-xs sm:text-sm" :class="themeClasses.textSecondary">{{ $t('userSettings.deleteAccountWarning') }}</p>
            </div>
          </div>

          <div class="p-6">
            <!-- Admin warning when trying to delete own account -->
<div v-if="userState.user && userState.user.role === 'admin' && !isViewingOtherUser" class="space-y-4">
                <div class="flex items-start gap-3 p-4 rounded-xl border"
                  :class="isDarkMode ? 'bg-red-900/40 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-800'">
                  <svg class="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <strong class="text-sm">{{ $t('userSettings.adminCannotDeleteSelf') }}</strong>
                </div>
                
                <!-- Contact System Owner Button -->
                <button
                    @click="openContactOwnerModal"
                  class="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-xl transition-all shadow-sm active:scale-95"
                  :class="isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-600 hover:bg-indigo-700'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  {{ $t('userSettings.contactSystemOwner') || 'Contact System Owner' }}
                </button>
            </div>

            <div v-else class="space-y-4">
              <div class="flex items-start gap-3 p-4 rounded-xl border"
                :class="isDarkMode ? 'bg-red-900/20 border-red-900 text-red-300' : 'bg-red-50 border-red-100 text-red-700'">
                <svg class="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p class="text-sm">{{ $t('userSettings.deleteAccountDesc') }}</p>
              </div>

              <!-- Password confirmation input -->
              <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
                <div v-if="showDeletePassword && !isViewingOtherUser">
                  <label for="delete-password" class="block text-sm font-medium mb-2" :class="themeClasses.textPrimary">
                    {{ $t('userSettings.enterPasswordToConfirmDeletion') }}
                  </label>
                  <div class="relative">
                    <input :type="showDeletePasswordField ? 'text' : 'password'" id="delete-password" v-model="deletePassword" :class="[
                      'block w-full px-3 py-2.5 pr-10 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200',
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    ]" :placeholder="$t('userSettings.enterPasswordToConfirmDeletion')" @keyup.enter="deleteAccount" />
                    <button type="button" @click="showDeletePasswordField = !showDeletePasswordField"
                      class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <svg v-if="!showDeletePasswordField" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    </button>
                  </div>
                </div>
              </transition>

              <div class="flex flex-wrap gap-3">
                <button
                  v-if="!showDeletePassword && !(userState.user && userState.user.role === 'admin' && !isViewingOtherUser)"
                  @click="showDeletePassword = true"
                  class="inline-flex items-center gap-2 px-4 py-2.5 border text-sm font-medium rounded-xl transition-all duration-200 active:scale-95"
                  :class="isDarkMode ? 'border-red-800 text-red-400 bg-red-900/30 hover:bg-red-900/50' : 'border-red-200 text-red-700 bg-red-50 hover:bg-red-100'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  {{ $t('userSettings.deleteAccount') }}
                </button>

                <template v-if="showDeletePassword">
                  <button @click="deleteAccount"
                    :disabled="deleteLoading || (!isViewingOtherUser && !deletePassword.trim())"
                    class="inline-flex items-center gap-2 px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95">
                    <svg v-if="deleteLoading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    {{ deleteLoading ? $t('userSettings.deleting') : $t('userSettings.confirmDelete') }}
                  </button>

                  <button @click="showDeletePassword = false; deletePassword = ''"
                    class="inline-flex items-center gap-2 px-4 py-2.5 border text-sm font-medium rounded-xl focus:outline-none transition-all duration-200 active:scale-95"
                    :class="isDarkMode ? 'border-red-800 text-red-400 bg-red-900/30 hover:bg-red-900/50' : 'border-red-200 text-red-700 bg-red-50 hover:bg-red-100'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    {{ $t('common.cancel') }}
                  </button>
                </template>
              </div>
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

      <!-- Contact System Owner Modal -->
      <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showContactOwnerModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div class="w-full max-w-md rounded-2xl shadow-xl overflow-hidden" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
            <div class="px-6 py-4 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
              <h3 class="text-lg font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">{{ $t('userSettings.contactOwnerModalTitle') || 'Message System Owner' }}</h3>
              <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ $t('userSettings.contactOwnerModalSubtitle') || 'Send a direct message to the system owner.' }}</p>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1.5" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">{{ $t('userSettings.name') || 'Name' }} <span class="text-red-500">*</span></label>
                <input v-model="contactOwnerForm.name" type="text"
                  class="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                  :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'" required />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">{{ $t('userSettings.email') || 'Email' }} <span class="text-red-500">*</span></label>
                <input v-model="contactOwnerForm.email" type="email"
                  class="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                  :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'" required />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">{{ $t('userSettings.subject') || 'Subject' }} <span class="text-red-500">*</span></label>
                <input v-model="contactOwnerForm.subject" type="text"
                  class="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                  :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'" required />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">{{ $t('userSettings.contactMessageLabel') || 'Message' }} <span class="text-red-500">*</span></label>
                <textarea v-model="contactOwnerForm.message" rows="4"
                  :placeholder="$t('userSettings.contactMessagePlaceholder') || 'Type your message here...'"
                  class="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all resize-none"
                  :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'" required></textarea>
              </div>
            </div>
            <div class="px-6 py-4 border-t flex justify-end gap-3" :class="isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'">
              <button @click="showContactOwnerModal = false" :disabled="isSendingContactModal" class="px-4 py-2 text-sm font-medium rounded-xl transition-all" :class="isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'">
                {{ $t('common.cancel') }}
              </button>
              <button @click="submitContactOwner" :disabled="!isContactOwnerFormValid || isSendingContactModal"
                class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="isSendingContactModal" class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                {{ isSendingContactModal ? ($t('userSettings.sending') || 'Sending...') : ($t('userSettings.send') || 'Send Message') }}
              </button>
            </div>
          </div>
        </div>
      </transition>    </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTheme } from '../composables/useTheme'
import { getUserById, updateUserById, deleteUserById, updateUserPasswordById } from '../services/adminService'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const route = useRoute()
const userState = useUserStore()
const { isDarkMode, themeClasses } = useTheme()
const { t } = useI18n()
const API_URL = import.meta.env.VITE_API_URL || ''

// State
const profileForm = ref({ name: '', email: '', icon: '', address: '' })
const targetUserId = ref(null)
const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })

// Password visibility toggles
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const showDeletePasswordField = ref(false)

// Password strength computed
const passwordStrength = computed(() => {
  const pw = passwordForm.value.newPassword
  if (!pw) return { score: 0, label: '', barColor: '', textColor: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const meta = [
    { label: t('userSettings.passwordStrengthWeak'), barColor: 'bg-red-500', textColor: 'text-red-500 dark:text-red-400' },
    { label: t('userSettings.passwordStrengthFair'), barColor: 'bg-yellow-500', textColor: 'text-yellow-500 dark:text-yellow-400' },
    { label: t('userSettings.passwordStrengthStrong'), barColor: 'bg-blue-500', textColor: 'text-blue-500 dark:text-blue-400' },
    { label: t('userSettings.passwordStrengthVeryStrong'), barColor: 'bg-green-500', textColor: 'text-green-500 dark:text-green-400' },
  ]
  const m = meta[Math.max(0, score - 1)]
  return { score, ...m }
})

// Password match state
const passwordMatchState = computed(() => {
  const np = passwordForm.value.newPassword
  const cp = passwordForm.value.confirmPassword
  if (!cp) return 'idle'
  return np === cp ? 'match' : 'mismatch'
})

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
const scrollToTop = () => {
  const container = document.getElementById('main-scroll-container');
  if (container) {
    container.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

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
        const updatedUser = data.data?.user || data.data || data || {}
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }))
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

// Contact System Owner Modal
const showContactOwnerModal = ref(false)
const contactOwnerForm = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})
const isSendingContactModal = ref(false)

const isContactOwnerFormValid = computed(() => {
  return contactOwnerForm.value.name.trim() && 
         contactOwnerForm.value.email.trim() && 
         contactOwnerForm.value.subject.trim() && 
         contactOwnerForm.value.message.trim()
})

const openContactOwnerModal = () => {
  contactOwnerForm.value.name = userState.user?.name || userState.user?.email || 'Admin'
  contactOwnerForm.value.email = userState.user?.email || ''
  contactOwnerForm.value.subject = ''
  contactOwnerForm.value.message = ''
  showContactOwnerModal.value = true
}

const submitContactOwner = async () => {
  if (!isContactOwnerFormValid.value) return

  isSendingContactModal.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await fetch(`${API_URL}/api/provider/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(contactOwnerForm.value)
    })

    const data = await response.json().catch(() => null)
    if (response.ok && data?.success) {
      successMessage.value = t('userSettings.contactSuccess') || 'Message sent successfully!'
      showContactOwnerModal.value = false
      contactOwnerForm.value.message = ''
      scrollToTop()
    } else {
      errorMessage.value = data?.message || t('userSettings.contactFailed') || 'Failed to send message.'
      scrollToTop()
    }
  } catch (error) {
    errorMessage.value = t('auth.networkError') || 'Network error. Please try again.'
    scrollToTop()
  } finally {
    isSendingContactModal.value = false
  }
}
</script>