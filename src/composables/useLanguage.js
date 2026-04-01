import { useI18n } from 'vue-i18n'

export function useLanguage() {
  const { locale, t } = useI18n()

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ]
  // Cache the languages list into local storage
  localStorage.setItem('languages_list', JSON.stringify(languages))

  const changeLanguage = (lang) => {
    locale.value = lang
    localStorage.setItem('language', lang)
  }

  return { currentLanguage: locale, languages, changeLanguage, t }
}
