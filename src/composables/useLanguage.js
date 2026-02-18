import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useLanguage() {
  const { locale, t } = useI18n()
  const currentLanguage = ref(locale.value)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ]

  const changeLanguage = (lang) => {
    currentLanguage.value = lang
    locale.value = lang
    localStorage.setItem('language', lang)
  }

  return { currentLanguage, languages, changeLanguage, t }
}
