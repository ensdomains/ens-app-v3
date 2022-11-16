import { config } from 'dotenv'
import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

export const main = (options) => {
  const directory = path.resolve(process.cwd(), options.directory)
  const fileName = path.resolve(directory, 'subgraph.yaml')
  const file = yaml.load(fs.readFileSync(fileName, 'utf8'))

  config({ path: path.resolve(process.cwd(), options.env) })

  const parsed = JSON.parse(process.env[options.var])
  const addresses = Object.keys(parsed).reduce(
    (acc, key) => ({ ...acc, [key.toLowerCase()]: parsed[key] }),
    {},
  )
  const addressKeys = Object.keys(addresses)
  // eslint-disable-next-line no-restricted-syntax
  for (const s of file.dataSources) {
    s.network = 'mainnet'
    if (s.source.startBlock) s.source.startBlock = 0
    // eslint-disable-next-line no-continue
    if (!s.source.address) continue
    let sourceName = s.name.toLowerCase()
    if (sourceName.endsWith('old')) {
      sourceName = sourceName.replace(/(.*)old/, 'legacy$1')
    }
    if (sourceName === 'baseregistrar') {
      sourceName = 'baseregistrarimplementation'
    }
    if (addressKeys.includes(sourceName)) {
      s.source.address = addresses[sourceName]
    } else {
      throw new Error(`Couldn't lookup contract: ${sourceName}, ${s.name}`)
    }
  }

  fs.writeFileSync(fileName, yaml.dump(file))
}
