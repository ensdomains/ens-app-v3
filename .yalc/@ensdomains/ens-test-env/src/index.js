#!/usr/bin/env node
import path from 'path'
import { main as fetchData } from './fetch-data.js'
import { main as ganache } from './ganache.js'
import { main as manager } from './manager.js'

const args = process.argv.slice(2)
let config

if (args[0] === '--help' || args[0] === '-h') args[0] = 'help'

const help = () => {
  console.log(`
    Usage:
        ens-test-env start [--no-reset|--config|--use-tenderly]
        ens-test-env data [--load|--compress]
        ens-test-env help
    
    Options:
        --use-tenderly      Use tenderly instead of ganache for RPC
        --no-tenderly-del   Don't delete tenderly fork after running
        --no-reset          Don't reset data folder
        --config            Specify config directory
        --load              Load data from archive
        --compress          Compress data folder to archive
    `)
}

const checkKnownArgs = (maxArgs, ...knownArgs) => {
  const knownArgsArr = [...knownArgs]
  const unknownArgs = args.slice(1).filter((arg) => !knownArgsArr.includes(arg))
  if (unknownArgs.length > 0) {
    console.log(`Unknown arguments: ${unknownArgs.join(', ')}`)
    help()
    process.exit(1)
  }
  if (args.length > maxArgs + 1) {
    console.log(`Too many arguments: ${args.join(', ')}`)
    help()
    process.exit(1)
  }
}

const start = async () => {
  checkKnownArgs(3, '--no-reset', '--use-tenderly', '--no-tenderly-del')
  const opts = {
    resetData: !args.includes('--no-reset'),
    tenderly: args.includes('--use-tenderly'),
    tenderlyDel: !args.includes('--no-tenderly-del'),
  }
  if (opts.resetData) {
    await fetchData('--load', config)
  }
  if (!opts.tenderly) {
    ganache(config)
  }
  manager(config, opts.tenderly, opts.tenderlyDel)
}

const data = async () => {
  checkKnownArgs(1, '--load', '--compress')
  await fetchData(args[1], config)
  process.exit(0)
}

const main = async () => {
  // if config arg supplied, get config path as next arg
  const configArgInx = args.indexOf('--config') + 1
  // if config arg, try load config
  if (configArgInx > 0) {
    try {
      config = (
        await import(path.join(process.env.INIT_CWD, args[configArgInx]))
      ).default
      // if config loaded, remove config arg from args
      args.slice(configArgInx - 1, 2)
    } catch {
      console.log(`Config file ${args[configArgInx]} not found`)
      return help()
    }
  } else {
    config = (
      await import(path.join(process.env.INIT_CWD, 'ens-test-env.config.js'))
    ).default
  }
  // if config doesn't have all data, throw error
  if (!config || !config.docker || !config.archive) {
    console.log('No valid config found')
    return help()
  }
  // add default paths to config, and let them be replaced by specified vars
  config.paths = {
    archives: './archives',
    data: './data',
    ...(config.paths ? config.paths : {}),
  }
  switch (args[0]) {
    case 'help':
      help()
      break
    case 'start':
      start()
      break
    case 'data':
      data()
      break
    case undefined:
      console.log('Provide a command or argument.')
      help()
      break
    default:
      console.log(`Unknown command: ${args[0]}`)
      help()
      break
  }
}

main()
