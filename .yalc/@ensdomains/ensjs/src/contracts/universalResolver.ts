import { ethers } from 'ethers'
import { UniversalResolver__factory } from '../generated/factories/UniversalResolver__factory'

const defaultAddress = '0x454b1F7d4C741A2f86AF7eF19b44B2A6EE179443'

export default (provider: ethers.providers.JsonRpcProvider, address?: string) =>
  UniversalResolver__factory.connect(address || defaultAddress, provider)
