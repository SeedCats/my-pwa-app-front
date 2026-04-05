import { createI18n } from 'vue-i18n'
import en from './locales/en.json'

const savedLanguage = localStorage.getItem('language')
const defaultLanguage = savedLanguage || 'en'

const i18n = createI18n({
  legacy: false,
  locale: defaultLanguage,
  fallbackLocale: 'en',
  messages: {
    en
  },
  globalInjection: true
})

export const loadLocaleMessages = async (locale) => {
  if (i18n.global.availableLocales.includes(locale)) return;
  
  const localesMap = {
    'zh': () => import('./locales/zh.json')
  };
  
  if (localesMap[locale]) {
    const messages = await localesMap[locale]();
    i18n.global.setLocaleMessage(locale, messages.default);
  }
}

// Load default or saved locale eagerly if not english
if (defaultLanguage !== 'en') {
  loadLocaleMessages(defaultLanguage);
}

export default i18n
