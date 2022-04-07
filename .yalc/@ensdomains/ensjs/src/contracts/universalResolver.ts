import { ethers } from 'ethers'
import { UniversalResolver__factory } from '../generated/factories/UniversalResolver__factory'

const defaultAddress = '0x9e6c745CAEdA0AB8a7AD0f393ef90dcb7C70074A'

export default (provider: ethers.providers.JsonRpcProvider, address?: string) =>
  UniversalResolver__factory.connect(address || defaultAddress, provider)
