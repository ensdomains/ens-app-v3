import fs from 'fs'

import glob from 'glob'

import { BASE_LOCALE, getLocaleData, getLocalePaths } from './locale-utils.mjs'

const baseLocale = getLocalePaths(BASE_LOCALE)

const { keys: translationKeys, namespaces } = getLocaleData(baseLocale)

// Path to your source code
const sourceCodePath = './src/**/*.{js,jsx,ts,tsx}' // adjust for relevant file types

// Search for translation keys in the source code
function searchForTranslationKeysInCode(pattern) {
  const regex = /t[cs]?\(['"`]([a-zA-Z0-9_.]+)['"`]\s*,?\s*{?/g
  //  = /t\(['"`]([a-zA-Z0-9_.]+)['"`]\s*,?\s*{?/g
  // /t\(['"`]([a-zA-Z0-9_.]+)['"`]\)/g // regex to match t('key')
  const files = glob.sync(pattern)
  const foundKeys = new Set()

  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8')
    let match
    while ((match = regex.exec(content)) !== null) {
      foundKeys.add(match[1]) // Add the matched key
    }
  })

  return foundKeys
}

// Find unused translation keys
function findUnusedKeys() {
  const usedKeys = searchForTranslationKeysInCode(sourceCodePath)

  const unusedKeys = []

  const regex = new RegExp(`^(${namespaces.join('|')}).`)

  for (const key of translationKeys.map((key) => key.replace(regex, ''))) {
    if (!usedKeys.has(key)) {
      unusedKeys.push(key)
    }
  }
  console.log(`PROBABLY ${unusedKeys.length} UNSED KEYS:`)
  unusedKeys.forEach((key) => {
    console.log(key)
  })
}

findUnusedKeys()
