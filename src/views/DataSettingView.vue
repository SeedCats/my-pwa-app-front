<template>
    <div class="min-h-screen" :class="themeClasses.background">
        <main class="px-3 sm:px-4 md:px-6 lg:px-8 pb-10">

            <!-- Admin viewing banner -->
            <transition name="slide-down">
                <div v-if="isViewingOtherUser"
                    class="mt-4 mb-2 p-3 rounded-xl text-sm flex items-center justify-between gap-3 border shadow-sm"
                    :class="isDarkMode ? 'bg-blue-950/60 border-blue-800 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-900'">
                    <div class="flex items-center gap-2 min-w-0">
                        <svg class="w-4 h-4 shrink-0 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                        </svg>
                        <span class="font-semibold truncate">{{ $t('home.viewingUser') }}</span>
                        <span class="truncate opacity-80">{{ route.query.userEmail || viewedUserId }}</span>
                    </div>
                    <button @click="goBackToReferrer"
                        class="shrink-0 text-xs font-medium px-3 py-1 rounded-lg transition-colors"
                        :class="isDarkMode ? 'bg-blue-800/60 hover:bg-blue-700/60 text-blue-200' : 'bg-blue-200 hover:bg-blue-300 text-blue-900'">
                        {{ $t('home.returnToDashboard') }}
                    </button>
                </div>
            </transition>

            <!-- Page Header -->
            <div class="pt-6 mb-7">
                <div class="flex items-center gap-3 mb-1">
                    <div class="p-2 rounded-xl" :class="isDarkMode ? 'bg-blue-900/40' : 'bg-blue-100'">
                        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold leading-tight" :class="themeClasses.textPrimary">
                            {{ $t('dataSettings.title') }}
                        </h1>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                <!-- ═══════════ BMI Card ═══════════ -->
                <div class="rounded-2xl shadow-sm border"
                    :class="[themeClasses.cardBackground, themeClasses.border]">

                    <!-- Card header -->
                    <div class="px-6 pt-5 pb-4 border-b flex items-center justify-between"
                        :class="themeClasses.border">
                        <div class="flex items-center gap-3">
                            <div class="p-2 rounded-lg" :class="isDarkMode ? 'bg-emerald-900/40' : 'bg-emerald-100'">
                                <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-base font-semibold leading-tight" :class="themeClasses.textPrimary">
                                    {{ $t('dataSettings.bmiInfo') }}
                                </h2>
                                <p class="text-xs mt-0.5" :class="themeClasses.textSecondary">
                                    {{ $t('dataSettings.bmiSubtitle') }}
                                </p>
                            </div>
                        </div>
                        <span v-if="isUpdateMode"
                            class="shrink-0 text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            {{ $t('dataSettings.existingData') }}
                        </span>
                    </div>

                    <div class="px-6 py-5 space-y-5">

                        <!-- Loading skeleton -->
                        <div v-if="isLoadingData" class="flex items-center gap-3 py-3">
                            <svg class="animate-spin h-5 w-5 text-blue-500 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            <span class="text-sm" :class="themeClasses.textSecondary">{{ $t('dataSettings.loadingData') }}</span>
                        </div>

                        <!-- Input fields -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <!-- Age -->
                            <div class="space-y-1">
                                <label class="block text-xs font-semibold uppercase tracking-wide" :class="themeClasses.textSecondary">
                                    {{ $t('dataSettings.age') }}
                                </label>
                                <div class="relative">
                                    <span class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" :class="themeClasses.textSecondary">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </span>
                                    <input v-model="bmiForm.age" type="number"
                                        :placeholder="$t('dataSettings.enterAge')"
                                        class="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 no-spinner min-w-0"
                                        :class="[themeClasses.cardBackground, themeClasses.border, isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400']"/>
                                </div>
                            </div>
                            <!-- Height -->
                            <div class="space-y-1">
                                <label class="block text-xs font-semibold uppercase tracking-wide" :class="themeClasses.textSecondary">
                                    {{ $t('dataSettings.height') }}
                                </label>
                                <div class="relative">
                                    <span class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" :class="themeClasses.textSecondary">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m-4 8h10M7 20h10"/>
                                        </svg>
                                    </span>
                                    <input v-model="bmiForm.height" type="number"
                                        :placeholder="$t('dataSettings.enterHeight')"
                                        class="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 no-spinner min-w-0"
                                        :class="[themeClasses.cardBackground, themeClasses.border, isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400']"/>
                                </div>
                            </div>
                            <!-- Weight -->
                            <div class="space-y-1">
                                <label class="block text-xs font-semibold uppercase tracking-wide" :class="themeClasses.textSecondary">
                                    {{ $t('dataSettings.weight') }}
                                </label>
                                <div class="relative">
                                    <span class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" :class="themeClasses.textSecondary">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                                        </svg>
                                    </span>
                                    <input v-model="bmiForm.weight" type="number"
                                        :placeholder="$t('dataSettings.enterWeight')"
                                        class="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 no-spinner min-w-0"
                                        :class="[themeClasses.cardBackground, themeClasses.border, isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400']"/>
                                </div>
                            </div>
                        </div>

                        <!-- BMI Result Display -->
                        <transition name="bmi-result">
                            <div v-if="calculatedBMI"
                                class="rounded-xl p-4 border"
                                :class="isDarkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-50 border-gray-200'">
                                <div class="flex items-center gap-4">
                                    <!-- SVG Arc Gauge -->
                                    <div class="shrink-0 relative w-20 h-20">
                                        <svg viewBox="0 0 100 60" class="w-full" fill="none">
                                            <!-- Track arc -->
                                            <path d="M 10 55 A 40 40 0 0 1 90 55" stroke-width="10"
                                                :stroke="isDarkMode ? '#374151' : '#e5e7eb'" stroke-linecap="round"/>
                                            <!-- Value arc -->
                                            <path d="M 10 55 A 40 40 0 0 1 90 55" stroke-width="10"
                                                :stroke="bmiArcColor"
                                                stroke-linecap="round"
                                                stroke-dasharray="125.6"
                                                :stroke-dashoffset="bmiArcOffset"
                                                class="bmi-arc-transition"/>
                                        </svg>
                                        <div class="absolute inset-0 flex flex-col items-center justify-end pb-1">
                                            <span class="text-xl font-bold leading-none" :class="themeClasses.textPrimary">{{ calculatedBMI }}</span>
                                        </div>
                                    </div>
                                    <!-- Category info -->
                                    <div class="min-w-0">
                                        <p class="text-xs font-medium mb-1" :class="themeClasses.textSecondary">{{ $t('dataSettings.yourBMI') }}</p>
                                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"
                                            :class="bmiCategoryBadge">
                                            <span class="w-2 h-2 rounded-full" :class="bmiDotColor"></span>
                                            {{ bmiCategoryKey ? $t(`home.bmi.categories.${bmiCategoryKey}`) : bmiCategory }}
                                        </span>
                                        <!-- Mini scale labels -->
                                        <div class="flex gap-3 mt-2">
                                            <span v-for="seg in bmiSegments" :key="seg.key"
                                                class="text-xs" :class="seg.color">
                                                {{ $t(`home.bmi.categories.${seg.key}`) }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </transition>

                        <!-- Status message -->
                        <transition name="fade">
                            <div v-if="submitStatus"
                                class="flex items-start gap-2.5 p-3 rounded-xl text-sm"
                                :class="submitStatus.type === 'success'
                                    ? isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-800 border border-green-200'
                                    : isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-800 border border-red-200'">
                                <svg v-if="submitStatus.type === 'success'" class="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                                <svg v-else class="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                </svg>
                                <span>{{ submitStatus.message }}</span>
                            </div>
                        </transition>

                        <!-- Save / Update Button -->
                        <button @click="submitBMIData" :disabled="isLoading || !calculatedBMI"
                            class="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2"
                            :class="isLoading || !calculatedBMI
                                ? 'bg-gray-400 cursor-not-allowed'
                                : isUpdateMode
                                    ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-[.98] shadow-sm hover:shadow-md focus:ring-emerald-500'
                                    : 'bg-blue-600 hover:bg-blue-700 active:scale-[.98] shadow-sm hover:shadow-md focus:ring-blue-500'">
                            <svg v-if="isLoading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            <svg v-else-if="isUpdateMode" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                            </svg>
                            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                            </svg>
                            {{ isLoading
                                ? (isUpdateMode ? t('dataSettings.updating') : t('dataSettings.saving'))
                                : (isUpdateMode ? t('dataSettings.update') : t('dataSettings.save')) }}
                        </button>

                        <!-- BMI Danger Zone -->
                        <div v-if="isUpdateMode" class="mt-2 rounded-xl border p-4"
                            :class="isDarkMode ? 'border-red-900/60 bg-red-950/20' : 'border-red-200 bg-red-50/50'">
                            <p class="text-xs font-semibold uppercase tracking-wide mb-3"
                                :class="isDarkMode ? 'text-red-400' : 'text-red-600'">
                                {{ $t('dataSettings.dangerZone') }}
                            </p>
                            <button @click="deleteBMIData" :disabled="isDeletingBMI"
                                class="w-full py-2 px-4 rounded-lg text-sm font-medium text-white transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                :class="isDeletingBMI ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 active:scale-[.98]'">
                                <svg v-if="isDeletingBMI" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                </svg>
                                {{ isDeletingBMI ? t('dataSettings.deleting') : t('dataSettings.deleteBMI') }}
                            </button>
                            <transition name="fade">
                                <div v-if="deleteBMIStatus"
                                    class="mt-2 flex items-center gap-2 text-xs rounded-lg p-2.5"
                                    :class="deleteBMIStatus.type === 'success'
                                        ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                                        : isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'">
                                    {{ deleteBMIStatus.message }}
                                </div>
                            </transition>
                        </div>

                    </div>
                </div>

                <!-- ═══════════ Upload Card ═══════════ -->
                <div class="rounded-2xl shadow-sm border"
                    :class="[themeClasses.cardBackground, themeClasses.border]">

                    <!-- Card header -->
                    <div class="px-6 pt-5 pb-4 border-b" :class="themeClasses.border">
                        <div class="flex items-center gap-3">
                            <div class="p-2 rounded-lg" :class="isDarkMode ? 'bg-blue-900/40' : 'bg-blue-100'">
                                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-base font-semibold leading-tight" :class="themeClasses.textPrimary">
                                    {{ $t('dataSettings.uploadCSV') }}
                                </h2>
                                <p class="text-xs mt-0.5" :class="themeClasses.textSecondary">
                                    {{ $t('dataSettings.uploadSubtitle') }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="px-6 py-5 space-y-5">

                        <!-- Drag-and-drop zone -->
                        <div @click="triggerFileInput"
                            @dragover.prevent="isDragging = true"
                            @dragleave.prevent="isDragging = false"
                            @drop.prevent="handleFileDrop"
                            class="relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 group"
                            :class="isDragging
                                ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                                : isDarkMode
                                    ? 'border-gray-600 hover:border-blue-500/60 hover:bg-blue-900/10'
                                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'">
                            <div class="flex flex-col items-center gap-2">
                                <div class="p-3 rounded-full transition-colors"
                                    :class="isDragging
                                        ? 'bg-blue-500/20'
                                        : isDarkMode ? 'bg-gray-700 group-hover:bg-blue-900/30' : 'bg-gray-100 group-hover:bg-blue-100'">
                                    <svg class="w-7 h-7 transition-colors"
                                        :class="isDragging ? 'text-blue-500' : isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500'"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-sm font-medium" :class="themeClasses.textPrimary">
                                        {{ $t('dataSettings.clickToUpload') }}
                                    </p>
                                    <p class="text-xs mt-0.5" :class="themeClasses.textSecondary">
                                        {{ $t('dataSettings.csvFilesOnly') }}
                                    </p>
                                </div>
                            </div>
                            <input ref="fileInput" type="file" accept=".csv" class="hidden" @change="handleFileSelect"/>
                        </div>

                        <!-- Selected file card -->
                        <transition name="fade">
                            <div v-if="selectedFile"
                                class="flex items-center gap-3 p-3 rounded-xl border"
                                :class="isDarkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-50 border-gray-200'">
                                <div class="shrink-0 p-2 rounded-lg"
                                    :class="isDarkMode ? 'bg-green-900/30' : 'bg-green-100'">
                                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium truncate" :class="themeClasses.textPrimary">{{ selectedFile.name }}</p>
                                    <p class="text-xs" :class="themeClasses.textSecondary">{{ (selectedFile.size / 1024).toFixed(2) }} KB</p>
                                </div>
                                <button @click.stop="clearFile"
                                    class="shrink-0 p-1.5 rounded-lg transition-colors text-gray-400 hover:text-red-500"
                                    :class="isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                    </svg>
                                </button>
                            </div>
                        </transition>

                        <!-- Upload type pill toggle -->
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-wide mb-2" :class="themeClasses.textSecondary">
                                {{ $t('dataSettings.uploadTypeLabel') }}
                            </p>
                            <div class="flex flex-wrap gap-2">
                                <!-- All -->
                                <button @click="isHeartOnlyUpload = false; isStressOnlyUpload = false"
                                    class="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                                    :class="!isHeartOnlyUpload && !isStressOnlyUpload
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                        : isDarkMode ? 'border-gray-600 text-gray-300 hover:border-blue-500' : 'border-gray-300 text-gray-600 hover:border-blue-400'">
                                    ❤️ {{ $t('dataSettings.uploadAll') }}
                                </button>
                                <!-- Heart only -->
                                <button @click="isHeartOnlyUpload = true; isStressOnlyUpload = false"
                                    class="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                                    :class="isHeartOnlyUpload
                                        ? 'bg-red-500 text-white border-red-500 shadow-sm'
                                        : isDarkMode ? 'border-gray-600 text-gray-300 hover:border-red-400' : 'border-gray-300 text-gray-600 hover:border-red-400'">
                                    ❤️ {{ $t('dataSettings.uploadHeartOnly') }}
                                </button>
                                <!-- Stress only -->
                                <button @click="isStressOnlyUpload = true; isHeartOnlyUpload = false"
                                    class="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                                    :class="isStressOnlyUpload
                                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                                        : isDarkMode ? 'border-gray-600 text-gray-300 hover:border-amber-400' : 'border-gray-300 text-gray-600 hover:border-amber-400'">
                                    🧠 {{ $t('dataSettings.uploadStressOnly') }}
                                </button>
                            </div>
                        </div>

                        <!-- Status messages -->
                        <transition name="fade">
                            <div v-if="fileProcessStatus"
                                class="flex items-center gap-2 p-3 rounded-xl text-sm"
                                :class="fileProcessStatus.type === 'success'
                                    ? isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-800 border border-green-200'
                                    : fileProcessStatus.type === 'info'
                                        ? isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-800 border border-blue-200'
                                        : isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-800 border border-red-200'">
                                <svg v-if="fileProcessStatus.type === 'info'" class="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                <svg v-else-if="fileProcessStatus.type === 'success'" class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                                <svg v-else class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                </svg>
                                <span>{{ fileProcessStatus.message }}</span>
                            </div>
                        </transition>

                        <transition name="fade">
                            <div v-if="uploadStatus"
                                class="flex items-start gap-2 p-3 rounded-xl text-sm"
                                :class="uploadStatus.type === 'success'
                                    ? isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-800 border border-green-200'
                                    : isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-800 border border-red-200'">
                                <svg v-if="uploadStatus.type === 'success'" class="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                                <svg v-else class="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                </svg>
                                <span>{{ uploadStatus.message }}</span>
                            </div>
                        </transition>

                        <!-- Upload button -->
                        <button @click="submitFileUpload" :disabled="!selectedFile || isUploading"
                            class="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            :class="selectedFile && !isUploading
                                ? 'bg-blue-600 hover:bg-blue-700 active:scale-[.98] shadow-sm hover:shadow-md'
                                : 'bg-gray-400 cursor-not-allowed'">
                            <svg v-if="isUploading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            {{ isUploading ? t('dataSettings.uploading') : t('dataSettings.uploadFile') }}
                        </button>

                        <!-- Danger Zone: delete records -->
                        <div class="rounded-xl border p-4 mt-2"
                            :class="isDarkMode ? 'border-red-900/60 bg-red-950/20' : 'border-red-200 bg-red-50/50'">
                            <p class="text-xs font-semibold uppercase tracking-wide mb-3"
                                :class="isDarkMode ? 'text-red-400' : 'text-red-600'">
                                {{ $t('dataSettings.dangerZone') }}
                            </p>
                            <div class="flex flex-col sm:flex-row gap-2">
                                <!-- Delete Heart Rate -->
                                <button @click="deleteAllHeartRateData"
                                    :disabled="isDeleting || !hasHeartRateData"
                                    class="flex-1 py-2 px-3 rounded-lg text-sm font-medium text-white transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    :class="!isDeleting && hasHeartRateData
                                        ? 'bg-red-600 hover:bg-red-700 active:scale-[.98]'
                                        : 'bg-gray-400 cursor-not-allowed'">
                                    <svg v-if="isDeleting" class="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    <svg v-else class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                    </svg>
                                    <span class="truncate">{{ isDeleting ? t('dataSettings.deleting') : t('dataSettings.deleteAllHeartRateRecords') }}</span>
                                </button>
                                <!-- Delete Stress -->
                                <button @click="deleteAllStressData"
                                    :disabled="isDeleting || !hasStressData"
                                    class="flex-1 py-2 px-3 rounded-lg text-sm font-medium text-white transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    :class="!isDeleting && hasStressData
                                        ? 'bg-amber-600 hover:bg-amber-700 active:scale-[.98]'
                                        : 'bg-gray-400 cursor-not-allowed'">
                                    <svg v-if="isDeleting" class="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    <svg v-else class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                    </svg>
                                    <span class="truncate">{{ isDeleting ? t('dataSettings.deleting') : t('dataSettings.deleteAllStressRecords') }}</span>
                                </button>
                            </div>
                            <transition name="fade">
                                <div v-if="deleteStatus"
                                    class="mt-2 flex items-center gap-2 text-xs rounded-lg p-2.5"
                                    :class="deleteStatus.type === 'success'
                                        ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                                        : isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'">
                                    {{ deleteStatus.message }}
                                </div>
                            </transition>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    </div>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { saveBMIData, getLatestBMIRecord, updateBMIRecord, deleteBMIRecord, deleteAllBMIRecords } from '../services/bmiService'
import { uploadHeartRateCSV, uploadAllCSV, deleteAllHeartRateRecords, getHeartRateDates } from '../services/heartRateService'
import { uploadStressCSV, deleteAllStressRecords, getStressDates } from '../services/stressService'
import { invalidateBmiCache, invalidateHeartRateCache, invalidateStressCache, useUserStore } from '../stores/userStore'

const route = useRoute()
const router = useRouter()
const userState = useUserStore()

const { isDarkMode, themeClasses } = useTheme()
const { t } = useI18n()

// Navigate back to the referrer if provided; otherwise fall back to history or Admin dashboard
const goBackToReferrer = () => {
    const from = route.query.from
    if (from) { try { router.push(from); return } catch {} }
    if (window.history.length > 1) router.back()
    else router.push({ name: 'AdminDashboard' })
}

// State
const bmiForm = ref({ age: '', height: '', weight: '' })
const existingBMIRecord = ref(null)
const isLoading = ref(false)
const isLoadingData = ref(false)
const submitStatus = ref(null)
const fileInput = ref(null)
const selectedFile = ref(null)
const isDragging = ref(false)
const uploadStatus = ref(null)
const isUploading = ref(false)
const isDeleting = ref(false)
const deleteStatus = ref(null)
const hasHeartRateData = ref(false)
const hasStressData = ref(false)
const isDeletingBMI = ref(false)
const deleteBMIStatus = ref(null)
const isStressOnlyUpload = ref(false)
const isHeartOnlyUpload = ref(false)
const fileProcessStatus = ref(null)

// Computed
const isUpdateMode = computed(() => !!(existingBMIRecord.value?._id || existingBMIRecord.value?.id))

const calculatedBMI = computed(() => {
    const h = parseFloat(bmiForm.value.height) / 100
    const w = parseFloat(bmiForm.value.weight)
    return h > 0 && w > 0 ? (w / (h * h)).toFixed(1) : null
})

const bmiCategory = computed(() => {
    const bmi = parseFloat(calculatedBMI.value)
    if (!bmi) return ''
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 25) return 'Normal'
    if (bmi < 30) return 'Overweight'
    return 'Obese'
})

const bmiCategoryKey = computed(() => {
    const raw = bmiCategory.value.toLowerCase()
    if (raw.includes('under')) return 'underweight'
    if (raw.includes('normal')) return 'normal'
    if (raw.includes('over')) return 'overweight'
    if (raw.includes('obese')) return 'obese'
    return ''
})

// BMI arc gauge: arc total ≈ 125.6 (half circle, r=40, π*40)
const BMI_MIN = 15
const BMI_MAX = 40
const ARC_LENGTH = 125.6
const bmiArcOffset = computed(() => {
    const bmi = parseFloat(calculatedBMI.value)
    if (!bmi) return ARC_LENGTH
    const ratio = Math.min(Math.max((bmi - BMI_MIN) / (BMI_MAX - BMI_MIN), 0), 1)
    return ARC_LENGTH * (1 - ratio)
})
const bmiArcColor = computed(() => {
    const bmi = parseFloat(calculatedBMI.value)
    if (!bmi) return '#6b7280'
    if (bmi < 18.5) return '#3b82f6'
    if (bmi < 25) return '#22c55e'
    if (bmi < 30) return '#f59e0b'
    return '#ef4444'
})
const bmiCategoryBadge = computed(() => {
    const bmi = parseFloat(calculatedBMI.value)
    if (!bmi) return ''
    if (bmi < 18.5) return isDarkMode.value ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'
    if (bmi < 25) return isDarkMode.value ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700'
    if (bmi < 30) return isDarkMode.value ? 'bg-yellow-900/40 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
    return isDarkMode.value ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700'
})
const bmiDotColor = computed(() => {
    const bmi = parseFloat(calculatedBMI.value)
    if (!bmi) return 'bg-gray-400'
    if (bmi < 18.5) return 'bg-blue-500'
    if (bmi < 25) return 'bg-green-500'
    if (bmi < 30) return 'bg-yellow-500'
    return 'bg-red-500'
})
const bmiSegments = [
    { key: 'underweight', color: 'text-blue-500' },
    { key: 'normal', color: 'text-green-500' },
    { key: 'overweight', color: 'text-yellow-500' },
    { key: 'obese', color: 'text-red-500' }
]

const viewedUserId = computed(() => route.query.userId || null)
const currentUserId = computed(() => userState.user?.id || null)
const isViewingOtherUser = computed(() =>
    viewedUserId.value && currentUserId.value && String(viewedUserId.value) !== String(currentUserId.value)
)
const adminParams = computed(() => isViewingOtherUser.value ? { userId: viewedUserId.value } : {})

const loadExistingBMIData = async () => {
    isLoadingData.value = true
    try {
        const { success, data } = await getLatestBMIRecord(adminParams.value)
        existingBMIRecord.value = success && data ? data : null
        if (success && data)
            bmiForm.value = { height: data.height?.toString() || '', weight: data.weight?.toString() || '', age: data.age?.toString() || '' }
    } catch {
        existingBMIRecord.value = null
    } finally {
        isLoadingData.value = false
    }
}

// Reload data when viewed user changes
watch(() => route.query.userId, () => { loadExistingBMIData(); checkHeartRateData(); checkStressData() })

const clearStatusAfterDelay = (statusRef) => setTimeout(() => statusRef.value = null, 3000)

const submitBMIData = async () => {
    if (!bmiForm.value.height || !bmiForm.value.weight) {
        submitStatus.value = { type: 'error', message: t('dataSettings.fillHeightWeight') }
        return
    }
    isLoading.value = true
    submitStatus.value = null
    const bmiData = {
        weight: parseFloat(bmiForm.value.weight),
        height: parseFloat(bmiForm.value.height),
        bmi: parseFloat(calculatedBMI.value),
        category: bmiCategory.value,
        age: bmiForm.value.age ? parseInt(bmiForm.value.age, 10) : null
    }
    try {
        const recordId = existingBMIRecord.value?._id || existingBMIRecord.value?.id
        const response = recordId
            ? await updateBMIRecord(recordId, bmiData, adminParams.value)
            : await saveBMIData(bmiData, adminParams.value)
        if (response?.success) {
            if (response.data) existingBMIRecord.value = { ...response.data, _id: response.data._id || response.data.id }
            submitStatus.value = { type: 'success', message: isUpdateMode.value ? t('dataSettings.updatedSuccessfully') : t('dataSettings.savedSuccessfully') }
            invalidateBmiCache()
            window.dispatchEvent(new CustomEvent('bmiDataUpdated'))
        } else {
            submitStatus.value = { type: 'error', message: response?.message || t('dataSettings.saveFailed') }
        }
    } catch (error) {
        submitStatus.value = { type: 'error', message: error.message || t('dataSettings.saveFailed') }
    } finally {
        isLoading.value = false
        if (submitStatus.value?.type === 'success') clearStatusAfterDelay(submitStatus)
    }
}

// Delete BMI data
const deleteBMIData = async () => {
    if (!confirm(t('dataSettings.deleteBMIConfirm'))) return
    isDeletingBMI.value = true
    deleteBMIStatus.value = null
    try {
        const recordId = existingBMIRecord.value?._id || existingBMIRecord.value?.id
        const response = recordId
            ? await deleteBMIRecord(recordId, adminParams.value)
            : await deleteAllBMIRecords(adminParams.value)
        if (response?.success) {
            deleteBMIStatus.value = { type: 'success', message: t('dataSettings.bmiDeleted') }
            bmiForm.value = { age: '', height: '', weight: '' }
            existingBMIRecord.value = null
            invalidateBmiCache()
            window.dispatchEvent(new CustomEvent('bmiDataUpdated'))
        } else {
            deleteBMIStatus.value = { type: 'error', message: response?.message || t('dataSettings.deleteFailed') }
        }
    } catch (error) {
        deleteBMIStatus.value = { type: 'error', message: error.message || t('dataSettings.deleteFailed') }
    } finally {
        isDeletingBMI.value = false
        if (deleteBMIStatus.value?.type === 'success') clearStatusAfterDelay(deleteBMIStatus)
    }
}

// Check if heart rate data exists
const checkHeartRateData = async () => {
    try {
        const res = await getHeartRateDates(adminParams.value)
        hasHeartRateData.value = !!(res?.success && Array.isArray(res.data?.dates) && res.data.dates.length)
    } catch { hasHeartRateData.value = false }
}

// Check if stress data exists
const checkStressData = async () => {
    try {
        const res = await getStressDates(adminParams.value)
        hasStressData.value = !!(res?.success && Array.isArray(res.data?.dates) && res.data.dates.length)
    } catch { hasStressData.value = false }
}

// Delete all heart rate data
const deleteAllHeartRateData = async () => {
    if (!confirm(t('dataSettings.deleteAllConfirm'))) return
    isDeleting.value = true
    deleteStatus.value = null
    try {
        const response = await deleteAllHeartRateRecords(adminParams.value)
        if (response?.success) {
            deleteStatus.value = { type: 'success', message: response.message || t('dataSettings.allHeartRateDeleted') }
            hasHeartRateData.value = false
            invalidateHeartRateCache()
            window.dispatchEvent(new CustomEvent('heartRateDataUpdated'))
        } else {
            deleteStatus.value = { type: 'error', message: response?.message || t('dataSettings.deleteFailed') }
        }
    } catch (error) {
        deleteStatus.value = { type: 'error', message: error.message || t('dataSettings.deleteFailed') }
    } finally {
        isDeleting.value = false
        if (deleteStatus.value?.type === 'success') clearStatusAfterDelay(deleteStatus)
    }
}

// Delete all stress data
const deleteAllStressData = async () => {
    if (!confirm(t('dataSettings.deleteAllStressConfirm'))) return
    isDeleting.value = true
    deleteStatus.value = null
    try {
        const response = await deleteAllStressRecords(adminParams.value)
        if (response?.success) {
            deleteStatus.value = { type: 'success', message: response.message || t('dataSettings.allStressDeleted') }
            hasStressData.value = false
            invalidateStressCache()
            window.dispatchEvent(new CustomEvent('stressDataUpdated'))
        } else {
            deleteStatus.value = { type: 'error', message: t('dataSettings.deleteFailed') }
        }
    } catch (error) {
        deleteStatus.value = { type: 'error', message: t('dataSettings.deleteFailed') }
    } finally {
        isDeleting.value = false
        if (deleteStatus.value?.type === 'success') clearStatusAfterDelay(deleteStatus)
    }
}

onMounted(() => { loadExistingBMIData(); checkHeartRateData(); checkStressData() })

// File Upload Handlers
const triggerFileInput = () => fileInput.value.click()

const validateAndSetFile = (file, errorMsg) => {
    const isCSV = file?.name?.toLowerCase().endsWith('.csv') ||
        ['text/csv', 'application/vnd.ms-excel', 'text/plain'].includes(file?.type)
    if (isCSV) { selectedFile.value = file; uploadStatus.value = null }
    else if (file) { uploadStatus.value = { type: 'error', message: errorMsg } }
}

const handleFileSelect = (e) => validateAndSetFile(e.target.files[0], t('dataSettings.invalidCsvSelect'))
const handleFileDrop = (e) => { isDragging.value = false; validateAndSetFile(e.dataTransfer.files[0], t('dataSettings.invalidCsvDrop')) }

const clearFile = () => {
    selectedFile.value = null
    uploadStatus.value = null
    fileProcessStatus.value = null
    if (fileInput.value) fileInput.value.value = ''
}

// Helper to split CSV line while respecting quoted commas
const splitCsvLine = (line) => line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)

