import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

import address from '../public/locales/en/address.json'
import common from '../public/locales/en/common.json'
import dnssec from '../public/locales/en/dnssec.json'
import ensv2 from '../public/locales/en/ensv2.json'
import names from '../public/locales/en/names.json'
import profile from '../public/locales/en/profile.json'
import register from '../public/locales/en/register.json'
import settings from '../public/locales/en/settings.json'
import transactionFlow from '../public/locales/en/transactionFlow.json'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh', 'de', 'nl', 'ru', 'uk', 'es', 'pt'],
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
    ns: [
      'address',
      'common',
      'dnssec',
      'names',
      'profile',
      'register',
      'settings',
      'transactionFlow',
      'ensv2',
    ],
    react: {
      useSuspense: false,
    },
  })

// preload english
i18n.addResourceBundle('en', 'address', address)
i18n.addResourceBundle('en', 'common', common)
i18n.addResourceBundle('en', 'dnssec', dnssec)
i18n.addResourceBundle('en', 'names', names)
i18n.addResourceBundle('en', 'profile', profile)
i18n.addResourceBundle('en', 'register', register)
i18n.addResourceBundle('en', 'settings', settings)
i18n.addResourceBundle('en', 'transactionFlow', transactionFlow)
i18n.addResourceBundle('en', 'ensv2', ensv2)

export default i18n
