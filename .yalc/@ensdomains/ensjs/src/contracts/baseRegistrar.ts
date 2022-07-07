import { ethers } from 'ethers'
import { BaseRegistrarImplementation__factory } from '../generated/factories/BaseRegistrarImplementation__factory'

export default (provider: ethers.providers.JsonRpcProvider, address: string) =>
  BaseRegistrarImplementation__factory.connect(address, provider)
