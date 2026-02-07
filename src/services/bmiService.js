// BMI Service - API calls for BMI data management
import { apiRequest } from './apiClient'

const buildBMIPayload = (bmiData) => ({
  weight: bmiData.weight,
  height: bmiData.height,
  bmi: bmiData.bmi,
  category: bmiData.category,
  age: bmiData.age !== undefined && bmiData.age !== null && bmiData.age !== '' ? parseInt(bmiData.age, 10) : null
})

export const saveBMIData = async (bmiData, params = {}) => {
  const { userId } = params || {}
  if (userId) return apiRequest(`/api/admin/users/${userId}/bmi`, { method: 'POST', body: buildBMIPayload(bmiData) })
  return apiRequest('/api/data/bmi', { method: 'POST', body: buildBMIPayload(bmiData) })
}
export const getBMIRecords = async (params = {}) => {
  const { userId, ...rest } = params || {}
  if (userId) return apiRequest(`/api/admin/users/${userId}/bmi`, { query: rest })
  return apiRequest('/api/data/bmi', { query: params })
}
export const getLatestBMIRecord = async (params = {}) => {
  const res = await getBMIRecords(params)
  return res.success && res.data?.records?.length ? { success: true, data: res.data.records[0] } : { success: true, data: null }
}
export const getBMIRecordById = async (id, params = {}) => {
  const { userId } = params || {}
  if (userId) return apiRequest(`/api/admin/users/${userId}/bmi/${id}`)
  return apiRequest(`/api/data/bmi/${id}`)
}
export const updateBMIRecord = async (id, bmiData, params = {}) => {
  const { userId } = params || {}
  if (userId) return apiRequest(`/api/admin/users/${userId}/bmi/${id}`, { method: 'PUT', body: buildBMIPayload(bmiData) })
  return apiRequest(`/api/data/bmi/${id}`, { method: 'PUT', body: buildBMIPayload(bmiData) })
}
export const deleteBMIRecord = async (id, params = {}) => {
  const { userId } = params || {}
  if (userId) return apiRequest(`/api/admin/users/${userId}/bmi/${id}`, { method: 'DELETE' })
  return apiRequest(`/api/data/bmi/${id}`, { method: 'DELETE' })
}
export const deleteAllBMIRecords = async (params = {}) => {
  const { userId } = params || {}
  if (userId) return apiRequest(`/api/admin/users/${userId}/bmi`, { method: 'DELETE' })
  return apiRequest('/api/data/bmi', { method: 'DELETE' })
}
export const getBMIStats = async () => apiRequest('/api/data/bmi/stats')
