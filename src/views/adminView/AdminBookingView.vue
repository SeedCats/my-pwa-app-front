<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <main class="px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
      <div class="py-6">
        <div class="mb-6">
          <h1 class="text-2xl font-bold mb-2" :class="themeClasses.textPrimary">{{ $t('booking.adminTitle') }}</h1>
          <p :class="themeClasses.textSecondary">{{ $t('booking.adminDesc') }}</p>
        </div>

        <!-- ── Stats Overview ──────────────────────────────────────── -->
        <div class="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">

          <!-- Today -->
          <div class="rounded-xl border shadow-sm overflow-hidden" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="flex items-center gap-2.5 px-4 py-3 border-b" :class="themeClasses.border">
              <div class="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M20.66 17.5l-.87-.5M4.21 6.5l-.87-.5M21 12h-1M4 12H3" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none" />
                </svg>
              </div>
              <span class="font-semibold text-sm" :class="themeClasses.textPrimary">{{ $t('booking.statsToday') }}</span>
              <span class="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">{{ statsToday.total }} {{ $t('booking.statsTotal') }}</span>
            </div>
            <div class="grid grid-cols-3 divide-x" :class="themeClasses.border">
              <div class="flex flex-col items-center py-4 gap-1">
                <span class="text-2xl font-bold text-amber-500">{{ statsToday.pending }}</span>
                <span class="text-[11px] font-medium" :class="themeClasses.textSecondary">{{ $t('booking.pending') }}</span>
              </div>
              <div class="flex flex-col items-center py-4 gap-1">
                <span class="text-2xl font-bold text-green-500">{{ statsToday.confirmed }}</span>
                <span class="text-[11px] font-medium" :class="themeClasses.textSecondary">{{ $t('booking.confirmed') }}</span>
              </div>
              <div class="flex flex-col items-center py-4 gap-1">
                <span class="text-2xl font-bold text-blue-500">{{ statsToday.completed }}</span>
                <span class="text-[11px] font-medium" :class="themeClasses.textSecondary">{{ $t('booking.completed') }}</span>
              </div>
            </div>
          </div>

          <!-- This Month -->
          <div class="rounded-xl border shadow-sm overflow-hidden" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="flex items-center gap-2.5 px-4 py-3 border-b" :class="themeClasses.border">
              <div class="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="font-semibold text-sm" :class="themeClasses.textPrimary">{{ $t('booking.statsThisMonth') }}</span>
              <span class="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">{{ statsMonth.total }} {{ $t('booking.statsTotal') }}</span>
            </div>
            <div class="grid grid-cols-3 divide-x" :class="themeClasses.border">
              <div class="flex flex-col items-center py-4 gap-1">
                <span class="text-2xl font-bold text-amber-500">{{ statsMonth.pending }}</span>
                <span class="text-[11px] font-medium" :class="themeClasses.textSecondary">{{ $t('booking.pending') }}</span>
              </div>
              <div class="flex flex-col items-center py-4 gap-1">
                <span class="text-2xl font-bold text-green-500">{{ statsMonth.confirmed }}</span>
                <span class="text-[11px] font-medium" :class="themeClasses.textSecondary">{{ $t('booking.confirmed') }}</span>
              </div>
              <div class="flex flex-col items-center py-4 gap-1">
                <span class="text-2xl font-bold text-blue-500">{{ statsMonth.completed }}</span>
                <span class="text-[11px] font-medium" :class="themeClasses.textSecondary">{{ $t('booking.completed') }}</span>
              </div>
            </div>
          </div>

        </div>
        <!-- ── End Stats Overview ──────────────────────────────────── -->

        <!-- ── Availability Calendar ─────────────────────────────────── -->
        <div class="mb-8 rounded-lg shadow-md border overflow-hidden" :class="[themeClasses.cardBackground, themeClasses.border]">
          <!-- Header -->
          <div class="flex items-center gap-3 p-4 border-b" :class="themeClasses.border">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" :class="themeClasses.textSecondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div class="flex-1 min-w-0">
              <h2 class="text-base font-semibold" :class="themeClasses.textPrimary">{{ $t('booking.availabilityCalendar') }}</h2>
              <p class="text-xs" :class="themeClasses.textSecondary">{{ $t('booking.availabilityDesc') }}</p>
            </div>
            <!-- Refresh button -->
            <button
              @click="refreshAvailability"
              :disabled="isRefreshingCal"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
              :class="[
                isRefreshingCal
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:shadow-sm',
                themeClasses.inputBackground, themeClasses.border, themeClasses.textPrimary
              ]"
              :title="$t('common.refresh')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5 transition-transform duration-500"
                :class="isRefreshingCal ? 'animate-spin' : ''"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="hidden sm:inline">{{ isRefreshingCal ? $t('common.loading') : $t('common.refresh') }}</span>
            </button>
          </div>

          <div class="p-4">
            <div class="flex flex-col lg:flex-row gap-6">

              <!-- ── Monthly Calendar ─── -->
              <div class="flex-shrink-0 w-full lg:w-72">
                <!-- Month nav -->
                <div class="flex items-center justify-between mb-3">
                  <button
                    @click="calPrevMonth"
                    class="p-1.5 rounded-lg border transition-colors"
                    :class="[themeClasses.inputBackground, themeClasses.border, themeClasses.hoverBackground, themeClasses.textPrimary]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span class="font-semibold text-sm" :class="themeClasses.textPrimary">{{ calendarTitle }}</span>
                  <button
                    @click="calNextMonth"
                    class="p-1.5 rounded-lg border transition-colors"
                    :class="[themeClasses.inputBackground, themeClasses.border, themeClasses.hoverBackground, themeClasses.textPrimary]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <!-- Day headers -->
                <div class="grid grid-cols-7 mb-1">
                  <div
                    v-for="h in CAL_DAY_HEADERS"
                    :key="h"
                    class="text-center text-xs font-medium py-1"
                    :class="themeClasses.textSecondary"
                  >{{ h }}</div>
                </div>

                <!-- Calendar cells -->
                <div class="grid grid-cols-7 gap-0.5">
                  <div v-for="(cell, idx) in calendarCells" :key="idx">
                    <!-- empty leading cell -->
                    <div v-if="cell === null" class="aspect-square" />
                    <!-- date cell -->
                    <button
                      v-else
                      @click="selectCalDate(cell)"
                      class="relative aspect-square w-full flex items-center justify-center rounded-lg text-xs font-medium transition-all"
                      :class="[
                        calIsSelected(cell)
                          ? 'bg-blue-600 text-white shadow-md'
                          : calIsToday(cell)
                            ? ['ring-2 ring-blue-500 ring-inset', themeClasses.textPrimary, themeClasses.inputBackground]
                            : calIsPast(cell)
                              ? ['opacity-40 cursor-not-allowed', themeClasses.textSecondary]
                              : [themeClasses.hoverBackground, themeClasses.textPrimary]
                      ]"
                      :disabled="calIsPast(cell)"
                    >
                      {{ cell }}
                      <!-- dots row: green = has slots, orange = has booked -->
                      <span
                        v-if="calHasSlots(cell)"
                        class="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5"
                      >
                        <span
                          class="w-1.5 h-1.5 rounded-full"
                          :class="calIsSelected(cell) ? 'bg-white' : 'bg-green-500'"
                        />
                        <span
                          v-if="calHasBookedSlots(cell)"
                          class="w-1.5 h-1.5 rounded-full"
                          :class="calIsSelected(cell) ? 'bg-orange-300' : 'bg-orange-500'"
                        />
                      </span>
                    </button>
                  </div>
                </div>

                <!-- Legend -->
                <div class="mt-3 flex items-center gap-4 text-xs flex-wrap" :class="themeClasses.textSecondary">
                  <span class="flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-green-500 inline-block" /> {{ $t('booking.hasSlots') }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-orange-500 inline-block" /> {{ $t('booking.slotBooked') }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-blue-600 inline-block" /> {{ $t('booking.selectedDate') }}
                  </span>
                </div>
              </div>

              <!-- ── Time Slot Panel ─── -->
              <div class="flex-1 min-w-0">
                <template v-if="selectedCalDate">
                  <div class="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <h3 class="font-semibold text-sm" :class="themeClasses.textPrimary">
                      {{ $t('booking.date') }}: <span class="text-blue-500">{{ selectedCalDate }}</span>
                    </h3>
                    <button
                      @click="calToggleAll"
                      class="text-xs px-3 py-1 rounded-lg border transition-colors"
                      :class="[themeClasses.inputBackground, themeClasses.border, themeClasses.hoverBackground, themeClasses.textPrimary]"
                    >
                      {{ $t('booking.toggleAll') }}
                    </button>
                  </div>

                  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    <button
                      v-for="slot in CAL_TIME_SLOTS"
                      :key="slot"
                      @click="calToggleSlot(slot)"
                      :disabled="calIsSlotBooked(slot)"
                      class="py-2 rounded-lg text-xs font-medium border transition-all flex flex-col items-center justify-center leading-tight"
                      :class="calIsSlotBooked(slot)
                        ? 'bg-amber-500 border-amber-500 text-white shadow-sm opacity-60 cursor-not-allowed'
                        : calIsSlotActive(slot)
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                          : [themeClasses.inputBackground, themeClasses.border, themeClasses.textPrimary, themeClasses.hoverBackground]
                      "
                      :title="calIsSlotBooked(slot)
                        ? ($t('booking.slotBooked') + (getSlotBooker(slot) ? ': ' + getSlotBooker(slot) : ''))
                        : calIsSlotActive(slot) ? $t('booking.clickToRemove') : $t('booking.clickToAdd')"
                    >
                      <span>{{ slot }}</span>
                      <span v-if="calIsSlotBooked(slot)" class="text-[9px] font-semibold uppercase tracking-wide mt-0.5 opacity-90">{{ $t('booking.slotBooked') }}</span>
                    </button>
                  </div>

                  <!-- Slot legend -->
                  <div class="mt-3 flex items-center gap-4 text-xs flex-wrap" :class="themeClasses.textSecondary">
                    <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-blue-600 inline-block" /> {{ $t('booking.available') }}</span>
                    <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-amber-500 inline-block" /> {{ $t('booking.slotBooked') }}</span>
                    <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded border inline-block" :class="[themeClasses.border, themeClasses.inputBackground]" /> {{ $t('booking.inactive') }}</span>
                  </div>

                  <!-- Save -->
                  <div class="mt-4 flex items-center gap-3 flex-wrap">
                    <button
                      @click="calSaveSlots"
                      :disabled="isSavingSlots"
                      class="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm rounded-lg transition-colors shadow-sm font-medium"
                    >
                      {{ isSavingSlots ? ($t('common.loading')) : $t('booking.saveSlots') }}
                    </button>
                    <span
                      v-if="slotSaveMsg === 'saved'"
                      class="text-xs text-green-500 font-medium"
                    >{{ $t('booking.slotsSaved') }}</span>
                    <span
                      v-else-if="slotSaveMsg === 'error'"
                      class="text-xs text-red-500 font-medium"
                    >{{ $t('booking.slotsSaveFailed') }}</span>
                  </div>
                </template>

                <!-- No date selected -->
                <div v-else class="h-full flex items-center justify-center py-12">
                  <div class="text-center" :class="themeClasses.textSecondary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="text-sm">{{ $t('booking.noDateSelected') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- ── End Availability Calendar ──────────────────────────────── -->

        <!-- Filter Bar -->
        <div class="rounded-xl border shadow-sm p-3 mb-4" :class="[themeClasses.cardBackground, themeClasses.border]">
          <div class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <!-- Search -->
            <div class="relative flex-1 min-w-0">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" :class="themeClasses.textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
              </svg>
              <input 
                type="text" 
                v-model="searchQuery" 
                :placeholder="$t('common.search') || 'Search...'" 
                class="w-full pl-10 pr-4 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]"
              />
            </div>
            <!-- Filters -->
            <div class="flex gap-2 flex-wrap sm:flex-nowrap">
              <button 
                @click="toggleSort('date')"
                class="px-3 py-2 rounded-lg border flex items-center justify-center gap-1.5 transition-all duration-150 text-sm font-medium flex-shrink-0"
                :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border, themeClasses.hoverBackground, sortKey === 'date' ? 'ring-2 ring-blue-500/40' : '']"
                :title="$t('common.sort') || 'Sort by Date'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span v-if="sortKey === 'date' && sortOrder === 'asc'" class="text-xs">↑</span>
                <span v-else-if="sortKey === 'date'" class="text-xs">↓</span>
              </button>
              <select 
                v-model="serviceFilter"
                class="px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all flex-shrink-0"
                :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]"
              >
                <option value="">{{ $t('booking.allServices') || 'All Services' }}</option>
                <option value="GeneralCheckup">{{ $t('booking.generalCheckup') }}</option>
                <option value="Health Status Checkup">{{ $t('booking.healthStatusCheckup') }}</option>
                <option value="Health Consultation">{{ $t('booking.healthConsultation') }}</option>
                <option value="therapy">{{ $t('booking.therapy') }}</option>
              </select>
              <select 
                v-model="statusFilter"
                class="px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all flex-shrink-0"
                :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]"
              >
                <option value="">{{ $t('booking.allStatus') || 'All Status' }}</option>
                <option value="pending">{{ $t('booking.pending') }}</option>
                <option value="confirmed">{{ $t('booking.confirmed') }}</option>
                <option value="completed">{{ $t('booking.completed') }}</option>
                <option value="rejected">{{ $t('booking.rejected') }}</option>
                <option value="cancelled">{{ $t('booking.cancelled') }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="rounded-lg shadow-md border overflow-hidden" :class="[themeClasses.cardBackground, themeClasses.border]">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b" :class="[themeClasses.border, themeClasses.background]">
                  <th class="p-4 font-semibold whitespace-nowrap" :class="themeClasses.textPrimary">
                    <div class="flex items-center gap-1">
                      {{ $t('booking.patient') }}
                    </div>
                  </th>
                  <th class="p-4 font-semibold whitespace-nowrap" :class="themeClasses.textPrimary">
                    <div class="flex items-center gap-1">
                      {{ $t('booking.service') }}
                    </div>
                  </th>
                  <th class="p-4 font-semibold whitespace-nowrap" :class="themeClasses.textPrimary">
                    <div class="flex items-center gap-1">
                      {{ $t('booking.date') }} & {{ $t('booking.time') }}
                    </div>
                  </th>
                  <th class="p-4 font-semibold whitespace-nowrap" :class="themeClasses.textPrimary">{{ $t('booking.notes') }}</th>
                  <th class="p-4 font-semibold whitespace-nowrap" :class="themeClasses.textPrimary">
                    <div class="flex items-center gap-1">
                      {{ $t('booking.status') }}
                    </div>
                  </th>
                  <th class="p-4 font-semibold text-right whitespace-nowrap" :class="themeClasses.textPrimary">{{ $t('booking.action') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading">
                  <td colspan="6" class="p-8">
                    <div class="flex flex-col items-center justify-center gap-3">
                      <svg class="w-6 h-6 animate-spin" :class="themeClasses.textSecondary" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      <span class="text-sm" :class="themeClasses.textSecondary">{{ $t('common.loading') || 'Loading...' }}</span>
                    </div>
                  </td>
                </tr>
                <tr v-else-if="bookings.length === 0">
                  <td colspan="6" class="p-12">
                    <div class="flex flex-col items-center justify-center text-center">
                      <div class="w-14 h-14 rounded-full flex items-center justify-center mb-3" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'">
                        <svg class="w-7 h-7 opacity-40" :class="themeClasses.textSecondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p class="text-sm font-medium" :class="themeClasses.textPrimary">{{ $t('common.noResults') }}</p>
                      <p class="text-xs mt-1" :class="themeClasses.textSecondary">{{ searchQuery ? 'Try adjusting your filters' : '' }}</p>
                    </div>
                  </td>
                </tr>
                <tr v-for="booking in paginatedBookings" :key="booking._id || booking.id" class="border-b last:border-0 transition-colors duration-150" :class="[themeClasses.border, themeClasses.hoverBackground]">
                  <td class="p-4">
                    <div class="min-w-0">
                      <div class="text-sm font-semibold truncate" :class="themeClasses.textPrimary">{{ booking.name || booking.patientName }}</div>
                      <div class="text-xs truncate" :class="themeClasses.textSecondary">{{ booking.email || booking.patientEmail }}</div>
                    </div>
                  </td>
                  <td class="p-4">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium" :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'">
                      {{ $t(`booking.${getServiceKey(booking.service)}`) }}
                    </span>
                  </td>
                  <td class="p-4 whitespace-nowrap">
                    <div class="text-sm font-medium" :class="themeClasses.textPrimary">{{ booking.date }}</div>
                    <div class="text-xs" :class="themeClasses.textSecondary">{{ booking.time }}</div>
                  </td>
                  <td class="p-4">
                    <div class="text-xs max-w-[150px] whitespace-normal break-words" :class="themeClasses.textSecondary" :title="booking.notes">
                      {{ booking.notes || '-' }}
                    </div>
                  </td>
                  <td class="p-4">
                    <span :class="getStatusClass(booking.status)" class="inline-flex items-center gap-1.5 w-24 justify-center px-2.5 py-1 rounded-full text-xs font-semibold">
                      <span class="w-1.5 h-1.5 rounded-full" :class="{
                        'bg-yellow-500': booking.status === 'pending',
                        'bg-green-500': booking.status === 'confirmed',
                        'bg-blue-500': booking.status === 'completed',
                        'bg-red-500': booking.status === 'cancelled' || booking.status === 'rejected',
                        'bg-gray-500': !['pending','confirmed','completed','cancelled','rejected'].includes(booking.status)
                      }" />
                      {{ $t(`booking.${booking.status}`) }}
                    </span>
                  </td>
                  <td class="p-3">
                    <div class="flex flex-col sm:flex-row flex-wrap justify-end gap-1.5 items-center">
                      <button 
                        v-if="booking.status === 'pending'"
                        @click="updateStatus(booking._id || booking.id, 'confirmed')"
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-all duration-150 hover:shadow-sm whitespace-nowrap"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                        {{ $t('booking.approve') }}
                      </button>
                      <button 
                        v-if="booking.status === 'pending'"
                        @click="updateStatus(booking._id || booking.id, 'rejected')"
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-all duration-150 hover:shadow-sm whitespace-nowrap"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        {{ $t('booking.reject') }}
                      </button>
                      <button 
                        v-if="booking.status === 'confirmed'"
                        @click="updateStatus(booking._id || booking.id, 'completed')"
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all duration-150 hover:shadow-sm whitespace-nowrap"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {{ $t('booking.complete') || 'Complete' }}
                      </button>
                      <button 
                        @click="deleteBookingRecord(booking._id || booking.id)"
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-2.5 py-1.5 border text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap"
                        :class="isDarkMode ? 'border-red-700 text-red-400 hover:bg-red-900/30' : 'border-red-300 text-red-600 hover:bg-red-50'"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        {{ $t('booking.delete') || 'Delete' }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination Controls -->
          <div v-if="totalPages > 1" class="flex justify-center items-center space-x-4 p-4 border-t" :class="themeClasses.border">
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded border disabled:opacity-50 transition-colors duration-200"
              :class="[themeClasses.border, themeClasses.textPrimary, themeClasses.hoverBackground]"
            >
              {{ $t('common.prev') || 'Prev' }}
            </button>
            <span class="text-sm" :class="themeClasses.textSecondary">
              {{ currentPage }} / {{ totalPages }}
            </span>
            <button 
              @click="currentPage++" 
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded border disabled:opacity-50 transition-colors duration-200"
              :class="[themeClasses.border, themeClasses.textPrimary, themeClasses.hoverBackground]"
            >
              {{ $t('common.next') || 'Next' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { useI18n } from 'vue-i18n'
import { fetchBookings, updateBooking, deleteBooking, fetchTimeSlots, updateTimeSlots, unmarkSlotBooked } from '../../services/bookingService'
import { sendAdminChatMessage, fetchCurrentUserProfile } from '../../services/userChatService'

const { themeClasses } = useTheme()
const { t } = useI18n()

const adminId = ref(null)

const loadProfile = async () => {
  try {
    const profile = await fetchCurrentUserProfile()
    const userData = profile?.data?.user || profile?.data || profile?.user || profile
    adminId.value = userData?.id || userData?._id || null
  } catch (error) {
    console.error('Failed to load admin profile:', error)
  }
}

const getServiceKey = (service) => {
  if (!service) return ''
  const map = {
    'GeneralCheckup': 'generalCheckup',
    'Health Status Checkup': 'healthStatusCheckup',
    'Health Consultation': 'healthConsultation',
    'therapy': 'therapy'
  }
  return map[service] || service
}

const bookings = ref([])

// ── Stats ────────────────────────────────────────────────────────────────
const statsToday = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  const todays = bookings.value.filter(b => b.date === today)
  return {
    pending:   todays.filter(b => b.status === 'pending').length,
    confirmed: todays.filter(b => b.status === 'confirmed').length,
    completed: todays.filter(b => b.status === 'completed').length,
    total:     todays.length
  }
})

const statsMonth = computed(() => {
  const now    = new Date()
  const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthly = bookings.value.filter(b => b.date && b.date.startsWith(prefix))
  return {
    pending:   monthly.filter(b => b.status === 'pending').length,
    confirmed: monthly.filter(b => b.status === 'confirmed').length,
    completed: monthly.filter(b => b.status === 'completed').length,
    total:     monthly.length
  }
})
// ── End Stats ─────────────────────────────────────────────────────────────
const isLoading = ref(true)
const errorMessage = ref('')

const currentPage = ref(1)
const itemsPerPage = 10

const _adminSort = (() => {
  try { return JSON.parse(localStorage.getItem('adminBookingSort') || '{}') } catch { return {} }
})()

const searchQuery   = ref('')
const sortKey       = ref(_adminSort.sortKey     || 'date')
const sortOrder     = ref(_adminSort.sortOrder   || 'desc')
const serviceFilter = ref(_adminSort.serviceFilter || '')
const statusFilter  = ref(_adminSort.statusFilter  || '')

const toggleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

watch([searchQuery, sortKey, sortOrder, serviceFilter, statusFilter], () => {
  currentPage.value = 1
})

watch([sortKey, sortOrder, serviceFilter, statusFilter], () => {
  localStorage.setItem('adminBookingSort', JSON.stringify({
    sortKey: sortKey.value,
    sortOrder: sortOrder.value,
    serviceFilter: serviceFilter.value,
    statusFilter: statusFilter.value
  }))
})

const filteredBookings = computed(() => {
  let result = bookings.value

  if (serviceFilter.value) {
    result = result.filter(b => b.service === serviceFilter.value)
  }

  if (statusFilter.value) {
    result = result.filter(b => b.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(b => {
      const name = (b.name || b.patientName || '').toLowerCase()
      const email = (b.email || b.patientEmail || '').toLowerCase()
      const service = (t(`booking.${getServiceKey(b.service)}`) || '').toLowerCase()
      const status = (t(`booking.${b.status}`) || '').toLowerCase()
      return name.includes(query) || email.includes(query) || service.includes(query) || status.includes(query)
    })
  }

  const statusPriority = (s) => s === 'pending' ? 0 : s === 'confirmed' ? 1 : 2

  return result.slice().sort((a, b) => {
    // Active statuses always float to top unless user is explicitly sorting by status
    if (sortKey.value !== 'status') {
      const pd = statusPriority(a.status) - statusPriority(b.status)
      if (pd !== 0) return pd
    }

    let valA, valB
    if (sortKey.value === 'name') {
      valA = (a.name || a.patientName || '').toLowerCase()
      valB = (b.name || b.patientName || '').toLowerCase()
    } else if (sortKey.value === 'date') {
      valA = new Date(`${a.date}T${a.time || '00:00'}`).getTime()
      valB = new Date(`${b.date}T${b.time || '00:00'}`).getTime()
    } else if (sortKey.value === 'service') {
      valA = (t(`booking.${getServiceKey(a.service)}`) || '').toLowerCase()
      valB = (t(`booking.${getServiceKey(b.service)}`) || '').toLowerCase()
    } else if (sortKey.value === 'status') {
      valA = statusPriority(a.status)
      valB = statusPriority(b.status)
      return sortOrder.value === 'asc' ? valA - valB : valB - valA
    }

    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

const totalPages = computed(() => Math.ceil(filteredBookings.value.length / itemsPerPage))

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredBookings.value.slice(start, end)
})

const loadBookings = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const res = await fetchBookings()
    if (res?.success) {
      bookings.value = res.bookings || []
    } else {
      errorMessage.value = res?.message || 'Failed to load bookings'
    }
  } catch (error) {
    console.error('Error loading bookings:', error)
    errorMessage.value = error.message || 'Failed to load bookings'
  } finally {
    isLoading.value = false
  }
}

// ── Availability Calendar ──────────────────────────────────────────────────
const CAL_TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', "18:00", "18:30", "19:00"
]
const CAL_DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calYear  = ref(new Date().getFullYear())
const calMonth = ref(new Date().getMonth()) // 0-indexed
const selectedCalDate = ref(null)           // 'YYYY-MM-DD'
const availability    = ref({})             // { 'YYYY-MM-DD': ['08:00', ...] }
const isSavingSlots      = ref(false)
const slotSaveMsg        = ref('')             // '' | 'saved' | 'error'
const isRefreshingCal    = ref(false)

const calendarTitle = computed(() =>
  new Date(calYear.value, calMonth.value, 1)
    .toLocaleString('default', { month: 'long', year: 'numeric' })
)

const calendarCells = computed(() => {
  const firstDay    = new Date(calYear.value, calMonth.value, 1).getDay()
  const daysInMonth = new Date(calYear.value, calMonth.value + 1, 0).getDate()
  const cells = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
})

const calDateKey = (day) => {
  const mm = String(calMonth.value + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${calYear.value}-${mm}-${dd}`
}

const calIsSelected = (day) => selectedCalDate.value === calDateKey(day)
const calHasSlots   = (day) => (availability.value[calDateKey(day)] || []).length > 0
const calIsToday    = (day) => {
  const now = new Date()
  return day === now.getDate() && calMonth.value === now.getMonth() && calYear.value === now.getFullYear()
}
const calIsPast     = (day) => {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return new Date(calYear.value, calMonth.value, day) < today
}

const calPrevMonth = () => {
  if (calMonth.value === 0) { calMonth.value = 11; calYear.value-- }
  else calMonth.value--
}
const calNextMonth = () => {
  if (calMonth.value === 11) { calMonth.value = 0; calYear.value++ }
  else calMonth.value++
}

const selectCalDate = (day) => {
  if (!day || calIsPast(day)) return
  selectedCalDate.value = calDateKey(day)
  slotSaveMsg.value = ''
}

const calIsSlotActive = (slot) =>
  (availability.value[selectedCalDate.value] || []).some(s => s.time === slot)

const calIsSlotBooked = (slot) =>
  (availability.value[selectedCalDate.value] || []).some(s => s.time === slot && s.booked)

// Returns the patient name + email for a booked slot, or null
const getSlotBooker = (slot) => {
  if (!selectedCalDate.value) return null
  const booking = bookings.value.find(b => {
    if (b.date !== selectedCalDate.value) return false
    // time field may be a single slot or comma-separated (e.g. "08:00, 09:00")
    const times = (b.time || '').split(',').map(t => t.trim())
    return times.includes(slot) && b.status !== 'cancelled' && b.status !== 'rejected'
  })
  if (!booking) return null
  const name  = booking.name || booking.patientName || ''
  const email = booking.email || booking.patientEmail || ''
  return name ? `${name} (${email})` : email
}

// Smart toggle:
//   booked  → unbook (keep active, clear booked flag)
//   active  → remove from availability
//   inactive → add as available
const calToggleSlot = (slot) => {
  if (!selectedCalDate.value) return
  const key     = selectedCalDate.value
  const current = [...(availability.value[key] || [])]
  const idx     = current.findIndex(s => s.time === slot)
  if (idx >= 0) {
    if (current[idx].booked) {
      current[idx] = { ...current[idx], booked: false }
    } else {
      current.splice(idx, 1)
    }
  } else {
    current.push({ time: slot, booked: false })
    current.sort((a, b) => a.time.localeCompare(b.time))
  }
  availability.value = { ...availability.value, [key]: current }
}

const calToggleAll = () => {
  if (!selectedCalDate.value) return
  const key        = selectedCalDate.value
  const current    = availability.value[key] || []
  const bookedSlots = current.filter(s => s.booked)
  // "all active" = every time slot has an entry (booked or not)
  const allActive  = CAL_TIME_SLOTS.every(t => current.some(s => s.time === t))
  availability.value = {
    ...availability.value,
    // toggle off → keep booked slots only; toggle on → fill all, preserving existing state
    [key]: allActive
      ? bookedSlots
      : CAL_TIME_SLOTS.map(t => current.find(s => s.time === t) || { time: t, booked: false })
  }
}

const calSaveSlots = async () => {
  isSavingSlots.value = true
  slotSaveMsg.value   = ''
  try {
    const slots = []
    for (const [date, slotObjs] of Object.entries(availability.value)) {
      for (const s of slotObjs) slots.push({ date, time: s.time, booked: s.booked })
    }
    const res = await updateTimeSlots(slots)
    slotSaveMsg.value = res?.success === false ? 'error' : 'saved'
  } catch (e) {
    console.error('Failed to save slots:', e)
    slotSaveMsg.value = 'error'
  } finally {
    isSavingSlots.value = false
    setTimeout(() => { slotSaveMsg.value = '' }, 3500)
  }
}

const loadAvailability = async () => {
  if (!adminId.value) return
  try {
    const res   = await fetchTimeSlots(adminId.value)
    const slots = res?.slots || res?.data?.slots || []
    const map   = {}
    for (const s of slots) {
      if (!map[s.date]) map[s.date] = []
      map[s.date].push({ time: s.time, booked: !!s.booked })
    }
    availability.value = map
  } catch (e) {
    console.error('Failed to load time slots:', e)
  }
}

const calHasBookedSlots = (day) =>
  (availability.value[calDateKey(day)] || []).some(s => s.booked)

const refreshAvailability = async () => {
  isRefreshingCal.value = true
  await loadAvailability()
  isRefreshingCal.value = false
}
// ── End Availability Calendar ───────────────────────────────────────────────

onMounted(async () => {
  await loadProfile()
  loadAvailability()
  loadBookings()
})

const getStatusClass = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

const updateStatus = async (id, newStatus) => {
  let rejectReason = ''
  if (newStatus === 'rejected') {
    rejectReason = prompt(t('booking.rejectReasonPrompt') || 'Please fill the reject reason:')
    if (rejectReason === null) return // User cancelled the prompt
  }

  try {
    const res = await updateBooking(id, { status: newStatus })
    if (res?.success) {
      const booking = bookings.value.find(b => b._id === id || b.id === id)
      if (booking) {
        booking.status = newStatus

        // Unblock the time slot(s) when a booking is rejected
        if (newStatus === 'rejected') {
          const providerId = booking.providerID || booking.providerId
          const times = (booking.time || '').split(',').map(t => t.trim()).filter(Boolean)
          for (const time of times) {
            try {
              await unmarkSlotBooked(providerId, booking.date, time)
            } catch (e) {
              console.error('Failed to unmark slot:', e)
            }
          }
        }
        
        // Send chat message
        const userId = booking.userId || booking.patientId || booking.patientID
        if (userId) {
          let messageText = ''
          const serviceName = t(`booking.${getServiceKey(booking.service)}`)
          const bookingDate = booking.date
          const bookingTime = booking.time

          if (newStatus === 'confirmed') {
            messageText = t('booking.approveMessage', { service: serviceName, date: bookingDate, time: bookingTime })
          } else if (newStatus === 'rejected') {
            messageText = `${t('booking.rejectMessage', { service: serviceName, date: bookingDate, time: bookingTime })} ${rejectReason}`
          }
          
          if (messageText) {
            try {
              await sendAdminChatMessage(userId, messageText, adminId.value)
            } catch (chatError) {
              console.error('Failed to send chat message:', chatError)
            }
          }
        }
      }
      // Refresh the bookings list and availability calendar
      await loadBookings()
      await loadAvailability()
    } else {
      alert(res?.message || 'Failed to update status')
    }
  } catch (error) {
    console.error('Error updating status:', error)
    alert(error.message || 'Failed to update status')
  }
}

const deleteBookingRecord = async (id) => {
  if (!confirm(t('booking.confirmDelete') || 'Are you sure you want to delete this appointment?')) return
  
  try {
    const res = await deleteBooking(id)
    if (res?.success) {
      await loadBookings()
    } else {
      alert(res?.message || 'Failed to delete appointment')
    }
  } catch (error) {
    console.error('Error deleting booking:', error)
    alert(error.message || 'Failed to delete appointment')
  }
}
</script>