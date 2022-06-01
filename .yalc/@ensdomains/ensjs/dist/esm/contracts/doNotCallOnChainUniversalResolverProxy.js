import { DoNotCallOnChainUniversalResolverProxy__factory } from '../generated/factories/DoNotCallOnChainUniversalResolverProxy__factory'
const defaultAddress = '0x17ED1CF9A6E57e3E9fC0832bee4a965eB6ee12E6'
export default (provider, address) =>
  DoNotCallOnChainUniversalResolverProxy__factory.connect(
    address || defaultAddress,
    provider,
  )
