// Stress Service - API calls for stress data management
import { apiRequest } from './apiClient'

export const uploadStressCSV = async (file, params = {}) => {
  const form = new FormData()
  form.append('file', file)
  const { userId } = params || {}
  if (userId) return apiRequest(`/api/admin/users/${userId}/stress/upload`, { method: 'POST', isForm: true, body: form })
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
export const deleteAllStressRecords = async (params = {}) => {
  const { userId } = params || {}
  if (userId) return apiRequest(`/api/admin/users/${userId}/stress`, { method: 'DELETE' })
  return apiRequest('/api/data/stress', { method: 'DELETE' })
}
export const deleteStressById = async (id, params = {}) => {
  const { userId } = params || {}
  if (userId) return apiRequest(`/api/admin/users/${userId}/stress/${id}`, { method: 'DELETE' })
  return apiRequest(`/api/data/stress/${id}`, { method: 'DELETE' })
}
export const deleteStressByDate = async (date, params = {}) => {
  const { userId } = params || {}
  if (userId) return apiRequest(`/api/admin/users/${userId}/stress/date/${date}`, { method: 'DELETE' })
  return apiRequest(`/api/data/stress/date/${date}`, { method: 'DELETE' })
}
