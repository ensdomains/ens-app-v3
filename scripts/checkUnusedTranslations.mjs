import fs from 'fs/promises'
import path from 'path'

const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales', 'en')
const SRC_DIR = path.join(process.cwd(), 'src')

async function getProfileRecordGroups() {
  const content = await fs.readFile(path.join(SRC_DIR, 'constants', 'profileRecordOptions.ts'), 'utf-8')
  const match = content.match(/type\s+ProfileRecordGroup\s*=\s*(['"].*?['"])/g)
  if (!match) return []
  return match[0].match(/['"]([^'"]+)['"]/g)?.map(s => s.slice(1, -1)) || []
}

async function getSupportedAddresses() {
  const content = await fs.readFile(path.join(SRC_DIR, 'constants', 'supportedAddresses.ts'), 'utf-8')
  const match = content.match(/export\s+const\s+supportedAddresses\s*=\s*\[(.*?)\]/s)
  if (!match) return []
  return match[1].match(/['"]([^'"]+)['"]/g)?.map(s => s.slice(1, -1)) || []
}

async function collectTranslationKeys(filePath, allKeys = new Set(), keyToFiles = new Map()) {
  const content = await fs.readFile(filePath, 'utf-8')
  if (!content.trim() || content.trim() === '{}') {
    return { allKeys, keyToFiles }
  }
  let data
  try {
    data = JSON.parse(content)
  } catch (e) {
    console.error(`Error parsing ${filePath}: ${e.message}`)
    return { allKeys, keyToFiles }
  }
  if (Object.keys(data).length === 0) {
    return { allKeys, keyToFiles }
  }
  function recurse(obj, prefix = '') {
    for (const key of Object.keys(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (typeof obj[key] === 'string') {
        allKeys.add(fullKey)
        const files = keyToFiles.get(fullKey) || new Set()
        files.add(filePath)
        keyToFiles.set(fullKey, files)
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        recurse(obj[key], fullKey)
        allKeys.add(fullKey)
      }
    }
  }
  recurse(data)
  return { allKeys, keyToFiles }
}

async function findTranslationUsage(filePath, usedKeys = new Set(), dynamicPatterns = []) {
  const content = await fs.readFile(filePath, 'utf-8')
  
  // Match direct t('key') or t("key") patterns
  const tFunctionPattern = /t\(['"]([^'"]+)['"]\)/g
  let match
  while ((match = tFunctionPattern.exec(content)) !== null) {
    usedKeys.add(match[1])
  }

  // Match template literal patterns like t(`steps.profile.options.groups.${group}.label`)
  const templatePattern = /t\(`([^`]+)`\)/g
  while ((match = templatePattern.exec(content)) !== null) {
    const template = match[1]
    if (template.includes('${')) {
      dynamicPatterns.push(template)
    } else {
      usedKeys.add(template)
    }
  }

  // Match registerI18n object access patterns in tests
  const registerPattern = /registerI18n\.([a-zA-Z.]+)(?:\[['"]([^'"]+)['"]\])?/g
  while ((match = registerPattern.exec(content)) !== null) {
    const [_, pathKey, key] = match
    if (key) {
      // Handle dynamic key access like registerI18n.steps.profile.options.groups.address.placeholder[key]
      usedKeys.add(`${pathKey}.${key}`)
    } else {
      // Handle direct path access and preserve parent paths for dynamic access
      usedKeys.add(pathKey)
      // If this is a type check on a placeholder object, preserve all address placeholders
      if (pathKey.endsWith('.placeholder')) {
        const supportedAddressesPath = path.join(SRC_DIR, 'constants', 'supportedAddresses.ts')
        const supportedAddressesContent = await fs.readFile(supportedAddressesPath, 'utf-8')
        const addressMatch = supportedAddressesContent.match(/supportedAddresses\s*=\s*\[(.*?)\]/s)
        if (addressMatch) {
          const addresses = addressMatch[1].match(/['"]([^'"]+)['"]/g)?.map(s => s.slice(1, -1)) || []
          for (const addr of addresses) {
            usedKeys.add(`${pathKey}.${addr}`)
          }
        }
      }
    }
  }

  // Match type references like keyof typeof registerI18n.steps.profile.options.groups.address.placeholder
  const typePattern = /typeof\s+registerI18n\.([a-zA-Z.]+)/g
  while ((match = typePattern.exec(content)) !== null) {
    usedKeys.add(match[1])
  }

  return { usedKeys, dynamicPatterns }
}

async function expandDynamicKeys(dynamicPatterns, groups, addresses) {
  const expandedKeys = new Set()

  for (const pattern of dynamicPatterns) {
    if (pattern.includes('${group}')) {
      for (const group of groups) {
        const expanded = pattern.replace(/\${group}/g, group)
        if (expanded.includes('${')) {
          if (group === 'address' && expanded.includes('placeholder.${')) {
            for (const addr of addresses) {
              expandedKeys.add(expanded.replace(/\${.*?}/g, addr))
            }
          }
        } else {
          expandedKeys.add(expanded)
        }
      }
    }
  }

  return expandedKeys
}

async function getAllFiles(dir, extension) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async entry => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        return getAllFiles(fullPath, extension)
      } else if (entry.isFile() && (
        typeof extension === 'string' ? entry.name.endsWith(extension) :
        extension.some(ext => entry.name.endsWith(ext))
      )) {
        return [fullPath]
      }
      return []
    })
  )
  return files.flat()
}

async function main() {
  try {
    const [groups, addresses] = await Promise.all([
      getProfileRecordGroups(),
      getSupportedAddresses()
    ])

    // Collect all translation keys and their source files
    const allKeys = new Set()
    const keyToFiles = new Map()
    const translationFiles = await getAllFiles(LOCALES_DIR, '.json')
    await Promise.all(translationFiles.map(file => collectTranslationKeys(file, allKeys, keyToFiles)))

    // Collect all used keys and dynamic patterns
    const usedKeys = new Set()
    const dynamicPatterns = []
    const sourceFiles = await getAllFiles(SRC_DIR, ['.tsx', '.ts', '.test.ts', '.test.tsx'])
    const results = await Promise.all(sourceFiles.map(file => findTranslationUsage(file, usedKeys, dynamicPatterns)))
    
    // Expand dynamic keys based on known groups and addresses
    const expandedKeys = await expandDynamicKeys(dynamicPatterns, groups, addresses)
    for (const key of expandedKeys) {
      usedKeys.add(key)
    }

    // Find truly unused keys (not used in any file)
    const unusedKeys = Array.from(allKeys).filter(key => !usedKeys.has(key))

    // Group unused keys by their JSON file
    const keysByFile = {}
    for (const key of unusedKeys) {
      const files = keyToFiles.get(key)
      if (!files) continue
      for (const file of files) {
        const content = await fs.readFile(file, 'utf-8')
        if (!content.trim() || content.trim() === '{}') continue
        try {
          const data = JSON.parse(content)
          if (Object.keys(data).length === 0) continue
          if (!keysByFile[file]) keysByFile[file] = []
          const [namespace, ...rest] = key.split('.')
          if (!rest.length) continue
          keysByFile[file].push(rest.join('.'))
        } catch (e) {
          console.error(`Error parsing ${file}: ${e.message}`)
          continue
        }
      }
    }

    // Output the keys grouped by file
    for (const [file, keys] of Object.entries(keysByFile)) {
      if (keys.length === 0) continue
      console.log(`\nFile: ${file}`)
      console.log('Keys to remove:')
      console.log(JSON.stringify(keys, null, 2))
    }

    if (unusedKeys.length > 0) {
      console.error('\nError: Found unused translation keys. Build failed.')
      process.exit(1)
    }
    console.log('\nSuccess: No unused translation keys found.')
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
