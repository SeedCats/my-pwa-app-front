import { reactive, readonly } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || ''

// LocalStorage helpers with namespace prefix
const LS_PREFIX = 'my_pwa:'
const setLS = (key, value) => { try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(value)) } catch (e) { console.warn('Failed to write to localStorage:', e) } }
const getLS = (key) => { try { return JSON.parse(localStorage.getItem(LS_PREFIX + key) || 'null') } catch { return null } }
const removeLS = (key) => { try { localStorage.removeItem(LS_PREFIX + key) } catch (e) { console.warn('Failed to remove from localStorage:', e) } }

const state = reactive({
  isAuthenticated: null,
  user: null,
  bmiData: null,
  heartRateDates: null,
  stressDates: null,
  lastAuthCheck: 0,
  lastBmiLoad: 0,
  lastHeartRateDatesLoad: 0,
  lastStressDatesLoad: 0
})

const AUTH_CACHE_DURATION = 5 * 60 * 1000
const DATA_CACHE_DURATION = 2 * 60 * 1000
const OFFLINE_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000

const isCacheValid = (lastLoad, duration) => Date.now() - lastLoad < duration

export const checkAuth = async (forceRefresh = false) => {
  if (!forceRefresh && state.isAuthenticated !== null && isCacheValid(state.lastAuthCheck, AUTH_CACHE_DURATION))
    return state.isAuthenticated
  try {
    const response = await fetch('http://localhost:5000/api/user/me', { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } })
    if (!response.ok) { state.isAuthenticated = false; state.user = null; return false }
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

// Generic cached getter that checks memory then localStorage
const getCached = (stateKey, lastLoadKey, lsKey, dataField = 'data') => {
  if (state[stateKey] && isCacheValid(state[lastLoadKey], DATA_CACHE_DURATION)) return state[stateKey]
  const entry = getLS(lsKey)
  if (entry && Date.now() - entry.ts < OFFLINE_CACHE_DURATION) {
    state[stateKey] = entry[dataField]
    state[lastLoadKey] = entry.ts
    return entry[dataField]
  }
  return null
}

const setCached = (stateKey, lastLoadKey, lsKey, value, dataField = 'data') => {
  state[stateKey] = value
  state[lastLoadKey] = Date.now()
  setLS(lsKey, { ts: state[lastLoadKey], [dataField]: value })
}

export const getCachedBmiData = () => getCached('bmiData', 'lastBmiLoad', 'bmiData')
export const setCachedBmiData = (data) => setCached('bmiData', 'lastBmiLoad', 'bmiData', data)

export const getCachedHeartRateDates = () => getCached('heartRateDates', 'lastHeartRateDatesLoad', 'heartRateDates', 'dates')
export const setCachedHeartRateDates = (dates) => setCached('heartRateDates', 'lastHeartRateDatesLoad', 'heartRateDates', dates, 'dates')

export const getCachedStressDates = () => getCached('stressDates', 'lastStressDatesLoad', 'stressDates', 'dates')
export const setCachedStressDates = (dates) => setCached('stressDates', 'lastStressDatesLoad', 'stressDates', dates, 'dates')

export const getCachedHeartRateRecord = (date) => {
  const entry = getLS(`hr:${date}`)
  return entry && Date.now() - entry.ts < OFFLINE_CACHE_DURATION ? entry.record : null
}
export const setCachedHeartRateRecord = (date, record) => setLS(`hr:${date}`, { ts: Date.now(), record })

export const getCachedStressRecord = (date) => {
  const entry = getLS(`stress:${date}`)
  return entry && Date.now() - entry.ts < OFFLINE_CACHE_DURATION ? entry.record : null
}
export const setCachedStressRecord = (date, record) => setLS(`stress:${date}`, { ts: Date.now(), record })

export const invalidateBmiCache = () => { state.bmiData = null; state.lastBmiLoad = 0 }
export const invalidateHeartRateCache = () => { state.heartRateDates = null; state.lastHeartRateDatesLoad = 0 }
export const invalidateStressCache = () => { state.stressDates = null; state.lastStressDatesLoad = 0 }

export const clearAllCaches = () => {
  Object.assign(state, { isAuthenticated: null, user: null, bmiData: null, heartRateDates: null, stressDates: null, lastAuthCheck: 0, lastBmiLoad: 0, lastHeartRateDatesLoad: 0, lastStressDatesLoad: 0 })
  removeLS('bmiData'); removeLS('heartRateDates'); removeLS('stressDates')
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(LS_PREFIX + 'hr:') || k.startsWith(LS_PREFIX + 'stress:'))
      .forEach(k => localStorage.removeItem(k))
  } catch (e) { console.warn('Failed to clear localStorage records:', e) }
}

export const hasRole = (role) => !!(state.user?.role === role)
export const isAdmin = () => hasRole('admin')
export const useUserStore = () => readonly(state)