// Process CSV text into required "Value,Date" format
function processCsvText(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim() !== '')
    if (!lines.length) throw new Error(t('dataSettings.emptyCsv') || 'Empty CSV')

    const headers = splitCsvLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim())
    const keyIdx = headers.findIndex(h => /key/i.test(h))
    const valueIdx = headers.findIndex(h => /value/i.test(h))
    const updateIdx = headers.findIndex(h => /updatetime|time/i.test(h))

    if (keyIdx === -1 || valueIdx === -1 || updateIdx === -1) {
        throw new Error(t('dataSettings.missingColumns') || 'Missing Key/Value/UpdateTime columns')
    }

    const targetKeys = new Set(['heart_rate', 'stress'])
    const out = ['Value,Date']
    for (let i = 1; i < lines.length; i++) {
        const cols = splitCsvLine(lines[i])
        if (cols.length !== headers.length) continue
        const key = cols[keyIdx].replace(/^"|"$/g, '').trim()
        if (!targetKeys.has(key)) continue
        const value = cols[valueIdx].replace(/^"|"$/g, '').trim()
        const updateTime = cols[updateIdx].replace(/^"|"$/g, '').trim()
        out.push(`${value},${updateTime}`)
    }
    if (out.length === 1) throw new Error(t('dataSettings.noMatchingKey') || 'No heart_rate or stress rows found')
    return out.join('\n')
}

