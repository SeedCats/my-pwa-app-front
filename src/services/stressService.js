// Stress Service - API calls for stress data management
import { apiRequest } from './apiClient'

export const uploadStressCSV = async (file) => {
  const form = new FormData()
  form.append('file', file)
  return apiRequest('/api/data/stress/upload', { method: 'POST', isForm: true, body: form })
}

export const getStressRecords = async (params = {}) => {
  const { userId, ...rest } = params || {}
  if (userId) return apiRequest(`/api/admin/users/${userId}/stress`, { query: rest })
  return apiRequest('/api/data/stress', { query: params })
}
export const getStressDates = async (params = {}) => {
  const { userId, ...rest } = params || {}
  if (userId) return apiRequest(`/api/admin/users/${userId}/stress/dates`, { query: rest })
  return apiRequest('/api/data/stress/dates', { query: params })
}
export const getStressStats = async (params = {}) => {
  const { userId, ...rest } = params || {}
  if (userId) return apiRequest(`/api/admin/users/${userId}/stress/stats`, { query: rest })
  return apiRequest('/api/data/stress/stats', { query: params })
}
export const deleteAllStressRecords = async () => apiRequest('/api/data/stress', { method: 'DELETE' })
export const deleteStressByDate = async (date) => apiRequest(`/api/data/stress/date/${date}`, { method: 'DELETE' })
