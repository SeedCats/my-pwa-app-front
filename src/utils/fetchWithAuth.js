import router from '../router'
import { clearAllCaches } from '../stores/userStore'

export const fetchWithAuth = async (url, options = {}) => {
  const response = await fetch(url, options)
  
  // Ignore 401s if the URL is for checking auth or login, 
  // as the caller (userStore/checkAuth, Login component) should handle it
  if (response.status === 401 && !url.includes('/api/user/me') && !url.includes('/api/login')) {
    // Check if we are already on Login to avoid redundant pushes
    if (router.currentRoute.value.name !== 'Login') {
      clearAllCaches()
      router.push({ name: 'Login' })
    }
  }
  
  return response
}
