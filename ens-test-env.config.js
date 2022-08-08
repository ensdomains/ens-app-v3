require('dotenv').config({ path: process.env.INIT_CWD + '/.env.local' })
require('dotenv').config({
  path: process.env.INIT_CWD + '/.env',
  override: true,
})

process.env.ADDRESS_ETH_REGISTRAR = '0xc5a5C42992dECbae36851359345FE25997F5C42d'
process.env.ADDRESS_NAME_WRAPPER = '0x9E545E3C0baAB3E08CdfD552C960A1050f373042'

/**
 * @type {import('@ensdomains/ens-test-env').ENSTestEnvConfig}
 **/
module.exports = {
  deployCommand: 'pnpm hardhat deploy',
  archive: {
    localSubgraphId: process.env.LOCAL_SUBGRAPH_ID,
    subgraphId: process.env.SUBGRAPH_ID,
    epochTime: process.env.EPOCH_TIME,
    blockNumber: parseInt(process.env.BLOCK_HEIGHT),
    baseUrl: 'https://storage.googleapis.com/ens-manager-build-data',
    network: process.env.NETWORK,
  },
  ethereum: {
    chain: {
      chainId: parseInt(process.env.CHAIN_ID),
      time: 1659500634000,
    },
    fork: {
      url: process.env.FORK_RPC_URL,
    },
    wallet: {
      mnemonic: process.env.SECRET_WORDS,
      unlockedAccounts: ['0xa303ddC620aa7d1390BACcc8A495508B183fab59'],
    },
  },
  scripts: [
    ...(process.env.E2E
      ? [
          {
            command: process.env.CI ? 'pnpm start' : 'pnpm buildandstart:glocal',
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
            waitForGraph: true,
          },
        ]
      : []),
  ],
  paths: {
    archives: './archives',
    data: './data',
  },
}
