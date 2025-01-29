import fs from 'fs/promises'
import path from 'path'
import { spawn } from 'child_process'

const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales', 'en')

async function getUnusedKeys() {
  return new Promise((resolve, reject) => {
    const checkScript = spawn('node', ['scripts/checkUnusedTranslations.mjs'], {
      stdio: ['ignore', 'pipe', 'pipe']
    })

    let output = ''
    let error = ''

    checkScript.stdout.on('data', (data) => {
      output += data.toString()
    })

    checkScript.stderr.on('data', (data) => {
      error += data.toString()
    })

    checkScript.on('close', (code) => {
      if (code !== 0 && code !== 1) {
        reject(new Error(`Check script failed with code ${code}: ${error}`))
        return
      }

      const keysByFile = {}
      let currentFile = null

      output.split('\n').forEach(line => {
        if (line.startsWith('File: ')) {
          currentFile = line.substring(6).trim()
          keysByFile[currentFile] = []
        } else if (line === 'Keys to remove:') {
          // Skip this line
        } else if (line.trim() && currentFile) {
          try {
            const keys = JSON.parse(line)
            keysByFile[currentFile].push(...keys)
          } catch (e) {
            // Skip non-JSON lines
          }
        }
      })

      resolve(keysByFile)
    })
  })
}

async function removeKeysFromFile(filePath, keysToRemove) {
  if (!keysToRemove?.length) return

  const content = await fs.readFile(filePath, 'utf-8')
  let data
  try {
    data = JSON.parse(content)
  } catch (e) {
    console.error(`Error parsing ${filePath}: ${e.message}`)
    return
  }

  let modified = false
  function removeKey(obj, keyPath) {
    const parts = keyPath.split('.')
    let current = obj
    let parent = null
    let lastPart = null
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      if (i === parts.length - 1) {
        parent = current
        lastPart = part
      } else {
        if (!current[part] || typeof current[part] !== 'object') return
        current = current[part]
      }
    }
    
    if (parent && lastPart && lastPart in parent) {
      delete parent[lastPart]
      modified = true
      
      // Clean up empty parent objects recursively
      let currentPath = parts.slice(0, -1)
      while (currentPath.length > 0) {
        let current = obj
        for (const part of currentPath) {
          if (!current[part]) break
          current = current[part]
        }
        if (current && typeof current === 'object' && Object.keys(current).length === 0) {
          const parentKey = currentPath.join('.')
          removeKey(obj, parentKey)
        }
        currentPath.pop()
      }
    }
  }
  
  for (const key of keysToRemove) {
    if (key) removeKey(data, key)
  }

  if (modified) {
    const newContent = JSON.stringify(data, null, 2)
    if (newContent !== '{}') {
      await fs.writeFile(filePath, newContent + '\n')
    }
  }
}

async function main() {
  try {
    const keysByFile = await getUnusedKeys()
    for (const [file, keys] of Object.entries(keysByFile)) {
      try {
        await removeKeysFromFile(file, keys)
        console.log(`Removed unused keys from ${path.basename(file)}`)
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`Skipping ${path.basename(file)} - file does not exist`)
        } else {
          console.error(`Error processing ${path.basename(file)}:`, error)
        }
      }
    }
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
