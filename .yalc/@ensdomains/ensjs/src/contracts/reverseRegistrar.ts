import { ethers } from 'ethers'
import { ReverseRegistrar__factory } from '../generated/factories/ReverseRegistrar__factory'

export default (provider: ethers.providers.JsonRpcProvider, address: string) =>
  ReverseRegistrar__factory.connect(address, provider)
