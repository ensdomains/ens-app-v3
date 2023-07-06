import { P, match } from 'ts-pattern'

import type { useBasicName } from '@app/hooks/useBasicName'

type BasicName = ReturnType<typeof useBasicName>

export const getReclaimAbilities = ({
  address,
  basicNameData,
  parentBasicNameData,
}: {
  address?: string
  basicNameData: BasicName
  parentBasicNameData: BasicName
}) => {
  return match([basicNameData, parentBasicNameData])
    .with(
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
      ],
      () => ({
        canReclaim: true,
      }),
    )
    .otherwise(() => ({
      canReclaim: false,
    }))
}
