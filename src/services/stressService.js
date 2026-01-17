// Stress Service - API calls for stress data management
import { apiRequest } from './apiClient'

export const uploadStressCSV = async (file) => {
  const form = new FormData()
  form.append('file', file)
  return apiRequest('/api/data/stress/upload', { method: 'POST', isForm: true, body: form })
}

export const getStressRecords = async (params = {}) => apiRequest('/api/data/stress', { query: params })
export const getStressDates = async () => apiRequest('/api/data/stress/dates')
export const getStressStats = async (params = {}) => apiRequest('/api/data/stress/stats', { query: params })
export const deleteAllStressRecords = async () => apiRequest('/api/data/stress', { method: 'DELETE' })
export const deleteStressByDate = async (date) => apiRequest(`/api/data/stress/date/${date}`, { method: 'DELETE' })
