import fs from 'fs'
import path from 'path'

const BASE_LOCALE = 'en'
const BASE_DIR = 'public/locales'

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

const locales = fs.readdirSync(BASE_DIR).reduce((result, key) => {
  result[key] = listLocales(`${BASE_DIR}/${key}`)
  return result
}, {})

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
        console.log(key, diffPath.replace(BASE_DIR, ''))
        console.log(keys.join('\n'))
      }
    }
  }
}
