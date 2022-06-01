import { ethers } from 'ethers'
import { ENSArgs } from '..'
import { FuseOptions } from '../@types/FuseOptions'
export default function (
  { contracts, provider }: ENSArgs<'contracts' | 'provider'>,
  name: string,
  fusesToBurn: FuseOptions,
): Promise<ethers.ContractTransaction>
