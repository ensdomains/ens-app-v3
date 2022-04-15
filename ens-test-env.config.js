require('dotenv').config({ path: process.env.INIT_CWD + '/.env.local' })

module.exports = {
  ganache: {
    block: 12066620,
    network: 'ropsten',
    networkId: 3,
    rpcUrl: process.env.FORK_RPC_URL,
    mnemonic: 'test test test test test test test test test test test junk',
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
          command: process.env.CI ? 'yarn cypress:ci' : 'yarn cypress:start',
          name: 'cypress',
          prefixColor: 'yellow.bold',
          finishOnExit: true,
          waitForGraph: true,
        },
      ]
    : [],
}
