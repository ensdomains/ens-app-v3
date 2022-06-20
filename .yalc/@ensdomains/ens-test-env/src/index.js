#!/usr/bin/env node
import { Command, Option } from 'commander'
import path from 'path'
import { main as fetchData } from './fetch-data.js'
import { main as ganache } from './ganache.js'
import { main as manager } from './manager.js'

let config
const program = new Command()

program
  .name('ens-test-env')
  .description('A testing environment for everything ENS')
  .version(process.env.npm_package_version || '0.1.0')
  .option('-c, --config <path>', 'Specify config directory')
  .hook('preAction', async () => {
    // if config arg supplied, get config path as next arg
    const configDir = program.optsWithGlobals().config
    // if config arg, try load config
    if (configDir) {
      try {
        config = (await import(path.join(process.env.INIT_CWD, configDir)))
          .default
      } catch {
        program.error(`Config file ${configDir} not found`)
      }
    } else {
      config = (
        await import(path.join(process.env.INIT_CWD, 'ens-test-env.config.js'))
      ).default
    }
    // if config doesn't have all data, throw error
    if (!config || !config.archive || !config.ethereum) {
      program.error('No valid config found')
      return help()
    }
    // add default paths to config, and let them be replaced by specified vars
    config.paths = {
      archives: './archives',
      data: './data',
      ...(config.paths ? config.paths : {}),
    }
  })

program
  .command('start')
  .description('Starts the test environment')
  .addOption(new Option('-nr, --no-reset', "Don't reset the data folder"))
  .addOption(new Option('-C, --clean', 'Use a clean data folder'))
  .addOption(new Option('-ng, --no-graph', "Don't start the graph"))
  .addOption(
    new Option('-l, --local', 'Use the local datasets').conflicts([
      'clean',
      'no-reset',
    ]),
  )
  .addOption(new Option('-t, --tenderly', 'Use tenderly for the node'))
  .addOption(
    new Option(
      '--no-tenderly-delete',
      "Don't delete the tenderly fork after running",
    ).implies({ tenderly: true }),
  )
  .action(async (options) => {
    if (options.clean) {
      await fetchData('clean', config)
    } else if (!options.noReset) {
      await fetchData('load', config, options.local)
    }
    if (!options.tenderly) {
      ganache(config, options.clean)
    }
    manager(config, options)
  })

program
  .command('load')
  .description('Fetches data from archive')
  .addOption(new Option('-l, --local', 'Use the local datasets'))
  .action(async ({ local }) => {
    await fetchData('load', config, local)
  })

program
  .command('compress')
  .description('Compresses data folder to an archive')
  .addOption(new Option('-l, --local', 'Use the local datasets'))
  .action(async ({ local }) => {
    await fetchData('compress', config, local)
  })

program.parse(process.argv)
