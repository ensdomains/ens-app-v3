require('dotenv').config({ path: process.env.INIT_CWD + '/.env.local' })
require('dotenv').config({ path: process.env.INIT_CWD + '/.env' })

module.exports = {
  docker: {
    chainId: parseInt(process.env.CHAIN_ID),
    network: process.env.NETWORK,
    forkRpcUrl: process.env.FORK_RPC_URL,
    secretWords: process.env.SECRET_WORDS,
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
              process.env.CI ? 'yarn cypress:ci' : 'yarn cypress:start'
            }`,
            name: 'cypress',
            prefixColor: 'yellow.bold',
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
