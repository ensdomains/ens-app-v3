import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import en from '../public/locales/en/common.json'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh', 'de'],
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
    ns: ['common'],
    react: {
      useSuspense: false,
    },
  })

// preload english
i18n.addResourceBundle('en', 'common', en)

export default i18n
