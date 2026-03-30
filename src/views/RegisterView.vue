<template>
  <div
    class="flex min-h-dvh flex-1 items-center justify-center px-3 py-8 sm:px-6 lg:px-8 bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">

    <div class="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl space-y-6">

      <!-- Header -->
      <div class="text-center space-y-3">
        <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-sm">
          <span class="flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600">
            <svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
          <span class="text-xs font-semibold tracking-widest text-indigo-600 uppercase">{{ $t('nav.title') }}</span>
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            {{ showProviderForm ? $t('auth.providerFormTitle') : $t('auth.createAccountTitle') }}
          </h1>
          <p class="mt-1 text-sm sm:text-base text-gray-500">
            {{ showProviderForm ? $t('auth.providerFormSubtitle') : $t('auth.createAccountSubtitle') }}
          </p>
        </div>
      </div>

      <!-- Card -->
      <div class="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl shadow-indigo-100/50 border border-white/60 overflow-hidden">

        <!-- Form type pill tabs -->
        <div class="flex p-1.5 bg-gray-100/80 mx-4 sm:mx-6 mt-4 sm:mt-6 rounded-xl gap-1">
          <button type="button" @click="setUserForm"
            :class="['flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200',
              !showProviderForm ? 'bg-white text-indigo-700 shadow-sm shadow-indigo-100' : 'text-gray-500 hover:text-gray-700']">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {{ $t('auth.userTabLabel') }}
          </button>
          <button type="button" @click="setProviderForm"
            :class="['flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200',
              showProviderForm ? 'bg-white text-indigo-700 shadow-sm shadow-indigo-100' : 'text-gray-500 hover:text-gray-700']">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {{ $t('auth.providerTabLabel') }}
          </button>
        </div>

        <div class="p-4 sm:p-6 lg:p-8">
          <!-- Alert Messages -->
          <Transition name="slide-fade">
            <div v-if="error" class="mb-4 sm:mb-5 flex items-start gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
              <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd" />
              </svg>
              <p class="text-sm text-red-700 leading-relaxed">{{ error }}</p>
            </div>
          </Transition>

          <Transition name="slide-fade">
            <div v-if="success" class="mb-4 sm:mb-5 flex items-start gap-3 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <svg class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd" />
              </svg>
              <p class="text-sm text-emerald-700 leading-relaxed">{{ success }}</p>
            </div>
          </Transition>

          <form @submit.prevent="handleRegister" novalidate>
            <Transition name="form-switch" mode="out-in">
              <!-- ── USER REGISTRATION FORM ── -->
              <div v-if="!showProviderForm" key="user-form" class="space-y-4 sm:space-y-5">

                <!-- Name -->
                <div class="space-y-1.5">
                  <label for="name" class="block text-sm font-medium text-gray-700">
                    {{ $t('auth.nameLabel') }} <span class="text-red-400">*</span>
                  </label>
                  <div :class="['relative flex items-center rounded-xl border transition-all duration-200 bg-white',
                    fieldErrors.name ? 'border-red-400 ring-1 ring-red-300' :
                    touchedFields.name && registerForm.name ? 'border-emerald-400 ring-1 ring-emerald-200' :
                    'border-gray-200 hover:border-indigo-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100']">
                    <div class="pl-3.5 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input id="name" name="name" type="text" autocomplete="name"
                      v-model="registerForm.name" @blur="touchField('name')"
                      class="w-full rounded-xl bg-transparent pl-2.5 pr-10 py-3 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 border-0 focus:ring-0 focus:outline-none"
                      :placeholder="$t('auth.namePlaceholder')" />
                    <div class="pr-3.5">
                      <svg v-if="touchedFields.name && registerForm.name && !fieldErrors.name" class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <Transition name="slide-fade">
                    <p v-if="fieldErrors.name" class="text-xs text-red-500 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                      {{ fieldErrors.name }}
                    </p>
                  </Transition>
                </div>

                <!-- Email -->
                <div class="space-y-1.5">
                  <label for="email-address" class="block text-sm font-medium text-gray-700">
                    {{ $t('auth.emailLabel') }} <span class="text-red-400">*</span>
                  </label>
                  <div :class="['relative flex items-center rounded-xl border transition-all duration-200 bg-white',
                    fieldErrors.email ? 'border-red-400 ring-1 ring-red-300' :
                    touchedFields.email && registerForm.email && !fieldErrors.email ? 'border-emerald-400 ring-1 ring-emerald-200' :
                    'border-gray-200 hover:border-indigo-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100']">
                    <div class="pl-3.5 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input id="email-address" name="email" type="email" autocomplete="email"
                      v-model="registerForm.email" @blur="touchField('email')"
                      class="w-full rounded-xl bg-transparent pl-2.5 pr-10 py-3 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 border-0 focus:ring-0 focus:outline-none"
                      :placeholder="$t('auth.emailPlaceholder')" />
                    <div class="pr-3.5">
                      <svg v-if="touchedFields.email && registerForm.email && !fieldErrors.email" class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <Transition name="slide-fade">
                    <p v-if="fieldErrors.email" class="text-xs text-red-500 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                      {{ fieldErrors.email }}
                    </p>
                  </Transition>
                </div>

                <!-- Password -->
                <div class="space-y-1.5">
                  <label for="password" class="block text-sm font-medium text-gray-700">
                    {{ $t('auth.passwordLabel') }} <span class="text-red-400">*</span>
                  </label>
                  <div :class="['relative flex items-center rounded-xl border transition-all duration-200 bg-white',
                    fieldErrors.password ? 'border-red-400 ring-1 ring-red-300' :
                    'border-gray-200 hover:border-indigo-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100']">
                    <div class="pl-3.5 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input id="password" name="password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password"
                      v-model="registerForm.password" @blur="touchField('password')"
                      class="w-full rounded-xl bg-transparent pl-2.5 pr-2 py-3 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 border-0 focus:ring-0 focus:outline-none"
                      :placeholder="$t('auth.passwordPlaceholder')" />
                    <button type="button" @click="showPassword = !showPassword"
                      class="pr-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none shrink-0"
                      :aria-label="showPassword ? $t('auth.hidePassword') : $t('auth.showPassword')">
                      <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    </button>
                  </div>
                  <!-- Password strength meter -->
                  <div v-if="registerForm.password" class="space-y-1">
                    <div class="flex gap-1">
                      <div v-for="i in 4" :key="i"
                        :class="['h-1 flex-1 rounded-full transition-all duration-300',
                          i <= passwordStrength.score ? passwordStrength.color : 'bg-gray-200']"></div>
                    </div>
                    <p :class="['text-xs font-medium transition-colors', passwordStrength.textColor]">
                      {{ passwordStrength.label }}
                    </p>
                  </div>
                  <Transition name="slide-fade">
                    <p v-if="fieldErrors.password" class="text-xs text-red-500 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                      {{ fieldErrors.password }}
                    </p>
                  </Transition>
                </div>

                <!-- Confirm Password -->
                <div class="space-y-1.5">
                  <label for="confirm-password" class="block text-sm font-medium text-gray-700">
                    {{ $t('auth.confirmPasswordLabel') }} <span class="text-red-400">*</span>
                  </label>
                  <div :class="['relative flex items-center rounded-xl border transition-all duration-200 bg-white',
                    fieldErrors.confirmPassword ? 'border-red-400 ring-1 ring-red-300' :
                    touchedFields.confirmPassword && registerForm.confirmPassword && !fieldErrors.confirmPassword ? 'border-emerald-400 ring-1 ring-emerald-200' :
                    'border-gray-200 hover:border-indigo-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100']">
                    <div class="pl-3.5 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <input id="confirm-password" name="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" autocomplete="new-password"
                      v-model="registerForm.confirmPassword" @blur="touchField('confirmPassword')"
                      class="w-full rounded-xl bg-transparent pl-2.5 pr-2 py-3 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 border-0 focus:ring-0 focus:outline-none"
                      :placeholder="$t('auth.confirmPasswordPlaceholder')" />
                    <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                      class="pr-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none shrink-0"
                      :aria-label="showConfirmPassword ? $t('auth.hidePassword') : $t('auth.showPassword')">
                      <svg v-if="!showConfirmPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    </button>
                  </div>
                  <Transition name="slide-fade">
                    <p v-if="fieldErrors.confirmPassword" class="text-xs text-red-500 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                      {{ fieldErrors.confirmPassword }}
                    </p>
                  </Transition>
                </div>

              </div>

