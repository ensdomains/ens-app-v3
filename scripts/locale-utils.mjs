import fs from 'fs'
import path from 'path'

export const BASE_LOCALE = 'en'
export const LOCALES_DIR = 'public/locales'

function getDotNotationKeys(obj, parent = '') {
  let keys = []

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = parent ? `${parent}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys = keys.concat(getDotNotationKeys(obj[key], fullKey))
      } else {
        keys.push(fullKey)
      }
    }
  }

  return keys
}

function listLocales(dirPath, arrayOfFiles) {
  arrayOfFiles = arrayOfFiles || []

  const files = fs.readdirSync(dirPath)

  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file)

    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles.push(fullPath)
      listLocales(fullPath, arrayOfFiles) // Recursively list files in subdirectories
    } else {
      arrayOfFiles.push(fullPath)
    }
  })

  return arrayOfFiles
}

export function getLocalePaths(locale) {
  const locales = fs.readdirSync(LOCALES_DIR).reduce((result, key) => {
    result[key] = listLocales(`${LOCALES_DIR}/${key}`)
    return result
  }, {})

  if (locale) return locales[locale]

  return locales
}

export function getLocaleData(filePaths) {
  let keys = []
  const namespaces = []

  for (const filePath of filePaths) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const json = JSON.parse(content)

    const ns = filePath.split('/').at(-1).replace('.json', '')

    namespaces.push(ns)
    keys = [...keys, ...getDotNotationKeys({ [ns]: json })]
  }

  return { keys, namespaces }
}
