import fs from 'fs'

import glob from 'glob'

import { BASE_LOCALE, getLocaleData, getLocalePaths } from './locale-utils.mjs'

const whitelist = [
  /(one|other)$/,
  /^steps.profile.options.groups/,
  /^transaction.itemLabel/,
  /_zero$/,
  /(transaction.dialog.sent|transaction.dialog.complete|transaction.dialog.failed)/,
]

const baseLocale = getLocalePaths(BASE_LOCALE)

const { keys: translationKeys, namespaces } = getLocaleData(baseLocale)

const translationKeysWoNs = translationKeys.map((key) =>
  key.replace(new RegExp(`^(${namespaces.join('|')}).`), ''),
)

// Search for translation keys in the source code
function searchForTranslationKeysInCode() {
  const regex = /t[cs]?\(['"`]([a-zA-Z0-9_.]+)['"`]\s*,?\s*{?/g
  //  = /t\(['"`]([a-zA-Z0-9_.]+)['"`]\s*,?\s*{?/g
  // /t\(['"`]([a-zA-Z0-9_.]+)['"`]\)/g // regex to match t('key')
  const files = [
    ...glob.sync(`./src/**/*.{js,jsx,ts,tsx}`),
    ...glob.sync(`./src/*.{js,jsx,ts,tsx}`),
  ]

  const foundKeys = new Set()

  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8')
    let match

    while ((match = regex.exec(content)) !== null) {
      foundKeys.add(match[1]) // Add the matched key
    }

    const keys = translationKeysWoNs.filter((key) => new RegExp(`['"\`]${key}['"\`]`).test(content))

    for (const key of keys) {
      foundKeys.add(key)
    }
  })

  return foundKeys
}

// Find unused translation keys
function findUnusedKeys() {
  const usedKeys = searchForTranslationKeysInCode()

  const unusedKeys = []

  for (const key of translationKeysWoNs) {
    if (!usedKeys.has(key) && !whitelist.some((regex) => regex.test(key))) {
      unusedKeys.push(key)
    }
  }

  unusedKeys.forEach((key) => {
    console.log(key)
  })
  console.log(`PROBABLY ${unusedKeys.length} UNSED KEYS:`)
}

findUnusedKeys()
