import { BaseError } from './base.js'

export class UnsupportedChainError extends BaseError {
  chainId: number

  supportedChains: readonly number[]

  override name = 'UnsupportedChainError'

  constructor({
    chainId,
    supportedChains,
    details,
  }: {
    chainId: number
    supportedChains: readonly number[]
    details?: string
  }) {
    super(`Unsupported chain: ${chainId}`, {
      metaMessages: [`- Supported chains: ${supportedChains.join(', ')}`],
      details,
    })
    this.chainId = chainId
    this.supportedChains = supportedChains
  }
}

export class NoChainError extends BaseError {
  override name = 'NoChainError'

  constructor() {
    super('No chain provided')
  }
}
