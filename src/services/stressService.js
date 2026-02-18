import { apiRequest } from './apiClient'

const stressPath = (userId, suffix = '') => userId ? `/api/admin/users/${userId}/stress${suffix}` : `/api/data/stress${suffix}`

export const uploadStressCSV = (file, { userId } = {}) => {
  const form = new FormData()
  form.append('file', file)
  return apiRequest(stressPath(userId, '/upload'), { method: 'POST', isForm: true, body: form })
}

export const getStressRecords = ({ userId, ...rest } = {}) =>
  apiRequest(stressPath(userId), { query: userId ? rest : rest })

export const getStressDates = ({ userId, ...rest } = {}) =>
  apiRequest(stressPath(userId, '/dates'), { query: userId ? rest : rest })

export const getStressStats = ({ userId, ...rest } = {}) =>
  apiRequest(stressPath(userId, '/stats'), { query: userId ? rest : rest })

export const deleteAllStressRecords = ({ userId } = {}) =>
  apiRequest(stressPath(userId), { method: 'DELETE' })

export const deleteStressById = (id, { userId } = {}) =>
  apiRequest(stressPath(userId, `/${id}`), { method: 'DELETE' })

export const deleteStressByDate = (date, { userId } = {}) =>
  apiRequest(stressPath(userId, `/date/${date}`), { method: 'DELETE' })
