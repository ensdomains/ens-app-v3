import type { JsonRpcProvider } from '@ethersproject/providers'
import { Multicall__factory } from '../generated/factories/Multicall__factory'

export default (provider: JsonRpcProvider, address: string) =>
  Multicall__factory.connect(address, provider)
