import { ethers } from 'ethers'
import { UniversalResolver__factory } from '../generated/factories/UniversalResolver__factory'

export default (provider: ethers.providers.JsonRpcProvider, address: string) =>
  UniversalResolver__factory.connect(address, provider)
