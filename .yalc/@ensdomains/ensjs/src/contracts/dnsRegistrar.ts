import { ethers } from 'ethers'
import { DNSRegistrar__factory } from '../generated/factories/DNSRegistrar__factory'

export default (provider: ethers.providers.JsonRpcProvider, address: string) =>
  DNSRegistrar__factory.connect(address, provider)
