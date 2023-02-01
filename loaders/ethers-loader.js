const { readdirSync, statSync } = require('fs')
const { join, basename } = require('path')

const requireAll = (dir) =>
  readdirSync(dir).reduce((modules, file) => {
    const fPath = join(dir, file)
    const fPathAsModule = fPath.replace(/.*\/node_modules\//, '')
    if (fPath.includes('esm') || fPath.includes('src')) return modules
    if (statSync(fPath).isDirectory()) {
      return { ...modules, ...requireAll(fPath) }
    }
    if (file.endsWith('.js')) {
      const imported = require(fPath)
      let keyMap = Object.keys(imported).map((k) => [k, fPathAsModule])
      if (file === 'index.js') {
        keyMap = keyMap.filter(([k]) => !modules[k])
        if (dir.match(/.*\/lib$/g)) {
          const [modName] = dir.match(/@ethersproject\/[a-z\-]*/)
          return {
            ...modules,
            ...Object.fromEntries(keyMap),
            [modName.replace('@ethersproject/', '')]: modName,
          }
        }
      }
      return { ...modules, ...Object.fromEntries(keyMap) }
    }
    return modules
  }, {})

const modules = requireAll(join(__dirname, '../node_modules/@ethersproject'))

exports.default = function (source) {
  const newModules = {}

  source = source.replace(
    /(?<=\n|^)import {(.*?)} from ["']ethers(\/lib\/((ethers)|(utils)))?["'];\n/gm,
    (m, p1) => {
      const items = p1.split(',').map((i) => i.trim())
      for (const item of items) {
        const original = item.split(' as ')[0]
        const importRef = modules[original]
        if (importRef) {
          if (!importRef.endsWith('js')) {
            newModules[importRef] = item
          } else {
            const arr = newModules[importRef]
            if (!arr) newModules[importRef] = [item]
            else if (!arr.includes(item)) arr.push(item)
          }
        } else {
          throw new Error(`Could not find module for ${original}`)
        }
      }
      return ''
    },
  )

  let newImports = ''
  for (const [k, v] of Object.entries(newModules)) {
    if (v === 'logger') {
      if (!newModules['@ethersproject/logger/lib/index.js']) {
        newImports += `import { Logger } from '${k}';\n`
      }
      newImports += `const logger = new Logger('ethers');\n`
    } else if (typeof v === 'object') {
      newImports += `import { ${v.join(', ')} } from '${k}';\n`
    } else {
      newImports += `import * as ${v} from '${k}';\n`
    }
  }

  return newImports + source
}
