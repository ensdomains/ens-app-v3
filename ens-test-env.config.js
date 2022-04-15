require('dotenv').config({ path: process.env.INIT_CWD + '/.env.local' })
require('dotenv').config({ path: process.env.INIT_CWD + '/.env' })

module.exports = {
  ganache: {
    block: parseInt(process.env.BLOCK_HEIGHT),
    network: process.env.NETWORK,
    networkId: parseInt(process.env.CHAIN_ID),
    rpcUrl: process.env.FORK_RPC_URL,
    mnemonic: process.env.SECRET_WORDS,
    port: 8545,
    host: '0.0.0.0',
  },
  graph: {
    subgraphId: 'QmXxAE7Urtv6TPa8o8XmPwLVQNbH6r35hRKHP63udTxTNa',
    epochTime: 1646894980,
    baseUrl: 'https://storage.googleapis.com/ens-manager-build-data',
    useSudo: false,
    bypassLocalRpc: false,
  },
  scripts: process.env.E2E
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
    : [],
}
