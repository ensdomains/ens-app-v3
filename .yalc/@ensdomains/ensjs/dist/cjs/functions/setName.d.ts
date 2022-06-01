import { ENSArgs } from '..'
export default function (
  { contracts, provider }: ENSArgs<'contracts' | 'provider'>,
  name: string,
  address?: string,
  resolver?: string,
  options?: {
    addressOrIndex?: string | number
  },
): Promise<import('ethers').ContractTransaction | undefined>
