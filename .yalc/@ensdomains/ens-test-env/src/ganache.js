#!/usr/bin/env node
import ganache from 'ganache'

export const main = async (config, clean) => {
  const writeToStdout = process.stdout.write.bind(process.stdout)

  const outputsToIgnore = [
    'eth_getBlockByNumber',
    'eth_getBlockByHash',
    'eth_getTransactionReceipt',
  ]

  process.stdout.write = (chunk, ...args) => {
    if (
      typeof chunk === 'string' &&
      outputsToIgnore.reduce(
        (prev, curr) => prev || chunk.includes(curr),
        false,
      )
    ) {
      return
    }
    return writeToStdout(chunk, ...args)
  }

  const _config = {
    ...config.ethereum,
    chain: {
      ...config.ethereum.chain,
      networkId: config.ethereum.chain.chainId,
    }
  }


  if (clean) {
    delete _config.fork
  } else {
    _config.fork = {
      ...config.ethereum.fork,
      blockNumber: config.archive.blockNumber,
    }
  }

  const server = ganache.server(_config)

  server.listen(8545, '0.0.0.0', (err) => {
    if (err) throw new Error(err.message)

    console.log('_config: ', _config)

    console.log('Ganache listening on port 8545')
    console.log('Available Accounts:')
    Object.keys(server.provider.getInitialAccounts()).map((a) => console.log(a))
    console.log('\n')
    console.log('Network ID:', _config.chain.networkId)
    console.log('Chain ID:', _config.chain.chainId)
    console.log('\n')
    console.log('Using Options:')
    console.log(server.provider.getOptions())
  })
}
