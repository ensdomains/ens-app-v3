import type { JsonRpcProvider } from '@ethersproject/providers'
import { DNSRegistrar__factory } from '../generated/factories/DNSRegistrar__factory'

export default (provider: JsonRpcProvider, address: string) =>
  DNSRegistrar__factory.connect(address, provider)
