import { ethers } from 'ethers'
import { DoNotCallOnChainUniversalResolverProxy__factory } from '../generated/factories/DoNotCallOnChainUniversalResolverProxy__factory'

export default (provider: ethers.providers.JsonRpcProvider, address: string) =>
  DoNotCallOnChainUniversalResolverProxy__factory.connect(address, provider)
