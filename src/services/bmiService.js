// BMI Service - API calls for BMI data management
import { apiRequest } from './apiClient'

const buildBMIPayload = (bmiData) => ({
  weight: bmiData.weight,
  height: bmiData.height,
  bmi: bmiData.bmi,
  category: bmiData.category,
  age: bmiData.age !== undefined && bmiData.age !== null && bmiData.age !== '' ? parseInt(bmiData.age, 10) : null
})

export const saveBMIData = async (bmiData) => apiRequest('/api/data/bmi', { method: 'POST', body: buildBMIPayload(bmiData) })
export const getBMIRecords = async () => apiRequest('/api/data/bmi')
export const getLatestBMIRecord = async () => {
  const res = await getBMIRecords()
  return res.success && res.data?.records?.length ? { success: true, data: res.data.records[0] } : { success: true, data: null }
}
export const getBMIRecordById = async (id) => apiRequest(`/api/data/bmi/${id}`)
export const updateBMIRecord = async (id, bmiData) => apiRequest(`/api/data/bmi/${id}`, { method: 'PUT', body: buildBMIPayload(bmiData) })
export const deleteBMIRecord = async (id) => apiRequest(`/api/data/bmi/${id}`, { method: 'DELETE' })
export const deleteAllBMIRecords = async () => apiRequest('/api/data/bmi', { method: 'DELETE' })
export const getBMIStats = async () => apiRequest('/api/data/bmi/stats')
