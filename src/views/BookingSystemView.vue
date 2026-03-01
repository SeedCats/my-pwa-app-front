<template>
  <div class="min-h-screen" :class="themeClasses.background">
    <main class="px-3 sm:px-4 md:px-6 lg:px-8 pt-6 pb-12">

      <!-- ── Page Header ── -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/40">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight" :class="themeClasses.textPrimary">
              {{ $t('booking.title') }}
            </h1>
          </div>
          <p class="text-sm ml-13 pl-0.5" :class="themeClasses.textSecondary">
            {{ $t('booking.adminDesc') }}
          </p>
        </div>
        <!-- Quick stats badges -->
        <div class="flex items-center gap-2 flex-wrap">
          <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            {{ bookings.length }} {{ $t('booking.statsTotal') }}
          </div>
          <div v-if="pendingCount > 0" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-700">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            {{ pendingCount }} {{ $t('booking.pending') }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-5 gap-6 xl:gap-8 items-start">

        <!-- ══════════════════════════════════════════════════════════
             LEFT COLUMN  …Booking Form  (xl: 2/5 width)
        ═══════════════════════════════════════════════════════════-->
        <div class="xl:col-span-2">
          <div class="rounded-2xl shadow-sm border overflow-hidden" :class="[themeClasses.cardBackground, themeClasses.border]">

            <!-- Card header gradient banner -->
            <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 px-6 py-5">
              <!-- Decorative circles -->
              <div class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div class="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full"></div>
              <div class="relative flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-base font-bold text-white">{{ $t('booking.bookService') }}</h2>
                  <p class="text-[11px] text-blue-100 mt-0.5">{{ $t('booking.selectService') }}</p>
                </div>
              </div>
              <!-- Step trail -->
              <div class="relative flex items-center gap-1 mt-4">
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" :class="form.service ? 'bg-white text-blue-600' : 'bg-white/30 text-white'">1</div>
                  <span class="text-[10px] font-medium" :class="form.service ? 'text-white' : 'text-blue-200'">{{ $t('booking.bookingStepService') }}</span>
                </div>
                <div class="flex-1 h-px" :class="form.service ? 'bg-white/60' : 'bg-white/20'"></div>
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" :class="form.date && form.times.length > 0 ? 'bg-white text-blue-600' : 'bg-white/30 text-white'">2</div>
                  <span class="text-[10px] font-medium" :class="form.date && form.times.length > 0 ? 'text-white' : 'text-blue-200'">{{ $t('booking.bookingStepDateTime') }}</span>
                </div>
                <div class="flex-1 h-px" :class="form.date && form.times.length > 0 ? 'bg-white/60' : 'bg-white/20'"></div>
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-white/30 text-white">3</div>
                  <span class="text-[10px] font-medium text-blue-200">{{ $t('booking.bookingStepNotes') }}</span>
                </div>
              </div>
            </div>

            <form @submit.prevent="submitBooking" class="p-6 space-y-5">

              <!-- ①Service -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide mb-2" :class="themeClasses.textSecondary">
                  {{ $t('booking.service') }}
                </label>
                <div class="grid grid-cols-2 gap-2.5">
                  <button
                    v-for="svc in SERVICE_LIST"
                    :key="svc.value"
                    type="button"
                    @click="form.service = svc.value"
                    class="group relative flex flex-col items-start p-3.5 rounded-2xl border-2 transition-all duration-200 text-left overflow-hidden hover:scale-[1.02] active:scale-[0.99]"
                    :class="form.service === svc.value
                      ? 'border-blue-600 shadow-md shadow-blue-100 dark:shadow-blue-900/20'
                      : [themeClasses.inputBackground, themeClasses.border, 'hover:border-blue-300 dark:hover:border-blue-700']
                    "
                  >
                    <!-- Selected glow bg -->
                    <div v-if="form.service === svc.value" class="absolute inset-0 bg-gradient-to-br opacity-10" :class="svc.gradientFrom + ' ' + svc.gradientTo"></div>
                    <!-- Checkmark -->
                    <div v-if="form.service === svc.value" class="absolute top-2 right-2 w-4.5 h-4.5">
                      <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                    </div>
                    <!-- Icon circle -->
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center text-xl mb-2 transition-transform group-hover:scale-110" :class="svc.iconBg">
                      {{ svc.icon }}
                    </div>
                    <span class="text-xs font-semibold leading-tight relative z-10" :class="form.service === svc.value ? 'text-blue-600 dark:text-blue-400' : themeClasses.textPrimary">
                      {{ $t(`booking.${svc.key}`) }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- ②Provider -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide mb-2" :class="themeClasses.textSecondary">
                  {{ $t('booking.provider') }}
                </label>
                <div
                  v-if="providers.length === 1"
                  class="flex items-center gap-3 p-3 rounded-xl border"
                  :class="[themeClasses.inputBackground, themeClasses.border]"
                >
                  <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium truncate" :class="themeClasses.textPrimary">{{ providers[0].name }}</p>
                    <p class="text-xs" :class="themeClasses.textSecondary">{{ $t('booking.designatedProvider') }}</p>
                  </div>
                </div>
                <select
                  v-else
                  v-model="form.provider"
                  required
                  class="w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
                  :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]"
                >
                  <option value="" disabled>{{ $t('booking.selectProvider') }}</option>
                  <option v-for="provider in providers" :key="provider.id" :value="provider.id">{{ provider.name }}</option>
                </select>
              </div>

              <!-- ③Date & Time ── slot-aware ── -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide mb-2" :class="themeClasses.textSecondary">
                  {{ $t('booking.date') }} &amp; {{ $t('booking.time') }}
                </label>

                <!-- Loading -->
                <div v-if="isLoadingSlots" class="flex items-center justify-center gap-2 py-6 rounded-xl border" :class="[themeClasses.border, themeClasses.inputBackground]">
                  <svg class="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  <span class="text-xs" :class="themeClasses.textSecondary">{{ $t('booking.loadingSlots') }}</span>
                </div>

                <!-- No provider -->
                <div v-else-if="!form.provider" class="flex flex-col items-center justify-center py-6 rounded-xl border border-dashed gap-1" :class="[themeClasses.border, themeClasses.textSecondary]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p class="text-xs">{{ $t('booking.selectProvider') }}</p>
                </div>

                <!-- No slots configured -->
                <div v-else-if="Object.keys(providerAvailability).length === 0" class="flex flex-col items-center justify-center py-6 rounded-xl border border-dashed gap-1" :class="[themeClasses.border, themeClasses.textSecondary]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-xs">{{ $t('booking.noProviderSlots') }}</p>
                </div>

                <template v-else>
                  <!-- Mini Calendar -->
                  <div class="rounded-xl border overflow-hidden mb-3" :class="themeClasses.border">
                    <div class="flex items-center justify-between px-3 py-2 border-b" :class="[themeClasses.border, themeClasses.inputBackground]">
                      <button type="button" @click="bookCalPrev" class="p-1.5 rounded-lg transition-colors" :class="[themeClasses.hoverBackground, themeClasses.textPrimary]">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span class="text-xs font-semibold" :class="themeClasses.textPrimary">{{ bookCalendarTitle }}</span>
                      <button type="button" @click="bookCalNext" class="p-1.5 rounded-lg transition-colors" :class="[themeClasses.hoverBackground, themeClasses.textPrimary]">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    <div class="grid grid-cols-7 gap-0.5 p-1" :class="themeClasses.inputBackground">
                      <div v-for="h in BOOK_CAL_HEADERS" :key="h" class="text-center text-[10px] font-semibold py-1" :class="themeClasses.textSecondary">{{ h }}</div>
                      <div v-for="(cell, idx) in bookCalendarCells" :key="idx">
                        <div v-if="cell === null" class="aspect-square" />
                        <button
                          v-else
                          type="button"
                          @click="selectBookDate(cell)"
                          :disabled="!bookDateAvailable(cell)"
                          class="relative aspect-square w-full flex items-center justify-center rounded-lg text-xs font-medium transition-all"
                          :class="form.date === bookDateKey(cell)
                            ? 'bg-blue-600 text-white shadow-md scale-105 ring-2 ring-blue-400 ring-offset-1'
                            : bookDateKey(cell) === todayKey
                              ? ['ring-2 ring-blue-400 font-bold', themeClasses.textPrimary, themeClasses.hoverBackground]
                              : bookDateAvailable(cell)
                                ? [themeClasses.hoverBackground, themeClasses.textPrimary, 'ring-1 ring-green-500 ring-inset font-semibold']
                                : ['opacity-25 cursor-not-allowed', themeClasses.textSecondary]
                          "
                        >
                          {{ cell }}
                          <span v-if="bookDateKey(cell) === todayKey && form.date !== bookDateKey(cell)" class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500"></span>
                        </button>
                      </div>
                    </div>
                    <div class="px-3 py-1.5 border-t flex items-center gap-1.5 text-[10px]" :class="[themeClasses.border, themeClasses.textSecondary]">
                      <span class="inline-block w-2 h-2 rounded-sm ring-1 ring-green-500 flex-shrink-0" />
                      {{ $t('booking.availableDates') }}
                    </div>
                  </div>

                  <!-- Selected date chip -->
                  <div v-if="form.date" class="mb-3 flex items-center justify-between flex-wrap gap-2">
                    <span class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-600 text-white shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {{ form.date }}
                    </span>
                    <!-- Slot counter badge -->
                    <span
                      class="text-xs font-medium px-2.5 py-1 rounded-full"
                      :class="form.times.length >= 1
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'"
                    >
                      {{ $t('booking.selectedSlots', { n: form.times.length }) }}
                    </span>
                  </div>

                  <!-- Time slots grid -->
                  <div v-if="form.date">
                    <p class="text-xs mb-2" :class="themeClasses.textSecondary">{{ $t('booking.maxTwoSlots') }}</p>
                    <div v-if="bookTimeSlotsForDate.length === 0" class="text-xs py-2" :class="themeClasses.textSecondary">
                      {{ $t('booking.noSlotsForDate') }}
                    </div>
                    <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                      <button
                        v-for="slot in bookTimeSlotsForDate"
                        :key="slot.time"
                        type="button"
                        @click="!slot.booked && toggleTimeSlot(slot.time)"
                        :disabled="slot.booked || (!form.times.includes(slot.time) && form.times.length >= 2)"
                        class="py-2.5 rounded-xl text-xs font-medium border transition-all duration-150 flex flex-col items-center justify-center leading-tight hover:scale-[1.03] active:scale-[0.97]"
                        :class="slot.booked
                          ? ['opacity-40 cursor-not-allowed', themeClasses.inputBackground, themeClasses.border, themeClasses.textSecondary]
                          : form.times.includes(slot.time)
                            ? 'bg-gradient-to-br from-blue-500 to-blue-700 border-blue-600 text-white shadow-md scale-[1.05]'
                            : form.times.length >= 2
                              ? ['opacity-30 cursor-not-allowed', themeClasses.inputBackground, themeClasses.border, themeClasses.textSecondary]
                              : [themeClasses.inputBackground, 'border-transparent ring-1 ring-inset', themeClasses.textPrimary, themeClasses.hoverBackground, 'hover:ring-blue-400 dark:hover:ring-blue-500']
                        "
                      >
                        <svg v-if="form.times.includes(slot.time)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        <span>{{ slot.time }}</span>
                        <span v-if="slot.booked" class="text-[8px] font-bold uppercase tracking-wide mt-0.5 opacity-60">{{ $t('booking.slotBooked') }}</span>
                      </button>
                    </div>

                    <!-- Selected time chips -->
                    <div v-if="form.times.length > 0" class="mt-3 flex flex-wrap gap-2">
                      <span
                        v-for="timeSlot in form.times"
                        :key="timeSlot"
                        class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ timeSlot }}
                        <button type="button" @click="toggleTimeSlot(timeSlot)" class="ml-0.5 hover:text-red-500 transition-colors">×</button>
                      </span>
                    </div>
                  </div>

                  <!-- Prompt to pick date -->
                  <div v-else class="text-xs py-1" :class="themeClasses.textSecondary">
                    {{ $t('booking.pickAvailableDate') }}
                  </div>
                </template>
              </div>

              <!-- ④Notes -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide mb-2" :class="themeClasses.textSecondary">
                  {{ $t('booking.notes') }}
                </label>
                <textarea
                  v-model="form.notes"
                  rows="3"
                  class="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none resize-none text-sm transition-all"
                  :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]"
                  :placeholder="$t('booking.notes') + '...'"
                ></textarea>
              </div>

              <!-- Booking Summary -->
              <transition name="summary-slide">
                <div
                  v-if="form.service && form.date && form.times.length > 0"
                  class="rounded-2xl border-2 border-blue-200 dark:border-blue-800 overflow-hidden"
                >
                  <div class="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    <span class="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">{{ $t('booking.bookingSummary') }}</span>
                  </div>
                  <div class="p-4 space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="flex items-center gap-1.5 text-xs" :class="themeClasses.textSecondary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                        {{ $t('booking.service') }}
                      </span>
                      <span class="text-xs font-semibold" :class="themeClasses.textPrimary">
                        {{ SERVICE_LIST.find(s => s.value === form.service)?.icon }} {{ $t(`booking.${SERVICE_LIST.find(s => s.value === form.service)?.key}`) }}
                      </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="flex items-center gap-1.5 text-xs" :class="themeClasses.textSecondary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        {{ $t('booking.date') }}
                      </span>
                      <span class="text-xs font-semibold" :class="themeClasses.textPrimary">{{ form.date }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="flex items-center gap-1.5 text-xs" :class="themeClasses.textSecondary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        {{ $t('booking.time') }}
                      </span>
                      <span class="text-xs font-semibold" :class="themeClasses.textPrimary">{{ form.times.join(' • ') }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="flex items-center gap-1.5 text-xs" :class="themeClasses.textSecondary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        {{ $t('booking.provider') }}
                      </span>
                      <span class="text-xs font-semibold" :class="themeClasses.textPrimary">{{ getProviderName(form.provider) }}</span>
                    </div>
                  </div>
                </div>
              </transition>

              <!-- Submit -->
              <button
                type="submit"
                :disabled="isSubmitting || !form.service || !form.date || form.times.length === 0"
                class="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/40 active:scale-[0.99]"
              >
                <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  {{ $t('common.loading') }}
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  {{ $t('booking.submit') }}
                </span>
              </button>

              <!-- Feedback -->
              <transition name="fade">
                <div v-if="successMessage" class="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p class="text-sm text-green-700 dark:text-green-400">{{ successMessage }}</p>
                </div>
              </transition>
              <transition name="fade">
                <div v-if="errorMessage" class="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm text-red-700 dark:text-red-400">{{ errorMessage }}</p>
                </div>
              </transition>
            </form>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════════════
             RIGHT COLUMN  …Appointments  (xl: 3/5 width)
        ═══════════════════════════════════════════════════════════-->
        <div ref="appointmentsRef" class="xl:col-span-3 flex flex-col gap-4">

          <!-- Section header + filters -->
          <div class="rounded-2xl shadow-sm border p-4" :class="[themeClasses.cardBackground, themeClasses.border]">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 class="text-base font-semibold" :class="themeClasses.textPrimary">{{ $t('booking.upcoming') }}</h2>
                <span v-if="filteredBookings.length > 0" class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 font-bold">
                  {{ filteredBookings.length }}
                </span>
              </div>
              <button
                @click="toggleSort('date')"
                class="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
                :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border, themeClasses.hoverBackground]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                {{ $t('common.sort') }} {{ sortKey === 'date' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
              </button>
            </div>
            <!-- Status pill filter tabs -->
            <div class="flex flex-wrap gap-1.5 mb-2">
              <button
                v-for="tab in STATUS_TABS"
                :key="tab.value"
                @click="statusFilter = tab.value"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border"
                :class="statusFilter === tab.value
                  ? tab.activeClass
                  : [themeClasses.inputBackground, themeClasses.border, themeClasses.textSecondary, 'hover:border-current']
                "
              >
                <span>{{ tab.icon }}</span>
                <span>{{ $t(tab.label) }}</span>
                <span v-if="tab.value && bookings.filter(b => b.status === tab.value).length > 0" class="ml-0.5 opacity-80">({{ bookings.filter(b => b.status === tab.value).length }})</span>
              </button>
            </div>
            <!-- Search -->
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" :class="themeClasses.textSecondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                v-model="searchQuery"
                :placeholder="$t('common.search') + '...'"
                class="w-full pl-9 pr-4 py-2 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition-colors"
                :class="[themeClasses.inputBackground, themeClasses.textPrimary, themeClasses.border]"
              />
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 gap-3">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            </div>
            <p class="text-sm font-medium" :class="themeClasses.textSecondary">{{ $t('common.loading') }}</p>
          </div>

          <!-- Empty state -->
          <div v-else-if="filteredBookings.length === 0" class="flex flex-col items-center justify-center py-16 gap-4 rounded-2xl border border-dashed" :class="[themeClasses.border, themeClasses.cardBackground]">
            <div class="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="text-center">
              <p class="font-bold text-sm" :class="themeClasses.textPrimary">{{ $t('booking.noAppointments') }}</p>
              <p class="text-xs mt-1 max-w-xs" :class="themeClasses.textSecondary">{{ $t('booking.noAppointmentsDesc') }}</p>
            </div>
          </div>

          <!-- Appointment cards -->
          <template v-else>
            <div
              v-for="(booking, idx) in paginatedBookings"
              :key="booking._id || booking.id"
              class="rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 card-enter"
              :class="[themeClasses.cardBackground, themeClasses.border]"
              :style="{ animationDelay: `${idx * 50}ms` }"
            >
              <div class="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <!-- Icon -->
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl shadow-sm"
                  :class="getServiceBg(booking.service)">
                  {{ getServiceIcon(booking.service) }}
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-sm truncate" :class="themeClasses.textPrimary">
                    {{ $t(`booking.${getServiceKey(booking.service)}`) }}
                  </h3>
                  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                    <span class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" :class="[themeClasses.inputBackground, themeClasses.textSecondary]">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {{ booking.date }}
                    </span>
                    <span class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" :class="[themeClasses.inputBackground, themeClasses.textSecondary]">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ booking.time }}
                    </span>
                    <span class="inline-flex items-center gap-1 text-xs" :class="themeClasses.textSecondary">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {{ getProviderName(booking.providerID || booking.providerId) }}
                    </span>
                  </div>
                </div>

                <!-- Status + action -->
                <div class="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                  <span :class="getStatusClass(booking.status)" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDot(booking.status)"></span>
                    {{ $t(`booking.${booking.status}`) }}
                  </span>
                  <button
                    v-if="booking.status === 'pending'"
                    @click="cancelBooking(booking._id || booking.id)"
                    class="text-xs px-3 py-1 rounded-lg border border-red-300 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all hover:scale-[1.03] active:scale-[0.97]"
                  >
                    {{ $t('booking.cancel') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 pt-2">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="flex items-center gap-1 px-4 py-2 rounded-xl border text-sm disabled:opacity-40 transition-all"
                :class="[themeClasses.inputBackground, themeClasses.border, themeClasses.textPrimary, themeClasses.hoverBackground]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                {{ $t('common.prev') }}
              </button>
              <span class="text-sm font-medium px-3" :class="themeClasses.textSecondary">{{ currentPage }} / {{ totalPages }}</span>
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="flex items-center gap-1 px-4 py-2 rounded-xl border text-sm disabled:opacity-40 transition-all"
                :class="[themeClasses.inputBackground, themeClasses.border, themeClasses.textPrimary, themeClasses.hoverBackground]"
              >
                {{ $t('common.next') }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useI18n } from 'vue-i18n'
import { fetchBookings, createBooking, updateBooking, fetchTimeSlots, markSlotBooked } from '../services/bookingService'
import { fetchCurrentUserProfile } from '../services/userChatService'

const { themeClasses } = useTheme()
const { t } = useI18n()

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

const SERVICE_LIST = [
  { value: 'GeneralCheckup',        key: 'generalCheckup',       icon: '🩺', iconBg: 'bg-red-50 dark:bg-red-900/30',    gradientFrom: 'from-red-400',    gradientTo: 'to-rose-500' },
  { value: 'Health Status Checkup', key: 'healthStatusCheckup',  icon: '📊', iconBg: 'bg-blue-50 dark:bg-blue-900/30',  gradientFrom: 'from-blue-400',   gradientTo: 'to-cyan-500' },
  { value: 'Health Consultation',   key: 'healthConsultation',   icon: '💬', iconBg: 'bg-purple-50 dark:bg-purple-900/30', gradientFrom: 'from-purple-400', gradientTo: 'to-violet-500' },
  { value: 'therapy',               key: 'therapy',              icon: '🧘', iconBg: 'bg-green-50 dark:bg-green-900/30', gradientFrom: 'from-green-400',  gradientTo: 'to-emerald-500' }
]

const STATUS_TABS = [
  { value: '',           label: 'booking.allStatus', icon: '📋', activeClass: 'bg-gray-800 text-white border-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:border-gray-100' },
  { value: 'pending',   label: 'booking.pending',   icon: '⏳', activeClass: 'bg-amber-500 text-white border-amber-500' },
  { value: 'confirmed', label: 'booking.confirmed', icon: '✅', activeClass: 'bg-green-500 text-white border-green-500' },
  { value: 'completed', label: 'booking.completed',  icon: '🏁', activeClass: 'bg-blue-500 text-white border-blue-500' },
  { value: 'rejected',  label: 'booking.rejected',  icon: '❌', activeClass: 'bg-red-500 text-white border-red-500' },
  { value: 'cancelled', label: 'booking.cancelled', icon: '🚫', activeClass: 'bg-slate-500 text-white border-slate-500' }
]

const getServiceIcon = (service) => {
  return SERVICE_LIST.find(s => s.value === service)?.icon || '📅'
}

const todayKey = (() => {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
})()

const pendingCount = computed(() => bookings.value.filter(b => b.status === 'pending').length)

const getStatusDot = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-green-600 dark:bg-green-400'
    case 'pending':   return 'bg-amber-500 dark:bg-amber-400'
    case 'cancelled': return 'bg-slate-500 dark:bg-slate-400'
    case 'rejected':  return 'bg-red-600 dark:bg-red-400'
    case 'completed': return 'bg-blue-600 dark:bg-blue-400'
    default:          return 'bg-gray-400'
  }
}

const getServiceBg = (service) => {
  const map = {
    'GeneralCheckup':        'bg-red-100 dark:bg-red-900/30',
    'Health Status Checkup': 'bg-blue-100 dark:bg-blue-900/30',
    'Health Consultation':   'bg-purple-100 dark:bg-purple-900/30',
    'therapy':               'bg-green-100 dark:bg-green-900/30'
  }
  return map[service] || 'bg-gray-100 dark:bg-gray-800'
}

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const isLoading = ref(true)

// ── Availability calendar (booking form) ────────────────────────────────
const BOOK_CAL_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const providerAvailability = ref({})   // { 'YYYY-MM-DD': ['08:00', ...] }
const isLoadingSlots = ref(false)
const bookCalYear  = ref(new Date().getFullYear())
const bookCalMonth = ref(new Date().getMonth())

const bookCalendarTitle = computed(() =>
  new Date(bookCalYear.value, bookCalMonth.value, 1)
    .toLocaleString('default', { month: 'long', year: 'numeric' })
)

const bookCalendarCells = computed(() => {
  const firstDay    = new Date(bookCalYear.value, bookCalMonth.value, 1).getDay()
  const daysInMonth = new Date(bookCalYear.value, bookCalMonth.value + 1, 0).getDate()
  const cells = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
})

const bookDateKey = (day) => {
  const mm = String(bookCalMonth.value + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${bookCalYear.value}-${mm}-${dd}`
}

const bookDateAvailable = (day) => {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const d = new Date(bookCalYear.value, bookCalMonth.value, day)
  if (d < today) return false
  const key = bookDateKey(day)
  return (providerAvailability.value[key] || []).some(s => !s.booked)
}

const form = ref({
  service: '',
  provider: '',
  date: '',
  times: [],
  notes: ''
})

const toggleTimeSlot = (slot) => {
  const idx = form.value.times.indexOf(slot)
  if (idx >= 0) {
    form.value.times.splice(idx, 1)
  } else if (form.value.times.length < 2) {
    form.value.times.push(slot)
    form.value.times.sort()
  }
}

const bookTimeSlotsForDate = computed(() => {
  if (!form.value.date) return []
  return providerAvailability.value[form.value.date] || []
})

const bookCalPrev = () => {
  if (bookCalMonth.value === 0) { bookCalMonth.value = 11; bookCalYear.value-- }
  else bookCalMonth.value--
}
const bookCalNext = () => {
  if (bookCalMonth.value === 11) { bookCalMonth.value = 0; bookCalYear.value++ }
  else bookCalMonth.value++
}

const selectBookDate = (day) => {
  if (!bookDateAvailable(day)) return
  form.value.date = bookDateKey(day)
  form.value.times = []
}

const loadProviderSlots = async (providerId) => {
  if (!providerId) { providerAvailability.value = {}; return }
  isLoadingSlots.value = true
  try {
    const res   = await fetchTimeSlots(providerId)
    const slots = res?.slots || res?.data?.slots || []
    const map   = {}
    for (const s of slots) {
      if (!map[s.date]) map[s.date] = []
      map[s.date].push({ time: s.time, booked: !!s.booked })
    }
    providerAvailability.value = map
  } catch (e) {
    console.error('Failed to fetch provider slots:', e)
    providerAvailability.value = {}
  } finally {
    isLoadingSlots.value = false
  }
}
// ── End availability calendar ────────────────────────────────────────────

const providerName = ref('')
const providerId = ref('')

const providers = ref([])

const bookings = ref([])

const currentPage = ref(1)
const itemsPerPage = 10
const appointmentsRef = ref(null)

const changePage = (page) => {
  currentPage.value = page
  appointmentsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const _userSort = (() => {
  try { return JSON.parse(localStorage.getItem('userBookingSort') || '{}') } catch { return {} }
})()

const searchQuery  = ref('')
const sortOrder    = ref(_userSort.sortOrder   || 'desc')
const sortKey      = ref(_userSort.sortKey     || 'date')
const statusFilter = ref(_userSort.statusFilter || '')

const toggleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

watch([searchQuery, sortKey, sortOrder, statusFilter], () => {
  currentPage.value = 1
})

watch([sortKey, sortOrder, statusFilter], () => {
  localStorage.setItem('userBookingSort', JSON.stringify({
    sortKey: sortKey.value,
    sortOrder: sortOrder.value,
    statusFilter: statusFilter.value
  }))
})

const filteredBookings = computed(() => {
  let result = bookings.value
  
  if (statusFilter.value) {
    result = result.filter(b => b.status === statusFilter.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(b => {
      const service = (t(`booking.${getServiceKey(b.service)}`) || '').toLowerCase()
      const provider = (getProviderName(b.providerID || b.providerId) || '').toLowerCase()
      const status = (t(`booking.${b.status}`) || '').toLowerCase()
      return service.includes(query) || provider.includes(query) || status.includes(query)
    })
  }

  const statusPriority = (s) => ({ pending: 0, confirmed: 1, completed: 2, rejected: 3, cancelled: 4 }[s] ?? 5)

  return result.slice().sort((a, b) => {
    // Active statuses always float to top unless user is explicitly sorting by status
    if (sortKey.value !== 'status') {
      const pd = statusPriority(a.status) - statusPriority(b.status)
      if (pd !== 0) return pd
    }

    if (sortKey.value === 'status') {
      const pa = statusPriority(a.status)
      const pb = statusPriority(b.status)
      return sortOrder.value === 'asc' ? pa - pb : pb - pa
    }

    const valA = `${a.date || ''}T${(a.time || '').split(',')[0].trim() || '00:00'}`
    const valB = `${b.date || ''}T${(b.time || '').split(',')[0].trim() || '00:00'}`
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

// Reload provider slots and reset date/time whenever the provider changes
watch(() => form.value.provider, (newId) => {
  form.value.date = ''
  form.value.times = []
  providerAvailability.value = {}
  loadProviderSlots(newId)
})

const getProviderName = (id) => {
  if (id === providerId.value) return providerName.value
  const provider = providers.value.find(p => p.id === id)
  return provider ? provider.name : 'Unknown'
}

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

const loadData = async () => {
  isLoading.value = true
  try {
    // Load user profile to get designated provider
    const profileRes = await fetchCurrentUserProfile()
    const userData = profileRes?.data?.user || profileRes?.data || profileRes?.user || profileRes
    if (userData?.providerId) {
      providerId.value = userData.providerId
      providerName.value = userData.provider || userData.providerName || userData.assignedProvider || 'Designated Provider'
      
      // Set form provider to designated provider
      form.value.provider = providerId.value
      
      // Update providers list to only show designated provider
      providers.value = [{ id: providerId.value, name: providerName.value }]
    }

    // Load bookings
    const bookingsRes = await fetchBookings()
    if (bookingsRes?.success) {
      bookings.value = bookingsRes.bookings || []
    }

    // Load provider slots now that providerId is set
    if (form.value.provider) {
      await loadProviderSlots(form.value.provider)
    }
  } catch (error) {
    console.error('Error loading booking data:', error)
    errorMessage.value = 'Failed to load data. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

const submitBooking = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.value.date) {
    errorMessage.value = t('booking.pickAvailableDate')
    isSubmitting.value = false
    return
  }
  if (form.value.times.length === 0) {
    errorMessage.value = t('booking.selectTimeSlot')
    isSubmitting.value = false
    return
  }
  
  try {
    const bookingData = {
      service: form.value.service,
      providerID: form.value.provider,
      providerName: getProviderName(form.value.provider),
      date: form.value.date,
      time: form.value.times.join(', '),
      notes: form.value.notes
    }
    
    const res = await createBooking(bookingData)
    
    if (res?.success) {
      bookings.value.unshift(res.booking)

      // Mark each booked time slot as taken so other users can't select them
      for (const time of form.value.times) {
        await markSlotBooked(form.value.provider, form.value.date, time, true)
      }

      // Refresh provider slots after booking
      await loadProviderSlots(form.value.provider)

      // Reset form (keep provider so the user can book again)
      form.value = {
        service: '',
        provider: providerId.value || '',
        date: '',
        times: [],
        notes: ''
      }
      
      successMessage.value = t('booking.success') || 'Appointment created successfully'
      
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      errorMessage.value = res?.message || 'Failed to create appointment'
    }
  } catch (error) {
    console.error('Error creating booking:', error)
    errorMessage.value = error.message || 'Failed to create appointment'
  } finally {
    isSubmitting.value = false
  }
}

const cancelBooking = async (id) => {
  if (!confirm(t('booking.confirmCancel') || 'Are you sure you want to cancel this appointment?')) return
  
  try {
    const res = await updateBooking(id, { status: 'cancelled' })
    if (res?.success) {
      const booking = bookings.value.find(b => b._id === id || b.id === id)
      if (booking) {
        booking.status = 'cancelled'
      }
    } else {
      alert(res?.message || 'Failed to cancel appointment')
    }
  } catch (error) {
    console.error('Error cancelling booking:', error)
    alert(error.message || 'Failed to cancel appointment')
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Booking summary slide-in */
.summary-slide-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.summary-slide-leave-active {
  transition: all 0.2s ease;
}
.summary-slide-enter-from,
.summary-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

/* Appointment card entrance */
@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.card-enter {
  animation: card-in 0.3s ease both;
}


</style>