import { ethers } from 'ethers'
import { Multicall__factory } from '../generated/factories/Multicall__factory'

export default (provider: ethers.providers.JsonRpcProvider, address: string) =>
  Multicall__factory.connect(address, provider)
