import router from '../router'
import { clearAllCaches } from '../stores/userStore'

/**
 * Wrapper around fetch that automatically handles 401 Unauthorized responses
 * by redirecting to login and clearing auth cache
 */
export const fetchWithAuth = async (url, options = {}) => {
  try {
    const response = await fetch(url, options)
    
    // Check for 401 Unauthorized
    if (response.status === 401) {
      // Clear all authentication and data caches
      clearAllCaches()
      
      // Redirect to login page
      router.push({ name: 'Login' })
      
      // Throw error to stop further processing
      throw new Error('Unauthorized - Please log in again')
    }
    
    return response
  } catch (error) {
    // Re-throw the error for the calling code to handle
    throw error
  }
}
