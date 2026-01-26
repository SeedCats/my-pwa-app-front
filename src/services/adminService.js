import { fetchWithAuth } from '../utils/fetchWithAuth'

const API_URL = import.meta.env.VITE_API_URL || ''

// Try several possible endpoints and return parsed JSON if found
export const getUserById = async (id) => {
  if (!id) return null

  const endpoints = [
    (id) => `/api/admin/users/${id}`,
    (id) => `/api/admin/user/${id}`,
    (id) => `/api/users/${id}`,
    (id) => `/api/user/${id}`
  ]

  for (const ep of endpoints) {
    const url = `${API_URL}${ep(id)}`
    try {
      const res = await fetchWithAuth(url, { credentials: 'include' })

      // If not found, try next endpoint
      if (res.status === 404) continue

      const ct = res.headers.get('content-type') || ''
      if (ct.includes('application/json')) {
        // Return parsed JSON (may include different shapes)
        const json = await res.json().catch(() => null)
        return json
      }

      // Non-JSON but successful response - return as text
      const text = await res.text().catch(() => null)
      return { data: text }
    } catch (err) {
      // Pass through 401 handling (fetchWithAuth will redirect). For other errors, rethrow
      throw err
    }
  }

  return { success: false, status: 404, message: 'User not found' }
}
