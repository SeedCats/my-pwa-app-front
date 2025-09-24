<template>
  <div class="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div class="w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-6 sm:space-y-8">
      <!-- Header Section -->
      <div class="text-center">
        <!-- Logo -->
        <div class="mx-auto w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg mb-6 sm:mb-8">
          <svg class="w-4 h-4 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p class="text-sm sm:text-base lg:text-lg text-gray-600">
          Sign in to your account
        </p>
      </div>

      <!-- Login Card -->
      <div class="bg-white/70 backdrop-blur-lg rounded-xl sm:rounded-3xl shadow-xl border border-white/50 p-6 sm:p-8 lg:p-10">
        <form class="space-y-6" action="#" method="POST">
          <!-- Input Group -->
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur-sm"></div>
            <div class="relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
              <div class="col-span-2">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input 
                    id="email-address" 
                    name="email" 
                    type="email" 
                    autocomplete="email" 
                    required 
                    aria-label="Email address" 
                    class="block w-full rounded-t-xl bg-white pl-10 sm:pl-12 pr-4 py-3 sm:py-4 lg:py-5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-500 transition-colors duration-200" 
                    placeholder="Email address" 
                  />
                </div>
              </div>
              <div class="-mt-px pt-2">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    autocomplete="current-password" 
                    required 
                    aria-label="Password" 
                    class="block w-full rounded-b-xl bg-white pl-10 sm:pl-12 pr-4 py-3 sm:py-4 lg:py-5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 border-0 focus:ring-0 transition-colors duration-200" 
                    placeholder="Password" 
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between">
            <div class="flex gap-3 items-center">
              <div class="flex h-6 shrink-0 items-center">
                <div class="group grid size-4 sm:size-5 grid-cols-1">
                  <input 
                    id="remember-me" 
                    name="remember-me" 
                    type="checkbox" 
                    class="col-start-1 row-start-1 appearance-none rounded-md border-2 border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto transition-colors duration-200" 
                  />
                  <svg class="pointer-events-none col-start-1 row-start-1 size-3 sm:size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25" viewBox="0 0 14 14" fill="none">
                    <path class="opacity-0 group-has-checked:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path class="opacity-0 group-has-indeterminate:opacity-100" d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              </div>
              <label for="remember-me" class="block text-sm sm:text-base text-gray-700 font-medium">Remember me</label>
            </div>
            
            <div class="text-sm sm:text-base">
              <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 hover:underline underline-offset-4">
                Forgot password?
              </a>
            </div>
          </div>

          <!-- Buttons -->
          <div class="space-y-3 sm:space-y-4">
            <button 
              type="submit" 
              @click="handleLoginIn" 
              class="group flex w-full justify-center items-center rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg font-semibold text-white hover:from-indigo-700 hover:to-purple-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign in
            </button>
            
            <button 
              type="button" 
              @click="handleRegister" 
              class="group flex w-full justify-center items-center rounded-xl sm:rounded-2xl bg-white border-2 border-gray-300 px-4 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg font-semibold text-gray-700 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()  

function handleLoginIn() {
    // Simulate a login by setting a token in localStorage
    // localStorage.setItem('token', 'your-authentication-token')
    router.push('/home')  // Redirect to home page after login
}

function handleRegister() {
    // Navigate to register page
    router.push('/register')  // You'll need to create this route
}
</script>
