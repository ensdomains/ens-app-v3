import { BaseRegistrarImplementation } from '@ensdomains/ens-contracts'
import { ethers } from 'ethers'

const defaultAddress = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85'

const ABI = BaseRegistrarImplementation

export default (provider: ethers.providers.JsonRpcProvider, address?: string) =>
  new ethers.Contract(address || defaultAddress, ABI, provider)
