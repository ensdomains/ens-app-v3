import fs from 'fs'

import { BASE_LOCALE, getLocalePaths, LOCALES_DIR } from './locale-utils.mjs'

;(() => {
  function detectMissingKeys(jsonObject, template) {
    let missingKeys = []

    for (const key in template) {
      if (!jsonObject.hasOwnProperty(key)) {
        missingKeys.push(key)
      } else if (typeof template[key] === 'object' && !Array.isArray(template[key])) {
        const nestedMissingKeys = detectMissingKeys(jsonObject[key], template[key])
        if (nestedMissingKeys.length > 0) {
          missingKeys = [
            ...missingKeys,
            ...nestedMissingKeys.map((nestedKey) => `${key}.${nestedKey}`),
          ]
        }
      }
    }

    return missingKeys
  }

  const locales = getLocalePaths()

  console.log('locales', locales)

  const baseLocale = locales[BASE_LOCALE]

  for (const key in locales) {
    if (key !== BASE_LOCALE) {
      for (const filePath of baseLocale) {
        const diffPath = filePath.replace(`/${BASE_LOCALE}/`, `/${key}/`)
        const source = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        const template = JSON.parse(
          fs.existsSync(diffPath) ? fs.readFileSync(diffPath, 'utf-8') : '{}',
        )

        const keys = detectMissingKeys(template, source)

        if (keys.length) {
          console.log('\n')
          console.log(key, diffPath.replace(LOCALES_DIR, ''))
          console.log(keys.join('\n'))
        }
      }
    }
  }
})()
