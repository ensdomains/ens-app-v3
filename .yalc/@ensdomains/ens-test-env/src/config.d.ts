import { ConcurrentlyCommandInput } from 'concurrently'
import { ServerOptions } from 'ganache'

/**
 * ens-test-env configuration object
 * @see [configuration documentation](https://github.com/ensdomains/ensjs-v3/tree/main/packages/ens-test-env/)
 */
export interface ENSTestEnvConfig {
  deployCommand?: string
  tenderly?: {
    user: string
    project: string
    key: string
  }
  archive: {
    localSubgraphId?: string
    subgraphId: string
    epochTime: number
    blockNumber: number
    baseUrl: string
    network: string
  }
  docker: {
    file?: string
    sudo?: boolean
  }
  ethereum: {
    chain: {
      chainId: number
    }
    fork: {
      url: string
      blockNumber: number
    }
    wallet: {
      mnemonic: string
    }
  } & ServerOptions<'ethereum'>
  graph?: {
    bypassLocal?: boolean
  }
  scripts?: (ConcurrentlyCommandInput & {
    finishOnExit?: boolean
    waitForGraph?: boolean
  })[]
  paths?: {
    archives?: string
    data?: string
  }
}
