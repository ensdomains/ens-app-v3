import type { JsonRpcProvider } from '@ethersproject/providers'
import { NameWrapper__factory } from '../generated/factories/NameWrapper__factory'

export default (provider: JsonRpcProvider, address: string) =>
  NameWrapper__factory.connect(address, provider)
