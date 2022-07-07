import { ethers } from 'ethers'
import { PublicResolver__factory } from '../generated/factories/PublicResolver__factory'

export default (provider: ethers.providers.JsonRpcProvider, address: string) =>
  PublicResolver__factory.connect(address, provider)
