import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

const savedLanguage = localStorage.getItem('language')
const defaultLanguage = savedLanguage || 'en'

// Cache translations into local storage
localStorage.setItem('locales_en', JSON.stringify(en))
localStorage.setItem('locales_zh', JSON.stringify(zh))

const i18n = createI18n({
  legacy: false,
  locale: defaultLanguage,
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  },
  globalInjection: true
})

export default i18n
