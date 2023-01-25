import type { JsonRpcProvider } from '@ethersproject/providers'
import { UniversalResolver__factory } from '../generated/factories/UniversalResolver__factory'

export default (provider: JsonRpcProvider, address: string) =>
  UniversalResolver__factory.connect(address, provider)
