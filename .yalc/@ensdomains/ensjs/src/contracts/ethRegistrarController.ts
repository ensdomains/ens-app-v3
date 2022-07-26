import { ethers } from 'ethers'
import { ETHRegistrarController__factory } from '../generated/factories/ETHRegistrarController__factory'

export default (provider: ethers.providers.JsonRpcProvider, address: string) =>
  ETHRegistrarController__factory.connect(address, provider)
