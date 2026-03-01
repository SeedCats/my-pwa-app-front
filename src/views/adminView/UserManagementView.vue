<template>
  <div class="min-h-screen" :class="themeClasses.background">
      <main class="px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
        <div class="py-6">
          <!-- Header -->
          <div class="flex items-start justify-between gap-3 mb-6">
            <div>
              <h1 class="text-2xl font-bold" :class="themeClasses.textPrimary">{{ $t('admin.userManagementTitle') }}</h1>
              <p class="mt-1 text-sm" :class="themeClasses.textSecondary">{{ $t('admin.userCount', { count: total }) }}</p>
            </div>
            <button
              @click="loadUsers"
              :disabled="loading"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
              :class="[
                loading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-sm',
                themeClasses.inputBackground, themeClasses.border, themeClasses.textPrimary
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5 transition-transform duration-500"
                :class="loading ? 'animate-spin' : ''"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="hidden sm:inline">{{ loading ? $t('common.loading') : $t('common.refresh') || 'Refresh' }}</span>
            </button>
          </div>

          <!-- Status Summary Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <!-- Total Patients -->
            <div class="rounded-xl border shadow-sm overflow-hidden flex flex-col" :class="[themeClasses.cardBackground, themeClasses.border]">
              <div class="h-1 bg-gray-400 dark:bg-gray-500" />
              <div class="p-4 flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-medium" :class="themeClasses.textSecondary">{{ $t('admin.patientStatusSummary') }}</p>
                  <p class="text-3xl font-extrabold leading-none mt-0.5" :class="themeClasses.textPrimary">{{ total }}</p>
                </div>
              </div>
            </div>

            <!-- On-going -->
            <div class="rounded-xl border shadow-sm overflow-hidden flex flex-col" :class="[themeClasses.cardBackground, themeClasses.border]">
              <div class="h-1 bg-amber-400" />
              <div class="p-4 flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-50 dark:bg-amber-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-medium" :class="themeClasses.textSecondary">{{ $t('admin.statusOnGoing') }}</p>
                  <p class="text-3xl font-extrabold leading-none mt-0.5 text-amber-500">{{ patientStatusStats.ongoing }}</p>
                </div>
              </div>
            </div>

            <!-- Completed -->
            <div class="rounded-xl border shadow-sm overflow-hidden flex flex-col" :class="[themeClasses.cardBackground, themeClasses.border]">
              <div class="h-1 bg-green-500" />
              <div class="p-4 flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-50 dark:bg-green-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-medium" :class="themeClasses.textSecondary">{{ $t('admin.statusCompleted') }}</p>
                  <p class="text-3xl font-extrabold leading-none mt-0.5 text-green-500">{{ patientStatusStats.completed }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="mb-4">
            <div class="relative w-full sm:w-80">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" :class="themeClasses.textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
              </svg>
              <input 
                type="text" 
                v-model="searchQuery" 
                :placeholder="$t('common.search') || 'Search by name or email...'" 
                class="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]"
              />
            </div>
          </div>

          <!-- Loading Skeleton -->
          <div v-if="loading" class="rounded-xl border shadow-sm overflow-hidden" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="p-4 space-y-4">
              <div v-for="n in 5" :key="n" class="flex items-center gap-4 animate-pulse">
                <div class="flex-1 space-y-2">
                  <div class="h-3 rounded w-1/3" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-200'" />
                  <div class="h-2.5 rounded w-1/2" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-200'" />
                </div>
                <div class="h-6 w-20 rounded-full" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-200'" />
              </div>
            </div>
          </div>

          <div v-else>
            <!-- Empty State -->
            <div v-if="filteredUsers.length === 0" class="rounded-xl border shadow-sm overflow-hidden py-16" :class="[themeClasses.cardBackground, themeClasses.border]">
              <div class="flex flex-col items-center justify-center text-center px-6">
                <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'">
                  <svg class="w-8 h-8 opacity-40" :class="themeClasses.textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p class="font-semibold mb-1" :class="themeClasses.textPrimary">{{ $t('admin.noAssignedUsers') }}</p>
                <p class="text-sm" :class="themeClasses.textSecondary">{{ searchQuery ? ($t('common.noResults') || 'No matching patients found') : '' }}</p>
              </div>
            </div>

            <!-- User Table -->
            <div v-else class="rounded-xl border shadow-sm overflow-hidden" :class="[themeClasses.cardBackground, themeClasses.border]">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b" :class="[themeClasses.border, themeClasses.background]">
                      <th class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" :class="themeClasses.textSecondary">{{ $t('admin.name') }}</th>
                      <th class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" :class="themeClasses.textSecondary">{{ $t('admin.email') }}</th>
                      <th class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell" :class="themeClasses.textSecondary">{{ $t('admin.role') }}</th>
                      <th class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider hidden xl:table-cell" :class="themeClasses.textSecondary">{{ $t('admin.id') }}</th>
                      <th class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell" :class="themeClasses.textSecondary">{{ $t('admin.created') }}</th>
                      <th class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-center" :class="themeClasses.textSecondary">{{ $t('admin.status') }}</th>
                      <th class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-right" :class="themeClasses.textSecondary">{{ $t('admin.operation') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="u in filteredUsers"
                      :key="u.id"
                      class="border-b last:border-0 transition-colors duration-150"
                      :class="[themeClasses.border, themeClasses.hoverBackground]"
                    >
                      <!-- Name + email (mobile-friendly) -->
                      <td class="px-5 py-4">
                        <div class="min-w-0">
                          <p class="text-sm font-semibold truncate" :class="themeClasses.textPrimary">{{ u.name }}</p>
                          <p class="text-xs truncate md:hidden" :class="themeClasses.textSecondary">{{ u.email }}</p>
                        </div>
                      </td>
                      <td class="px-5 py-4 hidden md:table-cell">
                        <span class="text-sm" :class="themeClasses.textSecondary">{{ u.email }}</span>
                      </td>
                      <td class="px-5 py-4 hidden lg:table-cell">
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
                              :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'">
                          {{ u.role }}
                        </span>
                      </td>
                      <td class="px-5 py-4 hidden xl:table-cell">
                        <span class="text-xs font-mono" :class="themeClasses.textSecondary">{{ u.id }}</span>
                      </td>
                      <td class="px-5 py-4 hidden lg:table-cell">
                        <span class="text-sm" :class="themeClasses.textSecondary">{{ formatDate(u.createdAt) }}</span>
                      </td>
                      <!-- Status -->
                      <td class="px-5 py-4 text-center">
                        <span :class="[
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
                          u.serviceStatusKey === 'completed'
                            ? (isDarkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-50 text-green-700')
                            : (isDarkMode ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-50 text-amber-700')
                        ]">
                          <span class="w-1.5 h-1.5 rounded-full" :class="u.serviceStatusKey === 'completed' ? 'bg-green-500' : 'bg-amber-500'" />
                          {{ u.serviceStatusKey === 'completed' ? $t('admin.statusCompleted') : $t('admin.statusOnGoing') }}
                        </span>
                      </td>
                      <!-- Actions -->
                      <td class="px-5 py-4 text-right">
                        <div class="flex items-center justify-end gap-2">
                          <button @click="goToChat(u)"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 hover:shadow-sm bg-purple-600 text-white hover:bg-purple-700">
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <span class="hidden sm:inline">{{ $t('nav.chat') }}</span>
                          </button>
                          <button @click="openOperations(u)"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 hover:shadow-sm bg-blue-600 text-white hover:bg-blue-700">
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            <span class="hidden sm:inline">{{ $t('admin.operation') }}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="flex items-center justify-between px-5 py-3.5 border-t" :class="themeClasses.border">
                <button
                  @click="prevPage"
                  :disabled="page <= 1"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  :class="[themeClasses.textPrimary, themeClasses.border, themeClasses.inputBackground, themeClasses.hoverBackground]"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  {{ $t('aiSupport.prev') }}
                </button>
                <span class="text-xs font-medium" :class="themeClasses.textSecondary">
                  {{ $t('aiSupport.showingPage', { page, total: totalPages }) }}
                </span>
                <button
                  @click="nextPage"
                  :disabled="page >= totalPages"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  :class="[themeClasses.textPrimary, themeClasses.border, themeClasses.inputBackground, themeClasses.hoverBackground]"
                >
                  {{ $t('aiSupport.next') }}
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

          </div>

          <div v-if="error" class="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">{{ error }}</div>

          <!-- Operations Modal -->
          <Transition name="modal">
            <div v-if="showOperationsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="closeOperations" />
              <div :class="['relative rounded-2xl shadow-2xl z-60 max-w-lg w-full overflow-hidden animate-fade-in', themeClasses.cardBackground, themeClasses.textPrimary, themeClasses.border, 'border']">
                <!-- Modal Header -->
                <div class="flex items-center gap-3 px-6 py-4 border-b" :class="themeClasses.border">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-base font-bold truncate" :class="themeClasses.textPrimary">{{ selectedUser ? selectedUser.name : '' }}</h3>
                    <p class="text-xs truncate" :class="themeClasses.textSecondary">{{ selectedUser ? selectedUser.email : '' }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span :class="[
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
                      (selectedUser && selectedUser.serviceStatusKey === 'completed')
                        ? (isDarkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-50 text-green-700')
                        : (isDarkMode ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-50 text-amber-700')
                    ]">
                      <span class="w-1.5 h-1.5 rounded-full" :class="(selectedUser && selectedUser.serviceStatusKey === 'completed') ? 'bg-green-500' : 'bg-amber-500'" />
                      {{ selectedUser ? (selectedUser.serviceStatusKey === 'completed' ? $t('admin.statusCompleted') : $t('admin.statusOnGoing')) : $t('admin.statusOnGoing') }}
                    </span>
                    <button @click="closeOperations" class="p-1.5 rounded-lg transition-colors" :class="isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'" aria-label="Close">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Modal Body -->
                <div class="px-6 py-5">
                  <!-- Action Buttons Grid -->
                  <p class="text-xs font-semibold uppercase tracking-widest mb-3" :class="themeClasses.textSecondary">{{ $t('admin.operation') }}</p>
                  <div class="grid grid-cols-2 gap-2.5 mb-4">
                    <button @click="viewDetails"
                      class="flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 hover:shadow-sm"
                      :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border, themeClasses.hoverBackground]"
                      :aria-label="selectedUser ? `${$t('admin.view')} ${selectedUser.name}` : $t('admin.view')">
                      <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="isDarkMode ? 'bg-gray-600' : 'bg-gray-200'">
                        <svg class="w-4 h-4" :class="themeClasses.textSecondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <span>{{ $t('admin.view') }}</span>
                    </button>

                    <button @click="goToDashboard(selectedUser)"
                      class="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 hover:shadow-sm bg-blue-600 text-white hover:bg-blue-700">
                      <div class="w-8 h-8 rounded-lg bg-blue-700/50 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3v18h18" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9h18M9 21V9" />
                        </svg>
                      </div>
                      <span>{{ $t('admin.dashboard') }}</span>
                    </button>

                    <button @click="goToUserSetting(selectedUser)"
                      class="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 hover:shadow-sm bg-indigo-600 text-white hover:bg-indigo-700">
                      <div class="w-8 h-8 rounded-lg bg-indigo-700/50 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span>{{ $t('admin.userSetting') }}</span>
                    </button>

                    <button @click="goToChat(selectedUser)"
                      class="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 hover:shadow-sm bg-purple-600 text-white hover:bg-purple-700">
                      <div class="w-8 h-8 rounded-lg bg-purple-700/50 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <span>{{ $t('nav.chat') }}</span>
                    </button>
                  </div>

                  <!-- Status Actions -->
                  <p class="text-xs font-semibold uppercase tracking-widest mb-3" :class="themeClasses.textSecondary">{{ $t('admin.status') }}</p>
                  <div class="flex gap-2.5">
                    <button @click="setOnGoingService(selectedUser)"
                      class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 hover:shadow-sm bg-amber-500 text-white hover:bg-amber-600">
                      <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5a1 1 0 112 0v4l3 2a1 1 0 11-1 1l-3-2V5z" clip-rule="evenodd" />
                      </svg>
                      {{ $t('admin.ongoingService') }}
                    </button>
                    <button @click="completeService(selectedUser)"
                      class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 hover:shadow-sm bg-green-600 text-white hover:bg-green-700">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {{ $t('admin.serviceCompletion') }}
                    </button>
                  </div>

                  <div v-if="info" :class="['mt-3 px-3 py-2 rounded-lg text-sm font-medium', (info === t('admin.serviceSetOnGoing') ? (isDarkMode ? 'bg-orange-900/20 text-orange-400' : 'bg-orange-50 text-orange-600') : (isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600'))]">{{ info }}</div>

                  <!-- Expandable Details -->
                  <Transition name="expand">
                    <div v-if="showDetails" class="mt-4 rounded-xl border p-4" :class="[themeClasses.inputBackground, themeClasses.border]">
                      <p class="text-xs font-semibold uppercase tracking-widest mb-3" :class="themeClasses.textSecondary">{{ $t('admin.view') }}</p>
                      <dl class="grid grid-cols-1 gap-2.5 text-sm">
                        <div class="flex items-center gap-2">
                          <dt class="font-medium w-20 flex-shrink-0" :class="themeClasses.textSecondary">{{ $t('admin.name') }}</dt>
                          <dd :class="themeClasses.textPrimary">{{ selectedUser ? selectedUser.name : '' }}</dd>
                        </div>
                        <div class="flex items-center gap-2">
                          <dt class="font-medium w-20 flex-shrink-0" :class="themeClasses.textSecondary">{{ $t('admin.id') }}</dt>
                          <dd class="font-mono text-xs" :class="themeClasses.textPrimary">{{ selectedUser ? selectedUser.id : '' }}</dd>
                        </div>
                        <div class="flex items-center gap-2">
                          <dt class="font-medium w-20 flex-shrink-0" :class="themeClasses.textSecondary">{{ $t('admin.role') }}</dt>
                          <dd :class="themeClasses.textPrimary">{{ selectedUser ? selectedUser.role : '' }}</dd>
                        </div>
                        <div class="flex items-center gap-2">
                          <dt class="font-medium w-20 flex-shrink-0" :class="themeClasses.textSecondary">{{ $t('admin.created') }}</dt>
                          <dd :class="themeClasses.textPrimary">{{ selectedUser ? formatDate(selectedUser.createdAt) : '' }}</dd>
                        </div>
                      </dl>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </Transition>

        </div>
      </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '../../composables/useLanguage'
import { useTheme } from '../../composables/useTheme'
import { fetchWithAuth } from '../../utils/fetchWithAuth'
const { t } = useLanguage()
const API_URL = import.meta.env.VITE_API_URL || ''


const users = ref([])
const loading = ref(true)
const error = ref('')
const page = ref(1)
const limit = ref(10) // show up to 10 users per page
const total = ref(0)
const searchQuery = ref('')

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(u => 
    (u.name && u.name.toLowerCase().includes(query)) || 
    (u.email && u.email.toLowerCase().includes(query))
  )
})

const patientStatusStats = computed(() => {
  const completed = users.value.filter(u => u.serviceStatusKey === 'completed').length
  const ongoing = users.value.filter(u => u.serviceStatusKey !== 'completed').length
  return { ongoing, completed }
})

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
        const resStatus = await fetchWithAuth(`${API_URL}/api/admin/users/${u.id}/status`, { credentials: 'include' })
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
    const res = await fetchWithAuth(`${API_URL}/api/admin/users/${user.id}/status/completed`, {
      method: 'PUT',
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

const goToChat = (user) => {
  if (!user) return
  closeOperations()
  router.push({ path: '/admin/chats', query: { userId: user.id, userName: user.name, userEmail: user.email } })
}

const setOnGoingService = async (user) => {
  if (!user) return
  if (!confirm(t('admin.confirmSetOnGoing', { email: user.email }))) return
  error.value = ''
  info.value = ''
  try {
    const res = await fetchWithAuth(`${API_URL}/api/admin/users/${user.id}/status/ongoing`, { 
      method: 'PUT', 
      credentials: 'include' 
    })

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

const { themeClasses, isDarkMode } = useTheme()

onMounted(loadUsers)
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 300px;
}
</style>
