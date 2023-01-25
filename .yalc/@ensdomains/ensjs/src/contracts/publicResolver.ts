import type { JsonRpcProvider } from '@ethersproject/providers'
import { PublicResolver__factory } from '../generated/factories/PublicResolver__factory'

export default (provider: JsonRpcProvider, address: string) =>
  PublicResolver__factory.connect(address, provider)
