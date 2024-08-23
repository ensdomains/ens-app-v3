import fs from 'fs'
import path from 'path'

import { BASE_LOCALE, getLocaleData, getLocalePaths } from './locale-utils.mjs'

const baseLocale = getLocalePaths(BASE_LOCALE)

;(() => {
  const { keys, namespaces } = getLocaleData(baseLocale)

  function createRegex(text, { caseInsensitive = true } = {}) {
    const escapedPattern = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const flags = caseInsensitive ? 'gi' : 'g'
    return new RegExp(`\\b${escapedPattern}`, flags)
  }

  function filterByExt(text, exts = []) {
    const regex = new RegExp(`(${exts.join('|')})$`)
    return regex.test(text)
  }

  const dir = './src'
  const search = `t('`
  const regex = createRegex(search)

  const results = {
    results: [],
    files: [],
  }

  function extractKey(str) {
    const keyRegex = /t\(\s*['"](.+?)['"]\s*,?/
    const keyMatch = str.match(keyRegex)
    return keyMatch ? keyMatch[1] : null
  }

  function extractMatch(filePath) {
    let match = true
    const matches = []
    let content = fs.readFileSync(filePath, 'utf-8')

    while ((match = regex.exec(content))) {
      // /\b(?:t)\s*\(\s*(['\s\S']*?)\s*\)/g
      const line = /\b(?:t)\s*\(['"][^'"]+['"][^)]*\)/g.exec(content)?.at(0)
      content = content.replace(match?.[0], '').replace(line, '')
      matches.push(extractKey(line))
    }

    return matches
  }

  function handleResults(filePath) {
    const matches = extractMatch(filePath)

    if (!matches.length) return

    // console.log(`Found ${matches.length} ${search} in ${filePath}:`)
    matches.forEach((m) => console.log(m))
    // console.log('\n')
    results.results = [...results.results, ...matches]
    results.files = [...results.files, filePath]
  }

  // Function to recursively scan files in a directory
  function scanFiles({ dir, fn, ext = [] }) {
    const files = fs.readdirSync(dir)

    files.forEach((file) => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        scanFiles({ dir: filePath, fn, ext }) // Recursively scan subdirectories
      } else if (stat.isFile() && filterByExt(file, ext)) {
        fn(filePath)
      }
    })
  }

  scanFiles({
    dir,
    fn: handleResults,
    ext: ['.ts', '.tsx'],
  })

  const unusedKeys = []
  const foundKeys = [
    ...new Set(
      results.results.map((key) => key.replace(new RegExp(`^(${namespaces.join('|')}).`), '')),
    ),
  ]
  const modifiedKeys = [
    ...new Set(keys.map((key) => key.replace(new RegExp(`^(${namespaces.join('|')}).`), ''))),
  ]

  for (const key of modifiedKeys) {
    const foundKey = foundKeys.find((k) => key === k)

    if (!foundKey) {
      unusedKeys.push(key)
    }
  }

  console.log('PROBABLY UNSED KEYS\n')
  for (const key of unusedKeys) {
    console.log(key)
  }
})()
