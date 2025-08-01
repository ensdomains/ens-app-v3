import { match } from 'ts-pattern'
import { Address } from 'viem'
import { holesky, sepolia } from 'viem/chains'

import { getChainsFromUrl } from '@app/constants/chains'

export const getL2PrimarySiteUrl = (nameOrAddress: string | Address) => {
  const chain = getChainsFromUrl()
  return match(chain[0])
    .with(
      {
        id: sepolia.id,
      },
      () => `https://sepolia.primary.ens.domains/${nameOrAddress}`,
    )
    .with(
      {
        id: holesky.id,
      },
      () => `https://holesky.primary.ens.domains/${nameOrAddress}`,
    )
    .otherwise(() => `https://primary.ens.domains/${nameOrAddress}`)
}
