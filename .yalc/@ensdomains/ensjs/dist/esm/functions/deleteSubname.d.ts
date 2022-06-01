import { ENSArgs } from '..'
export default function (
  {
    contracts,
    provider,
    transferSubname,
  }: ENSArgs<'contracts' | 'provider' | 'transferSubname'>,
  name: string,
  contract: 'registry' | 'nameWrapper',
  options?: {
    addressOrIndex?: string | number
  },
): Promise<import('ethers').ContractTransaction>
