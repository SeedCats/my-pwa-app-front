import { reactive, readonly } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || ''

// Centralized store for user data with caching
const state = reactive({
  isAuthenticated: null, // null = not checked yet, true/false = checked
  user: null,
  bmiData: null,
  heartRateDates: null,
  stressDates: null,
  lastAuthCheck: 0,
  lastBmiLoad: 0,
  lastHeartRateDatesLoad: 0,
  lastStressDatesLoad: 0
})

// Cache duration in milliseconds (5 minutes for auth, 2 minutes for data)
const AUTH_CACHE_DURATION = 5 * 60 * 1000
const DATA_CACHE_DURATION = 2 * 60 * 1000

// Check if cache is still valid
const isCacheValid = (lastLoad, duration) => {
  return Date.now() - lastLoad < duration
}

// Check authentication (with caching)
export const checkAuth = async (forceRefresh = false) => {
  // Return cached result if still valid
  if (!forceRefresh && state.isAuthenticated !== null && isCacheValid(state.lastAuthCheck, AUTH_CACHE_DURATION)) {
    return state.isAuthenticated
  }

  try {
    const response = await fetch(`${API_URL}/api/user/me`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
      state.isAuthenticated = false
      state.user = null
      return false
    }

    const data = await response.json()
    state.isAuthenticated = !!(data.success === true && data.data?.user)
    state.user = data.data?.user || null
    state.lastAuthCheck = Date.now()

    return state.isAuthenticated
  } catch {
    state.isAuthenticated = false
    state.user = null
    return false
  }
}

// Get cached BMI data
export const getCachedBmiData = () => {
  if (state.bmiData && isCacheValid(state.lastBmiLoad, DATA_CACHE_DURATION)) {
    return state.bmiData
  }
  return null
}

// Set BMI data in cache
export const setCachedBmiData = (data) => {
  state.bmiData = data
  state.lastBmiLoad = Date.now()
}

// Get cached heart rate dates
export const getCachedHeartRateDates = () => {
  if (state.heartRateDates && isCacheValid(state.lastHeartRateDatesLoad, DATA_CACHE_DURATION)) {
    return state.heartRateDates
  }
  return null
}

// Set heart rate dates in cache
export const setCachedHeartRateDates = (dates) => {
  state.heartRateDates = dates
  state.lastHeartRateDatesLoad = Date.now()
}

// Get cached stress dates
export const getCachedStressDates = () => {
  if (state.stressDates && isCacheValid(state.lastStressDatesLoad, DATA_CACHE_DURATION)) {
    return state.stressDates
  }
  return null
}

// Set stress dates in cache
export const setCachedStressDates = (dates) => {
  state.stressDates = dates
  state.lastStressDatesLoad = Date.now()
}

// Invalidate caches (call when data is updated)
export const invalidateBmiCache = () => {
  state.bmiData = null
  state.lastBmiLoad = 0
}

export const invalidateHeartRateCache = () => {
  state.heartRateDates = null
  state.lastHeartRateDatesLoad = 0
}

export const invalidateStressCache = () => {
  state.stressDates = null
  state.lastStressDatesLoad = 0
}

// Clear all caches (call on logout)
export const clearAllCaches = () => {
  state.isAuthenticated = null
  state.user = null
  state.bmiData = null
  state.heartRateDates = null
  state.stressDates = null
  state.lastAuthCheck = 0
  state.lastBmiLoad = 0
  state.lastHeartRateDatesLoad = 0
  state.lastStressDatesLoad = 0
}

// Helper to check if current user has a role
export const hasRole = (role) => {
  try {
    return !!(state.user && state.user.role === role)
  } catch {
    return false
  }
}

// Convenience check for admin role
export const isAdmin = () => hasRole('admin')

// Export readonly state for components
export const useUserStore = () => readonly(state)
