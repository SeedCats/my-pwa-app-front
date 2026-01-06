import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export function useLanguage() {
  const { locale, t } = useI18n()
  
  // Initialize from localStorage or default
  const currentLanguage = ref(locale.value)
  
  // Available languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ]
  
  // Change language function
  const changeLanguage = (lang) => {
    currentLanguage.value = lang
    locale.value = lang
    localStorage.setItem('language', lang)
  }
  
  // Watch for changes
  watch(currentLanguage, (newLang) => {
    locale.value = newLang
  })
  
  return {
    currentLanguage,
    languages,
    changeLanguage,
    t
  }
}
