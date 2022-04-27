require('dotenv').config({ path: process.env.INIT_CWD + '/.env.local' })
require('dotenv').config({ path: process.env.INIT_CWD + '/.env' })

console.log('GOING TO LOG ENV VARS')
console.log('chainid', process.env.CHAIN_ID)
console.log('network', process.env.NETWORK)
console.log('secretwords', process.env.SECRET_WORDS)

module.exports = {
  docker: {
    chainId: parseInt(process.env.CHAIN_ID),
    network: process.env.NETWORK,
    forkRpcUrl: process.env.FORK_RPC_URL,
    secretWords: process.env.SECRET_WORDS,
    unlockedAccounts: ['0xa303ddC620aa7d1390BACcc8A495508B183fab59'],
  },
  archive: {
    subgraphId: process.env.SUBGRAPH_ID,
    epochTime: process.env.EPOCH_TIME,
    block: parseInt(process.env.BLOCK_HEIGHT),
    baseUrl: 'https://storage.googleapis.com/ens-manager-build-data',
  },
  deployCommand: 'yarn hardhat deploy',
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
