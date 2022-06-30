import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import * as en from '../public/locales/en'

const namespaces = Object.keys(en) as Array<keyof typeof en>

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
    debug: true,
    defaultNS: 'common',
    ns: namespaces,
    react: {
      useSuspense: false,
    },
  })

// preload english
for (const namespace of namespaces) {
  const resource = en[namespace]
  i18n.addResourceBundle('en', namespace, resource)
}

export default i18n
