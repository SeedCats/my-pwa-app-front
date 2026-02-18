import { apiRequest } from './apiClient'

const bmiPath = (userId, suffix = '') => userId ? `/api/admin/users/${userId}/bmi${suffix}` : `/api/data/bmi${suffix}`

const buildBMIPayload = ({ weight, height, bmi, category, age }) => ({
  weight, height, bmi, category,
  age: age !== undefined && age !== null && age !== '' ? parseInt(age, 10) : null
})

export const saveBMIData = (data, { userId } = {}) =>
  apiRequest(bmiPath(userId), { method: 'POST', body: buildBMIPayload(data) })

export const getBMIRecords = ({ userId, ...rest } = {}) =>
  apiRequest(bmiPath(userId), { query: userId ? rest : { userId, ...rest } })

export const getLatestBMIRecord = async (params = {}) => {
  const res = await getBMIRecords(params)
  return { success: true, data: res.success && res.data?.records?.length ? res.data.records[0] : null }
}

export const getBMIRecordById = (id, { userId } = {}) => apiRequest(bmiPath(userId, `/${id}`))

export const updateBMIRecord = (id, data, { userId } = {}) =>
  apiRequest(bmiPath(userId, `/${id}`), { method: 'PUT', body: buildBMIPayload(data) })

export const deleteBMIRecord = (id, { userId } = {}) =>
  apiRequest(bmiPath(userId, `/${id}`), { method: 'DELETE' })

export const deleteAllBMIRecords = ({ userId } = {}) =>
  apiRequest(bmiPath(userId), { method: 'DELETE' })

export const getBMIStats = () => apiRequest('/api/data/bmi/stats')
