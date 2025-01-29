import fs from 'fs/promises'
import path from 'path'

const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales', 'en')
const SRC_DIR = path.join(process.cwd(), 'src')

async function collectTranslationKeys(filePath, allKeys = new Set()) {
  const content = await fs.readFile(filePath, 'utf-8')
  if (!content.trim() || content.trim() === '{}') {
    return allKeys
  }
  const data = JSON.parse(content)
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

async function findTranslationUsage(filePath, usedKeys = new Set()) {
  const content = await fs.readFile(filePath, 'utf-8')
  
  // Match t('key') or t("key") patterns
  const tFunctionPattern = /t\(['"]([^'"]+)['"]\)/g
  let match
  while ((match = tFunctionPattern.exec(content)) !== null) {
    usedKeys.add(match[1])
  }

  return usedKeys
}

async function getAllFiles(dir, extension) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async entry => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        return getAllFiles(fullPath, extension)
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        return [fullPath]
      }
      return []
    })
  )
  return files.flat()
}

async function main() {
  try {
    // Collect all translation keys
    const allKeys = new Set()
    const translationFiles = await getAllFiles(LOCALES_DIR, '.json')
    await Promise.all(translationFiles.map(file => collectTranslationKeys(file, allKeys)))

    // Collect all used keys
    const usedKeys = new Set()
    const sourceFiles = await getAllFiles(SRC_DIR, '.tsx')
    const moreSourceFiles = await getAllFiles(SRC_DIR, '.ts')
    await Promise.all([...sourceFiles, ...moreSourceFiles].map(file => findTranslationUsage(file, usedKeys)))

    // Find unused keys
    const unusedKeys = Array.from(allKeys).filter(key => !usedKeys.has(key))

    // Group unused keys by their JSON file
    const keysByFile = {}
    for (const key of unusedKeys) {
      const [namespace, ...rest] = key.split('.')
      if (!rest.length) continue // Skip namespace-only keys
      const filePath = path.join(LOCALES_DIR, `${namespace}.json`)
      if (!keysByFile[filePath]) keysByFile[filePath] = []
      keysByFile[filePath].push(rest.join('.'))
    }

    // Output the keys grouped by file in a format easy to copy
    for (const [file, keys] of Object.entries(keysByFile)) {
      if (keys.length === 0) continue // Skip files with no unused keys
      console.log(`\nFile: ${file}`)
      console.log('Keys to remove:')
      console.log(JSON.stringify(keys, null, 2))
    }

    if (unusedKeys.length > 0) {
      process.exit(1)
    }
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
