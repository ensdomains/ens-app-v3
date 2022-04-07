import { ethers } from 'ethers'
import { DNCOCURP__factory } from '../generated/factories/DNCOCURP__factory'

const defaultAddress = '0xf178d75267cd7EA9DfB6F82Bb1f6e7B8edb43E43'

export default (provider: ethers.providers.JsonRpcProvider, address?: string) =>
  DNCOCURP__factory.connect(address || defaultAddress, provider)
