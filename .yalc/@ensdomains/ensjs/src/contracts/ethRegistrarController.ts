import type { JsonRpcProvider } from '@ethersproject/providers'
import { ETHRegistrarController__factory } from '../generated/factories/ETHRegistrarController__factory'

export default (provider: JsonRpcProvider, address: string) =>
  ETHRegistrarController__factory.connect(address, provider)
