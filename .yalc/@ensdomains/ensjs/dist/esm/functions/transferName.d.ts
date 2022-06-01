import { ethers } from 'ethers'
import { ENSArgs } from '..'
export default function (
  { contracts, provider }: ENSArgs<'contracts' | 'provider'>,
  name: string,
  newOwner: string,
  contract: 'registry' | 'nameWrapper' | 'baseRegistrar',
  options?: {
    addressOrIndex?: string | number
  },
): Promise<ethers.ContractTransaction>
