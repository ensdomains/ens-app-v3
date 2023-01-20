import type { JsonRpcProvider } from '@ethersproject/providers'
import { ReverseRegistrar__factory } from '../generated/factories/ReverseRegistrar__factory'

export default (provider: JsonRpcProvider, address: string) =>
  ReverseRegistrar__factory.connect(address, provider)
