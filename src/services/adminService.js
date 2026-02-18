import { fetchWithAuth } from '../utils/fetchWithAuth'

const API_URL = import.meta.env.VITE_API_URL || ''

const parseResponse = async (res) => {
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json().catch(() => null)
  return { data: await res.text().catch(() => null) }
}

// Try several endpoints in order, returning the first non-404 response
const tryEndpoints = async (id, paths, fetchOpts) => {
  for (const path of paths) {
    const res = await fetchWithAuth(`${API_URL}${path(id)}`, { credentials: 'include', ...fetchOpts })
    if (res.status === 404) continue
    return parseResponse(res)
  }
  return { success: false, status: 404, message: 'Not found' }
}

const USER_PATHS = [
  (id) => `/api/admin/users/${id}`,
  (id) => `/api/admin/user/${id}`,
  (id) => `/api/users/${id}`,
  (id) => `/api/user/${id}`
]

export const getUserById = (id) => {
  if (!id) return null
  return tryEndpoints(id, USER_PATHS, {})
}

export const updateUserById = (id, body) => {
  if (!id) throw new Error('Missing user id')
  return tryEndpoints(id, USER_PATHS, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
}

export const deleteUserById = (id) => {
  if (!id) throw new Error('Missing user id')
  return tryEndpoints(id, USER_PATHS, { method: 'DELETE' })
}

export const updateUserPasswordById = (id, newPassword) => {
  if (!id) throw new Error('Missing user id')
  if (!newPassword) throw new Error('Missing new password')
  return tryEndpoints(id, [
    (id) => `/api/admin/user/${id}/password`,
    (id) => `/api/admin/users/${id}/password`
  ], {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newPassword })
  })
}
