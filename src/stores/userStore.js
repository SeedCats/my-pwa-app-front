import { reactive, readonly } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || ''

// LocalStorage helpers with prefix
const LS_PREFIX = 'my_pwa:'
const setLS = (key, value) => {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(value))
  } catch (e) {
    console.warn('Failed to write to localStorage:', e)
  }
}
const getLS = (key) => {
  try {
    return JSON.parse(localStorage.getItem(LS_PREFIX + key) || 'null')
  } catch (e) {
    return null
  }
}
const removeLS = (key) => {
  try {
    localStorage.removeItem(LS_PREFIX + key)
  } catch (e) {
    console.warn('Failed to remove from localStorage:', e)
  }
}

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

// Cache duration in milliseconds (5 minutes for auth, 2 minutes for data in memory, 7 days for offline localStorage)
const AUTH_CACHE_DURATION = 5 * 60 * 1000
const DATA_CACHE_DURATION = 2 * 60 * 1000
const OFFLINE_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

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
  // Check in-memory cache first
  if (state.bmiData && isCacheValid(state.lastBmiLoad, DATA_CACHE_DURATION)) {
    return state.bmiData
  }
  // Fallback to localStorage for offline support
  const entry = getLS('bmiData')
  if (entry && Date.now() - entry.ts < OFFLINE_CACHE_DURATION) {
    state.bmiData = entry.data
    state.lastBmiLoad = entry.ts
    return entry.data
  }
  return null
}

// Set BMI data in cache
export const setCachedBmiData = (data) => {
  state.bmiData = data
  state.lastBmiLoad = Date.now()
  setLS('bmiData', { ts: state.lastBmiLoad, data })
}

// Get cached heart rate dates
export const getCachedHeartRateDates = () => {
  // Check in-memory cache first
  if (state.heartRateDates && isCacheValid(state.lastHeartRateDatesLoad, DATA_CACHE_DURATION)) {
    return state.heartRateDates
  }
  // Fallback to localStorage for offline support
  const entry = getLS('heartRateDates')
  if (entry && Date.now() - entry.ts < OFFLINE_CACHE_DURATION) {
    state.heartRateDates = entry.dates
    state.lastHeartRateDatesLoad = entry.ts
    return entry.dates
  }
  return null
}

// Set heart rate dates in cache
export const setCachedHeartRateDates = (dates) => {
  state.heartRateDates = dates
  state.lastHeartRateDatesLoad = Date.now()
  setLS('heartRateDates', { ts: state.lastHeartRateDatesLoad, dates })
}

// Get cached stress dates
export const getCachedStressDates = () => {
  // Check in-memory cache first
  if (state.stressDates && isCacheValid(state.lastStressDatesLoad, DATA_CACHE_DURATION)) {
    return state.stressDates
  }
  // Fallback to localStorage for offline support
  const entry = getLS('stressDates')
  if (entry && Date.now() - entry.ts < OFFLINE_CACHE_DURATION) {
    state.stressDates = entry.dates
    state.lastStressDatesLoad = entry.ts
    return entry.dates
  }
  return null
}

// Set stress dates in cache
export const setCachedStressDates = (dates) => {
  state.stressDates = dates
  state.lastStressDatesLoad = Date.now()
  setLS('stressDates', { ts: state.lastStressDatesLoad, dates })
}

// Per-date heart rate record caching (for offline viewing)
export const getCachedHeartRateRecord = (date) => {
  const entry = getLS(`hr:${date}`)
  if (entry && Date.now() - entry.ts < OFFLINE_CACHE_DURATION) {
    return entry.record
  }
  return null
}

export const setCachedHeartRateRecord = (date, record) => {
  setLS(`hr:${date}`, { ts: Date.now(), record })
}

// Per-date stress record caching (for offline viewing)
export const getCachedStressRecord = (date) => {
  const entry = getLS(`stress:${date}`)
  if (entry && Date.now() - entry.ts < OFFLINE_CACHE_DURATION) {
    return entry.record
  }
  return null
}

export const setCachedStressRecord = (date, record) => {
  setLS(`stress:${date}`, { ts: Date.now(), record })
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
  
  // Clear localStorage caches
  removeLS('bmiData')
  removeLS('heartRateDates')
  removeLS('stressDates')
  
  // Clear per-date records (pattern: hr:*, stress:*)
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(LS_PREFIX + 'hr:') || key.startsWith(LS_PREFIX + 'stress:')) {
        localStorage.removeItem(key)
      }
    })
  } catch (e) {
    console.warn('Failed to clear localStorage records:', e)
  }
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
