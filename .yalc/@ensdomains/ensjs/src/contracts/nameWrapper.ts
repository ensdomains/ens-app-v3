import { ethers } from 'ethers'
import { NameWrapper__factory } from '../generated/factories/NameWrapper__factory'

export default (provider: ethers.providers.JsonRpcProvider, address: string) =>
  NameWrapper__factory.connect(address, provider)
