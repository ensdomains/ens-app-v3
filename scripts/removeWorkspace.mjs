import fs from 'fs'

const args = process.argv.slice(2)

const yalcLock = JSON.parse(fs.readFileSync('./yalc.lock', 'utf8'))
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))

const version = yalcLock.packages[args[0]].replaced

console.log(`Removing ${args[0]}@${version}`)

packageJson.dependencies[args[0]] = version

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))
