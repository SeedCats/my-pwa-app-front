import router from '../router'
import { clearAllCaches } from '../stores/userStore'

export const fetchWithAuth = async (url, options = {}) => {
  // Add authentication token
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const finalOptions = {
    cache: 'no-store', // explicitly bust Safari aggressive caching
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, finalOptions)

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
  } catch (error) {
    // If fetch throws, we're likely offline or the request is entirely blocked
    console.warn('Network request failed:', url);
    throw error;
  }
}