<!-- ── PROVIDER REQUEST FORM ── -->
              <div v-else key="provider-form" class="space-y-4 sm:space-y-5">

                <!-- Info banner -->
                <div class="flex items-start gap-3 p-3 sm:p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <svg class="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-xs sm:text-sm text-indigo-700 leading-relaxed">{{ $t('auth.providerFormInfo') }}</p>
                </div>

                <!-- Provider Name -->
                <div class="space-y-1.5">
                  <label for="provider-name" class="block text-sm font-medium text-gray-700">
                    {{ $t('auth.providerNameLabel') }} <span class="text-red-400">*</span>
                  </label>
                  <div :class="['relative flex items-center rounded-xl border transition-all duration-200 bg-white',
                    providerErrors.providerName ? 'border-red-400 ring-1 ring-red-300' :
                    'border-gray-200 hover:border-indigo-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100']">
                    <div class="pl-3.5 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input id="provider-name" name="providerName" type="text" autocomplete="name"
                      v-model="registerForm.providerName" @blur="touchProviderField('providerName')"
                      class="w-full rounded-xl bg-transparent pl-2.5 pr-4 py-3 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 border-0 focus:ring-0 focus:outline-none"
                      :placeholder="$t('auth.providerNamePlaceholder')" />
                  </div>
                  <Transition name="slide-fade">
                    <p v-if="providerErrors.providerName" class="text-xs text-red-500 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                      {{ providerErrors.providerName }}
                    </p>
                  </Transition>
                </div>

                <!-- Provider Email -->
                <div class="space-y-1.5">
                  <label for="provider-email" class="block text-sm font-medium text-gray-700">
                    {{ $t('auth.emailLabel') }} <span class="text-red-400">*</span>
                  </label>
                  <div :class="['relative flex items-center rounded-xl border transition-all duration-200 bg-white',
                    providerErrors.providerEmail ? 'border-red-400 ring-1 ring-red-300' :
                    'border-gray-200 hover:border-indigo-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100']">
                    <div class="pl-3.5 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input id="provider-email" name="providerEmail" type="email" autocomplete="email"
                      v-model="registerForm.providerEmail" @blur="touchProviderField('providerEmail')"
                      class="w-full rounded-xl bg-transparent pl-2.5 pr-4 py-3 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 border-0 focus:ring-0 focus:outline-none"
                      :placeholder="$t('auth.emailPlaceholder')" />
                  </div>
                  <Transition name="slide-fade">
                    <p v-if="providerErrors.providerEmail" class="text-xs text-red-500 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                      {{ providerErrors.providerEmail }}
                    </p>
                  </Transition>
                </div>

                <!-- Subject -->
                <div class="space-y-1.5">
                  <label for="provider-subject" class="block text-sm font-medium text-gray-700">
                    {{ $t('auth.providerSubjectLabel') }} <span class="text-red-400">*</span>
                  </label>
                  <div :class="['relative flex items-center rounded-xl border transition-all duration-200 bg-white',
                    providerErrors.providerSubject ? 'border-red-400 ring-1 ring-red-300' :
                    'border-gray-200 hover:border-indigo-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100']">
                    <div class="pl-3.5 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <input id="provider-subject" name="providerSubject" type="text"
                      v-model="registerForm.providerSubject" @blur="touchProviderField('providerSubject')"
                      class="w-full rounded-xl bg-transparent pl-2.5 pr-4 py-3 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 border-0 focus:ring-0 focus:outline-none"
                      :placeholder="$t('auth.providerSubjectPlaceholder')" />
                  </div>
                  <Transition name="slide-fade">
                    <p v-if="providerErrors.providerSubject" class="text-xs text-red-500 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                      {{ providerErrors.providerSubject }}
                    </p>
                  </Transition>
                </div>

                <!-- Message -->
                <div class="space-y-1.5">
                  <label for="provider-message" class="block text-sm font-medium text-gray-700">
                    {{ $t('auth.providerMessageLabel') }} <span class="text-red-400">*</span>
                  </label>
                  <div :class="['relative rounded-xl border transition-all duration-200 bg-white',
                    providerErrors.providerMessage ? 'border-red-400 ring-1 ring-red-300' :
                    'border-gray-200 hover:border-indigo-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100']">
                    <textarea id="provider-message" name="providerMessage" rows="4"
                      v-model="registerForm.providerMessage" @blur="touchProviderField('providerMessage')"
                      class="w-full rounded-xl bg-transparent p-3 sm:p-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 border-0 focus:ring-0 focus:outline-none resize-none"
                      :placeholder="$t('auth.providerMessagePlaceholder')"></textarea>
                    <div class="px-3 pb-2 flex justify-end">
                      <span :class="['text-xs', registerForm.providerMessage.length > 480 ? 'text-amber-500' : 'text-gray-400']">
                        {{ registerForm.providerMessage.length }}/500
                      </span>
                    </div>
                  </div>
                  <Transition name="slide-fade">
                    <p v-if="providerErrors.providerMessage" class="text-xs text-red-500 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                      {{ providerErrors.providerMessage }}
                    </p>
                  </Transition>
                </div>

              </div>
            </Transition>

            <!-- Submit Button -->
            <div class="mt-5 sm:mt-6 space-y-3">
              <button type="submit" :disabled="loading"
                class="group relative w-full flex justify-center items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-md shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100">
                <svg v-if="loading" class="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <svg v-else class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                {{ loading
                  ? (showProviderForm ? $t('auth.sendingRequest') : $t('auth.creatingAccount'))
                  : showProviderForm
                    ? $t('auth.providerRequestButton')
                    : $t('auth.createAccountButton') }}
              </button>

              <!-- Divider -->
              <div class="relative flex items-center gap-3">
                <div class="flex-1 h-px bg-gray-200"></div>
                <span class="text-xs text-gray-400 font-medium">{{ $t('auth.orDivider') }}</span>
                <div class="flex-1 h-px bg-gray-200"></div>
              </div>

              <!-- Sign in link -->
              <button type="button" @click="handleLogin" :disabled="loading"
                class="w-full flex justify-center items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:py-3.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                {{ $t('auth.alreadyHaveAccount') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Footer note -->
      <p class="text-center text-xs text-gray-400 pb-2">
        {{ $t('auth.footerNote') }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
const API_URL = import.meta.env.VITE_API_URL || ''

// ── State ──────────────────────────────────────────────────────────
const loading = ref(false)
const error = ref('')
const success = ref('')
const showProviderForm = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const registerForm = ref({
  name: '', email: '', password: '', confirmPassword: '',
  isProvider: false,
  providerName: '', providerEmail: '', providerSubject: '', providerMessage: ''
})

const touchedFields = ref({ name: false, email: false, password: false, confirmPassword: false })
const touchedProviderFields = ref({ providerName: false, providerEmail: false, providerSubject: false, providerMessage: false })

// ── Validation ─────────────────────────────────────────────────────
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fieldErrors = computed(() => {
  const f = registerForm.value
  return {
    name: touchedFields.value.name && !f.name ? t('auth.fieldRequired') : '',
    email: touchedFields.value.email && !f.email
      ? t('auth.fieldRequired')
      : touchedFields.value.email && f.email && !emailRegex.test(f.email)
        ? t('auth.emailInvalid') : '',
    password: touchedFields.value.password && !f.password
      ? t('auth.fieldRequired')
      : touchedFields.value.password && f.password && f.password.length < 6
        ? t('auth.passwordTooShort') : '',
    confirmPassword: touchedFields.value.confirmPassword && !f.confirmPassword
      ? t('auth.fieldRequired')
      : touchedFields.value.confirmPassword && f.confirmPassword && f.password !== f.confirmPassword
        ? t('auth.passwordMismatch') : ''
  }
})

const providerErrors = computed(() => {
  const f = registerForm.value
  return {
    providerName: touchedProviderFields.value.providerName && !f.providerName ? t('auth.fieldRequired') : '',
    providerEmail: touchedProviderFields.value.providerEmail && !f.providerEmail
      ? t('auth.fieldRequired')
      : touchedProviderFields.value.providerEmail && f.providerEmail && !emailRegex.test(f.providerEmail)
        ? t('auth.emailInvalid') : '',
    providerSubject: touchedProviderFields.value.providerSubject && !f.providerSubject ? t('auth.fieldRequired') : '',
    providerMessage: touchedProviderFields.value.providerMessage && !f.providerMessage ? t('auth.fieldRequired') : ''
  }
})

// ── Password strength ──────────────────────────────────────────────
const passwordStrength = computed(() => {
  const p = registerForm.value.password
  if (!p) return { score: 0, label: '', color: 'bg-gray-200', textColor: 'text-gray-400' }
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  const levels = [
    { score: 1, label: t('auth.passwordWeak'),   color: 'bg-red-400',     textColor: 'text-red-500' },
    { score: 2, label: t('auth.passwordFair'),   color: 'bg-amber-400',   textColor: 'text-amber-500' },
    { score: 3, label: t('auth.passwordGood'),   color: 'bg-blue-400',    textColor: 'text-blue-500' },
    { score: 4, label: t('auth.passwordStrong'), color: 'bg-emerald-500', textColor: 'text-emerald-600' },
  ]
  return levels[Math.max(0, score - 1)] || levels[0]
})

// ── Helpers ────────────────────────────────────────────────────────
const touchField = (field) => { touchedFields.value[field] = true }
const touchProviderField = (field) => { touchedProviderFields.value[field] = true }
const touchAllFields = () => Object.keys(touchedFields.value).forEach(k => { touchedFields.value[k] = true })
const touchAllProviderFields = () => Object.keys(touchedProviderFields.value).forEach(k => { touchedProviderFields.value[k] = true })

const resetProviderFields = () => {
  Object.assign(registerForm.value, { providerName: '', providerEmail: '', providerSubject: '', providerMessage: '' })
  Object.keys(touchedProviderFields.value).forEach(k => { touchedProviderFields.value[k] = false })
}

const setUserForm = () => {
  if (showProviderForm.value) {
    showProviderForm.value = false
    registerForm.value.isProvider = false
    resetProviderFields()
  }
}

const setProviderForm = () => {
  if (!showProviderForm.value) {
    showProviderForm.value = true
    registerForm.value.isProvider = true
  }
}

watch(showProviderForm, () => { error.value = ''; success.value = '' })

// ── Submit ─────────────────────────────────────────────────────────
async function handleRegister() {
  error.value = ''
  success.value = ''

  // Provider request flow
  if (registerForm.value.isProvider) {
    touchAllProviderFields()
    if (Object.values(providerErrors.value).some(Boolean)) return

    loading.value = true
    try {
      const response = await fetch(`${API_URL}/api/provider/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: registerForm.value.providerName,
          email: registerForm.value.providerEmail,
          subject: registerForm.value.providerSubject,
          message: registerForm.value.providerMessage
        }),
      })
      const data = await response.json().catch(() => null)
      if (!data) { error.value = t('auth.invalidResponse'); return }
      if (response.ok && data.success) {
        success.value = data.message || t('auth.providerRequestSuccess')
        resetProviderFields()
        setTimeout(() => {
          router.push({ name: 'Login' })
        }, 2000)
      } else {
        error.value = data.message || t('auth.providerRequestFailed')
      }
    } catch (err) {
      error.value = err.name === 'TypeError' && err.message.includes('fetch')
        ? t('auth.serverConnectionError') : t('auth.networkError')
    } finally {
      loading.value = false
    }
    return
  }

  // Standard user registration
  touchAllFields()
  if (Object.values(fieldErrors.value).some(Boolean)) return

  loading.value = true
  try {
    const response = await fetch(`${API_URL}/api/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: registerForm.value.name,
        email: registerForm.value.email,
        password: registerForm.value.password
      }),
    })
    const data = await response.json().catch(() => null)
    if (!data) { error.value = t('auth.invalidResponse'); return }
    if (response.ok && data.success) {
      success.value = data.message || t('auth.registrationSuccess')
      setTimeout(() => router.push('/home'), 1000)
    } else {
      error.value = data.message || t('auth.registrationFailed')
    }
  } catch (err) {
    error.value = err.name === 'TypeError' && err.message.includes('fetch')
      ? t('auth.serverConnectionError') : t('auth.networkError')
  } finally {
    loading.value = false
  }
}

const handleLogin = () => router.push('/')
</script>

<style scoped>
/* Form switch transition */
.form-switch-enter-active,
.form-switch-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.form-switch-enter-from {
  opacity: 0;
  transform: translateX(12px);
}
.form-switch-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

/* Slide fade for alerts and inline errors */
.slide-fade-enter-active { transition: all 0.2s ease-out; }
.slide-fade-leave-active  { transition: all 0.15s ease-in; }
.slide-fade-enter-from    { opacity: 0; transform: translateY(-4px); }
.slide-fade-leave-to      { opacity: 0; transform: translateY(-4px); }
</style>