const uploadProcessedCsv = (csvText, filename = 'heart_rate_stress_combined.csv') => {
    const file = new File([csvText], filename, { type: 'text/csv' })
    if (isHeartOnlyUpload.value) return uploadHeartRateCSV(file, adminParams.value)
    if (isStressOnlyUpload.value) return uploadStressCSV(file, adminParams.value)
    return uploadAllCSV(file, adminParams.value)
}

const submitFileUpload = async () => {
    if (!selectedFile.value) {
        uploadStatus.value = { type: 'error', message: t('dataSettings.noFileSelected') }
        return
    }

    isUploading.value = true
    uploadStatus.value = null
    fileProcessStatus.value = { type: 'info', message: t('dataSettings.processingCSV') }

    try {
        let processedCsv
        try {
            processedCsv = processCsvText(await selectedFile.value.text())
            fileProcessStatus.value = { type: 'info', message: t('dataSettings.uploading') || 'Uploading...' }
        } catch (error) {
            fileProcessStatus.value = { type: 'error', message: error.message || t('dataSettings.processingFailed') }
            throw error
        }

        // Upload processed file
        const response = await uploadProcessedCsv(processedCsv)

        if (response && response.success) {
            // Handle new backend response shape
            const d = response.data || {}
            const totalParsed = d.totalRecordsParsed ?? 0
            const daysProcessed = d.totalDaysProcessed ?? 0
            const hrSummary = d.heartRate ?? {}
            const stressSummary = d.stress ?? {}

            let msgParts = []
            if (typeof hrSummary.daysInserted === 'number' || typeof hrSummary.daysUpdated === 'number') {
                msgParts.push(`${t('dataSettings.heartRateDays')}: ${hrSummary.daysInserted ?? 0} ${t('dataSettings.daysInserted')}, ${hrSummary.daysUpdated ?? 0} ${t('dataSettings.daysUpdated')}`)
            }
            if (typeof stressSummary.daysInserted === 'number' || typeof stressSummary.daysUpdated === 'number') {
                msgParts.push(`${t('dataSettings.stressDays')}: ${stressSummary.daysInserted ?? 0} ${t('dataSettings.daysInserted')}, ${stressSummary.daysUpdated ?? 0} ${t('dataSettings.daysUpdated')}`)
            }

            const msg = `${t('dataSettings.uploadedSuccessfullySummary')} ${totalParsed} ${t('dataSettings.recordsParsed')}. ${msgParts.join('; ')} (${daysProcessed} ${t('dataSettings.daysProcessed')})`

            uploadStatus.value = { type: 'success', message: msg }
            clearFile()
            invalidateHeartRateCache()
            invalidateStressCache()
            window.dispatchEvent(new CustomEvent('heartRateDataUpdated'))
            window.dispatchEvent(new CustomEvent('stressDataUpdated'))
            await checkHeartRateData()
            await checkStressData()
        } else {
            uploadStatus.value = { type: 'error', message: (response && response.message) || t('dataSettings.uploadFailed') }
        }
    } catch (error) {
        uploadStatus.value = { type: 'error', message: error.message || t('dataSettings.uploadFailedTry') }
    } finally {
        isUploading.value = false
        setTimeout(() => { fileProcessStatus.value = null }, 3000)
    }
} 
</script>

<style scoped>
.no-spinner::-webkit-outer-spin-button,
.no-spinner::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
}
.no-spinner {
    -moz-appearance: textfield;
    appearance: textfield;
}

/* BMI arc animation */
.bmi-arc-transition {
    transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

/* Slide-down transition */
.slide-down-enter-active,
.slide-down-leave-active {
    transition: opacity 0.3s ease, max-height 0.35s ease;
    overflow: hidden;
    max-height: 100px;
}
.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    max-height: 0;
}

/* BMI result appear */
.bmi-result-enter-active {
    transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bmi-result-leave-active {
    transition: opacity 0.2s ease;
}
.bmi-result-enter-from {
    opacity: 0;
    transform: scale(0.96) translateY(6px);
}
.bmi-result-leave-to {
    opacity: 0;
}
</style>