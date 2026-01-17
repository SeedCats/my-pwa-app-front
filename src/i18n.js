import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

// Get saved language from localStorage, always default to English if not set
const savedLanguage = localStorage.getItem('language')
const defaultLanguage = savedLanguage || 'en'

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: defaultLanguage,
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  },
  globalInjection: true
})

export default i18n
