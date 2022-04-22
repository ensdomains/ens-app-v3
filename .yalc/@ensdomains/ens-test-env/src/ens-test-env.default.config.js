module.exports = {
  deployCommand: 'yarn hardhat deploy',
  tenderlyUser: 'ens',
  tenderlyProject: 'core',
  tenderlyKey: 'tenderly-key',
  docker: {
    file: './docker-compose.yml',
    sudo: false,
    chainId: 0,
    network: 'mainnet',
    forkRpcUrl: 'https://example.com',
    graphRpcUrl: 'http://localhost:8545',
    secretWords: 'test test test test test test test test test test test junk',
  },
  archive: {
    subgraphId: 'QmXxAE7Urtv6TPa8o8XmPwLVQNbH6r35hRKHP63udTxTNa',
    epochTime: 1646894980,
    block: 12066620,
    baseUrl: 'https://storage.googleapis.com/ens-manager-build-data',
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
