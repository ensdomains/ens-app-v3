require('dotenv').config({ path: process.env.INIT_CWD + '/.env.local' })
require('dotenv').config({
  path: process.env.INIT_CWD + '/.env',
  override: true,
})

console.log('GOING TO LOG ENV VARS')
console.log('chainid', process.env.CHAIN_ID)
console.log('network', process.env.NETWORK)
console.log('secretwords', process.env.SECRET_WORDS)
console.log('block', process.env.BLOCK_HEIGHT)

/**
 * @type {import('@ensdomains/ens-test-env').ENSTestEnvConfig}
 **/
module.exports = {
  deployCommand: 'yarn hardhat deploy',
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
            command: 'yarn buildandstart:glocal',
            name: 'nextjs',
            prefixColor: 'magenta.bold',
          },
          {
            command: `yarn wait-on http://localhost:3000 && ${
              process.env.CI ? 'yarn synpress:ci' : 'yarn synpress:start'
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
