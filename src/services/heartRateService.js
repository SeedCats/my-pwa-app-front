import { apiRequest } from './apiClient'

const hrPath = (userId, suffix = '') => userId ? `/api/admin/users/${userId}/heartrate${suffix}` : `/api/data/heartrate${suffix}`

const uploadCSV = (file, path) => {
  const form = new FormData()
  form.append('file', file)
  return apiRequest(path, { method: 'POST', isForm: true, body: form })
}

export const uploadHeartRateCSV = (file, { userId } = {}) => uploadCSV(file, hrPath(userId, '/upload'))

export const uploadAllCSV = (file, { userId } = {}) =>
  uploadCSV(file, userId ? `/api/admin/users/${userId}/uploadAll` : '/api/data/uploadAll')

export const getHeartRateRecords = ({ userId, ...rest } = {}) =>
  apiRequest(hrPath(userId), { query: userId ? rest : rest })

export const getHeartRateDates = ({ userId, ...rest } = {}) =>
  apiRequest(hrPath(userId, '/dates'), { query: userId ? rest : rest })

export const getHeartRateStats = ({ userId, ...rest } = {}) =>
  apiRequest(hrPath(userId, '/stats'), { query: userId ? rest : rest })

export const deleteAllHeartRateRecords = ({ userId } = {}) =>
  apiRequest(hrPath(userId), { method: 'DELETE' })

export const deleteHeartRateById = (id, { userId } = {}) =>
  apiRequest(hrPath(userId, `/${id}`), { method: 'DELETE' })

export const deleteHeartRateByDate = (date, { userId } = {}) =>
  apiRequest(hrPath(userId, `/date/${date}`), { method: 'DELETE' })
