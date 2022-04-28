/**
 * @type {import('./config').ENSTestEnvConfig}
 **/
module.exports = {
  deployCommand: 'yarn hardhat deploy',
  tenderly: {
    user: 'ens',
    project: 'core',
    key: 'tenderly-key',
  },
  archive: {
    subgraphId: 'QmXxAE7Urtv6TPa8o8XmPwLVQNbH6r35hRKHP63udTxTNa',
    epochTime: 1646894980,
    blockNumber: 12066620,
    baseUrl: 'https://storage.googleapis.com/ens-manager-build-data',
    network: 'mainnet',
  },
  docker: {
    file: './docker-compose.yml',
    sudo: false,
  },
  ethereum: {
    chain: {
      chainId: 0,
    },
    fork: {
      url: 'https://example.com',
    },
    wallet: {
      mnemonic: 'test test test test test test test test test test test junk',
      unlockedAccounts: ['0x0000000000000000000000000000000000000000'],
    },
    database: {
      dbPath: './ganache',
    },
  },
  graph: {
    bypassLocal: false,
  },
  scripts: [
    {
      command: 'example',
      name: 'example',
      prefixColor: 'blue.bold',
      cwd: path.resolve('./'),
      finishOnExit: true,
      waitForGraph: true,
    },
  ],
  paths: {
    archives: './archives',
    data: './data',
  },
}
