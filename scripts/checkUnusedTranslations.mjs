import fs from 'fs'
import path from 'path'
import glob from 'glob'

const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales', 'en')
const SRC_DIR = path.join(process.cwd(), 'src')

function collectTranslationKeys(filePath, allKeys = new Set()) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  function recurse(obj, prefix = '') {
    for (const key of Object.keys(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (typeof obj[key] === 'string') {
        allKeys.add(fullKey)
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        recurse(obj[key], fullKey)
      }
    }
  }
  recurse(data)
  return allKeys
}

function findTranslationUsage(filePath, usedKeys = new Set()) {
  const content = fs.readFileSync(filePath, 'utf-8')
  
  // Match t('key') or t("key") patterns
  const tFunctionPattern = /t\(['"]([^'"]+)['"]\)/g
  let match
  while ((match = tFunctionPattern.exec(content)) !== null) {
    usedKeys.add(match[1])
  }

  // Match useTranslation('namespace') patterns to track namespaces
  const useTranslationPattern = /useTranslation\(['"]([^'"]+)['"]\)/g
  while ((match = useTranslationPattern.exec(content)) !== null) {
    // Store namespace for reference
    usedKeys.add(match[1])
  }

  return usedKeys
}

function getAllFiles(dir, pattern) {
  return glob.sync(pattern, { cwd: dir, absolute: true })
}

function main() {
  // Collect all translation keys
  const allKeys = new Set()
  const translationFiles = getAllFiles(LOCALES_DIR, '*.json')
  translationFiles.forEach(file => {
    collectTranslationKeys(file, allKeys)
  })

  // Collect all used keys
  const usedKeys = new Set()
  const sourceFiles = getAllFiles(SRC_DIR, '**/*.{ts,tsx,js,jsx}')
  sourceFiles.forEach(file => {
    findTranslationUsage(file, usedKeys)
  })

  // Find unused keys
  const unusedKeys = Array.from(allKeys).filter(key => !usedKeys.has(key))

  if (unusedKeys.length > 0) {
    console.error('Found unused translation keys:')
    unusedKeys.forEach(key => console.error(`- ${key}`))
    process.exit(1)
  }

  console.log('No unused translation keys found.')
  process.exit(0)
}

main()
