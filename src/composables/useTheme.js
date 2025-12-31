import { ref, computed, watch } from 'vue'

// Global reactive state
const isDarkMode = ref(false)
const autoTheme = ref(false)
const isInitialized = ref(false)

export function useTheme() {
  const setTheme = (theme) => {
    autoTheme.value = false
    isDarkMode.value = theme === 'dark'
    localStorage.setItem('theme', theme)
    localStorage.setItem('autoTheme', 'false')
    applyTheme(theme)
  }

  const toggleAutoTheme = () => {
    autoTheme.value = !autoTheme.value
    localStorage.setItem('autoTheme', autoTheme.value.toString())
    
    if (autoTheme.value) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      isDarkMode.value = systemTheme === 'dark'
      localStorage.removeItem('theme')
      applyTheme(systemTheme)
    } else {
      const currentTheme = isDarkMode.value ? 'dark' : 'light'
      localStorage.setItem('theme', currentTheme)
    }
  }

  const applyTheme = (theme) => {
    const root = document.documentElement
    const body = document.body

    if (theme === 'dark') {
      root.classList.add('dark')
      body.classList.add('dark')
    } else {
      root.classList.remove('dark')
      body.classList.remove('dark')
    }

    // expose a CSS variable for other non-tailwind styles to react immediately
    try {
      root.style.setProperty('--app-color-scheme', theme)
    } catch (e) {
      // ignore in restricted environments
    }

    // notify other parts of the app
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { 
        theme, 
        isDarkMode: theme === 'dark',
        autoTheme: autoTheme.value
      } 
    }))
  }

  const initializeTheme = () => {
    if (isInitialized.value) return

    const savedTheme = localStorage.getItem('theme')
    const savedAutoTheme = localStorage.getItem('autoTheme') === 'true'
    
    autoTheme.value = savedAutoTheme
    
    if (savedAutoTheme) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      isDarkMode.value = systemTheme === 'dark'
      applyTheme(systemTheme)
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleSystemThemeChange = (e) => {
        if (autoTheme.value) {
          const newTheme = e.matches ? 'dark' : 'light'
          isDarkMode.value = e.matches
          applyTheme(newTheme)
        }
      }
      
      mediaQuery.addEventListener('change', handleSystemThemeChange)
    } else if (savedTheme) {
      isDarkMode.value = savedTheme === 'dark'
      applyTheme(savedTheme)
    } else {
      isDarkMode.value = false
      applyTheme('light')
    }
    
    isInitialized.value = true
  }

  const currentTheme = computed(() => isDarkMode.value ? 'dark' : 'light')
  
  const themeClasses = computed(() => ({
    background: isDarkMode.value ? 'bg-gray-900' : 'bg-gray-50',
    cardBackground: isDarkMode.value ? 'bg-gray-800' : 'bg-white',
    textPrimary: isDarkMode.value ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode.value ? 'text-gray-300' : 'text-gray-600',
    border: isDarkMode.value ? 'border-gray-700' : 'border-gray-200',
    inputBackground: isDarkMode.value ? 'bg-gray-700' : 'bg-gray-50',
    hoverBackground: isDarkMode.value ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
  }))

  return {
    isDarkMode,
    autoTheme,
    currentTheme,
    themeClasses,
    setTheme,
    toggleAutoTheme,
    initializeTheme
  }
}