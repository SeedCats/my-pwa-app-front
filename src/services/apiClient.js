import { fetchWithAuth } from '../utils/fetchWithAuth'

const API_URL = import.meta.env.VITE_API_URL || ''

const handleResponse = async (res, expectStream = false) => {
  if (res.headers.get('content-type')?.includes('text/html'))
    throw new Error(`Server error: ${res.status}. Please check if the backend server is running.`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(body.message || `HTTP error! status: ${res.status}`)
  }
  return expectStream ? res : res.json()
}

export const buildQuery = (params = {}) => {
  const qp = new URLSearchParams()
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qp.append(k, v)
  })
  return qp.toString()
}

export const apiRequest = async (path, opts = {}) => {
  const { method = 'GET', headers = {}, body = null, isForm = false, credentials = 'include', query = null, expectStream = false } = opts
  const url = `${API_URL}${path}${query ? (path.includes('?') ? '&' : '?') + buildQuery(query) : ''}`
  const mergedHeaders = isForm ? headers : { 'Content-Type': 'application/json', ...headers }
  const payload = isForm || body instanceof FormData || typeof body === 'string' ? body : (body ? JSON.stringify(body) : null)
  const res = await fetchWithAuth(url, { method, headers: mergedHeaders, body: payload, credentials })
  return handleResponse(res, expectStream)
}
