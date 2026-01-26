// Heart Rate Service - API calls for heart rate data management
import { apiRequest, buildQuery } from './apiClient'

export const uploadHeartRateCSV = async (file) => {
  const form = new FormData()
  form.append('file', file)
  return apiRequest('/api/data/heartrate/upload', { method: 'POST', isForm: true, body: form })
}

export const uploadAllCSV = async (file) => {
  const form = new FormData()
  form.append('file', file)
  return apiRequest('/api/data/uploadAll', { method: 'POST', isForm: true, body: form })
}

export const getHeartRateRecords = async (params = {}) => {
  const { userId, ...rest } = params || {}
  if (userId) return apiRequest(`/api/admin/users/${userId}/heartrate`, { query: rest })
  return apiRequest('/api/data/heartrate', { query: params })
}
export const getHeartRateDates = async (params = {}) => {
  const { userId, ...rest } = params || {}
  if (userId) return apiRequest(`/api/admin/users/${userId}/heartrate/dates`, { query: rest })
  return apiRequest('/api/data/heartrate/dates', { query: params })
}
export const getHeartRateStats = async (params = {}) => {
  const { userId, ...rest } = params || {}
  if (userId) return apiRequest(`/api/admin/users/${userId}/heartrate/stats`, { query: rest })
  return apiRequest('/api/data/heartrate/stats', { query: params })
}
export const deleteAllHeartRateRecords = async () => apiRequest('/api/data/heartrate', { method: 'DELETE' })
export const deleteHeartRateByDate = async (date) => apiRequest(`/api/data/heartrate/date/${date}`, { method: 'DELETE' })
