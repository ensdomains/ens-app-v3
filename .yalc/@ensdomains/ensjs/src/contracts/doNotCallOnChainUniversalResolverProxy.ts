import { ethers } from 'ethers'
import { DoNotCallOnChainUniversalResolverProxy__factory } from '../generated/factories/DoNotCallOnChainUniversalResolverProxy__factory'

const defaultAddress = '0x17ED1CF9A6E57e3E9fC0832bee4a965eB6ee12E6'

export default (provider: ethers.providers.JsonRpcProvider, address?: string) =>
  DoNotCallOnChainUniversalResolverProxy__factory.connect(
    address || defaultAddress,
    provider,
  )
