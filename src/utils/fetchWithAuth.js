import router from '../router'
import { clearAllCaches } from '../stores/userStore'

export const fetchWithAuth = async (url, options = {}) => {
  const response = await fetch(url, options)
  if (response.status === 401) {
    clearAllCaches()
    router.push({ name: 'Login' })
    throw new Error('Unauthorized - Please log in again')
  }
  return response
}
