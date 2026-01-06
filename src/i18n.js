import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

// Get saved language from localStorage or default to browser language
const savedLanguage = localStorage.getItem('language')
const browserLanguage = navigator.language.split('-')[0] // e.g., 'en-US' -> 'en'
const defaultLanguage = savedLanguage || (browserLanguage === 'zh' ? 'zh' : 'en')

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
