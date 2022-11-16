require('dotenv').config({ path: process.env.INIT_CWD + '/.env.local' })
require('dotenv').config({
  path: process.env.INIT_CWD + '/.env',
  override: true,
})
require('dotenv').config({
  path: process.env.INIT_CWD + '/.env.development.local',
  override: true,
})

process.env.ADDRESS_ETH_REGISTRAR = '0xc8CB5439c767A63aca1c01862252B2F3495fDcFE'
process.env.ADDRESS_NAME_WRAPPER = '0xB7aa4c318000BB9bD16108F81C40D02E48af1C42'
process.env.BATCH_GATEWAY_URLS = JSON.stringify([
  'https://universal-offchain-unwrapper.ens-cf.workers.dev/',
])

/**
 * @type {import('./ens-test-env').ENSTestEnvConfig}
 **/
module.exports = {
  deployCommand: 'pnpm hardhat deploy',
  buildCommand: 'pnpm build:glocal',
  scripts: [
    {
      command: 'pnpm start',
      name: 'nextjs',
      prefixColor: 'magenta.bold',
    },
    {
      command: `pnpm wait-on http://localhost:3000 && ${
        process.env.CI ? 'pnpm synpress:ci' : 'pnpm synpress:start'
      }`,
      name: 'synpress',
      prefixColor: 'yellow.bold',
      env: process.env,
      finishOnExit: true,
    },
  ],
  paths: {
    data: './data',
  },
}
