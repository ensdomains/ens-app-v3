import { ethers } from 'ethers'
import { ENSArgs } from '..'
export default function (
  { contracts, provider }: ENSArgs<'contracts' | 'provider'>,
  name: string,
  contract: 'registry' | 'nameWrapper',
  resolver?: string,
  options?: {
    addressOrIndex?: string | number
  },
): Promise<ethers.ContractTransaction>
