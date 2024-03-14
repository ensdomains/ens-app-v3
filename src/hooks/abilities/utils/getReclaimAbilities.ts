import { match, P } from 'ts-pattern'

import type { useBasicName } from '@app/hooks/useBasicName'

import type { ReclaimAbilities } from '../useAbilities'

type BasicName = ReturnType<typeof useBasicName>

const RECLAIM_INFO = {
  expiredWrappedSubname: {
    pattern: (address?: string) =>
      [
        {
          pccExpired: true,
        },
        {
          ownerData: {
            ownershipLevel: 'nameWrapper',
            owner: P.when((owner) => owner === address),
          },
        },
      ] as const,
  },
} as const

export const getReclaimAbilities = ({
  address,
  basicNameData,
  parentBasicNameData,
}: {
  address?: string
  basicNameData: BasicName
  parentBasicNameData: BasicName
}): ReclaimAbilities => {
  return match([basicNameData, parentBasicNameData])
    .with(RECLAIM_INFO.expiredWrappedSubname.pattern(address), () => ({
      canReclaim: true,
    }))
    .otherwise(() => ({
      canReclaim: false,
    }))
}
