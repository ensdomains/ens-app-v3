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

  const content = JSON.parse(await fs.readFile(filePath, 'utf-8'))
  
  function removeKey(obj, keyPath) {
    const parts = keyPath.split('.')
    const lastPart = parts.pop()
    let current = obj
    
    for (const part of parts) {
      if (!current[part] || typeof current[part] !== 'object') return
      current = current[part]
    }
    
    delete current[lastPart]
    
    // Clean up empty objects
    if (Object.keys(current).length === 0 && parts.length > 0) {
      removeKey(obj, parts.join('.'))
    }
  }
  
  for (const key of keysToRemove) {
    if (key) removeKey(content, key)
  }
  
  await fs.writeFile(filePath, JSON.stringify(content, null, 2) + '\n')
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
