import { TFunction } from 'i18next'
import { P, match } from 'ts-pattern'

import type { useBasicName } from '@app/hooks/useBasicName'

type BasicName = ReturnType<typeof useBasicName>

export const getDeleteSubnameAbilities = ({
  name,
  address,
  basicNameData,
  parentBasicNameData,
  hasSubnames,
  t,
}: {
  name: string
  address?: string
  basicNameData: BasicName
  parentBasicNameData: BasicName
  hasSubnames: boolean
  t: TFunction
}) => {
  return match([basicNameData, parentBasicNameData])
    .with([{ ownerData: P.nullish }, P._], () => ({
      canDelete: false,
    }))
    .with(
      [
        {
          ownerData: {
            ownershipLevel: P.not('nameWrapper'),
          },
          pccExpired: false,
        },
        {
          ownerData: {
            owner: P.when((owner) => owner === address),
          },
        },
      ],
      () => ({
        canDelete: !hasSubnames,
        canDeleteContract: 'registry',
        canDeleteError: hasSubnames ? t('errors.hasSubnames') : undefined,
      }),
    )
}
