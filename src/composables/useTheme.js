import { ref, computed } from 'vue'

const isDarkMode = ref(false)
const autoTheme = ref(false)
const isInitialized = ref(false)

export function useTheme() {
  const applyTheme = (theme) => {
    const isDark = theme === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
    document.body.classList.toggle('dark', isDark)
    try { document.documentElement.style.setProperty('--app-color-scheme', theme) } catch {}
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme, isDarkMode: isDark, autoTheme: autoTheme.value } }))
  }

  const setTheme = (theme) => {
    autoTheme.value = false
    isDarkMode.value = theme === 'dark'
    localStorage.setItem('theme', theme)
    localStorage.setItem('autoTheme', 'false')
    applyTheme(theme)
  }

  const toggleAutoTheme = () => {
    autoTheme.value = !autoTheme.value
    localStorage.setItem('autoTheme', String(autoTheme.value))
    if (autoTheme.value) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      isDarkMode.value = systemTheme === 'dark'
      localStorage.removeItem('theme')
      applyTheme(systemTheme)
    } else {
      localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
    }
  }

  const initializeTheme = () => {
    if (isInitialized.value) return
    const savedAutoTheme = localStorage.getItem('autoTheme') === 'true'
    const savedTheme = localStorage.getItem('theme')
    autoTheme.value = savedAutoTheme
    if (savedAutoTheme) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      isDarkMode.value = systemTheme === 'dark'
      applyTheme(systemTheme)
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (autoTheme.value) { isDarkMode.value = e.matches; applyTheme(e.matches ? 'dark' : 'light') }
      })
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

  return { isDarkMode, autoTheme, currentTheme, themeClasses, setTheme, toggleAutoTheme, initializeTheme }
}