import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import address from '../public/locales/en/address.json'
import common from '../public/locales/en/common.json'
import names from '../public/locales/en/names.json'
import profile from '../public/locales/en/profile.json'
import settings from '../public/locales/en/settings.json'
import transactionFlow from '../public/locales/en/transactionFlow.json'

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
    ns: ['address', 'common', 'names', 'profile', 'settings', 'transactionFlow'],
    react: {
      useSuspense: false,
    },
  })

// preload english
i18n.addResourceBundle('en', 'address', address)
i18n.addResourceBundle('en', 'common', common)
i18n.addResourceBundle('en', 'names', names)
i18n.addResourceBundle('en', 'profile', profile)
i18n.addResourceBundle('en', 'settings', settings)
i18n.addResourceBundle('en', 'transactionFlow', transactionFlow)

export default i18n
