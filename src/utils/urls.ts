import { match } from 'ts-pattern'
import { Address } from 'viem'

import { getNetworkFromUrl } from '@app/constants/chains'

export const getL2PrimarySiteUrl = (nameOrAddress: string | Address) => {
  return match(getNetworkFromUrl())
    .with('sepolia', () => `https://sepolia.primary.ens.domains/${nameOrAddress}`)
    .otherwise(() => `https://primary.ens.domains/${nameOrAddress}`)
}
