module.exports = {
  ganache: {
    block: 0,
    network: 'mainnet',
    networkId: 1,
    rpcUrl: 'http://localhost:8545',
    mnemonic: 'test test test test test test test test test test test junk',
    port: 8545,
    host: '0.0.0.0',
  },
  graph: {
    subgraphId: '',
    epochTime: 0,
    baseUrl: '',
    useSudo: false,
    bypassLocalRpc: false,
    composeFile: './docker-compose.yml',
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
    deployments: './deployments',
  },
}
