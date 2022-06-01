import { ENSArgs } from '..'
export default function (
  { contracts, provider }: ENSArgs<'contracts' | 'provider'>,
  name: string,
  newController: string,
  newRegistrant?: string,
  options?: {
    addressOrIndex?: string | number
  },
): Promise<import('ethers').ContractTransaction>
