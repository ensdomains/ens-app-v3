import { BaseError } from './base.js'

export class UnsupportedNetworkError extends BaseError {
  network: string

  supportedNetworks: readonly string[]

  override name = 'UnsupportedNetworkError'

  constructor({
    network,
    supportedNetworks,
    details,
  }: {
    network: string
    supportedNetworks: readonly string[]
    details?: string
  }) {
    super(`Unsupported network: ${network}`, {
      metaMessages: [`- Supported networks: ${supportedNetworks.join(', ')}`],
      details,
    })
    this.network = network
    this.supportedNetworks = supportedNetworks
  }
}

export class NoChainError extends BaseError {
  override name = 'NoChainError'

  constructor() {
    super('No chain provided')
  }
}
