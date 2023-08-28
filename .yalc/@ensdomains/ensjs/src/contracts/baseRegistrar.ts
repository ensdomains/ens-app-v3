import type { JsonRpcProvider } from '@ethersproject/providers'
import { BaseRegistrarImplementation__factory } from '../generated/factories/BaseRegistrarImplementation__factory'

export default (provider: JsonRpcProvider, address: string) =>
  BaseRegistrarImplementation__factory.connect(address, provider)
