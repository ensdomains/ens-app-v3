import { P, match } from 'ts-pattern'

import type { useBasicName } from '@app/hooks/useBasicName'

type BasicName = ReturnType<typeof useBasicName>

export const getEditAbilities = ({
  address,
  basicNameData,
  hasAuthorisedResolver,
}: {
  address?: string
  basicNameData: BasicName
  hasAuthorisedResolver?: boolean
}) => {
  return match([basicNameData])
    .with(
      [
        {
          ownerData: {
            ownershipLevel: 'nameWrapper',
            owner: P.when((owner) => owner === address),
          },
          wrapperData: {
            child: P.select('fuses'),
          },
        },
      ],
      ({ fuses }) => {
        const canEditOrCanSetResolver = hasAuthorisedResolver || !fuses.CANNOT_SET_RESOLVER
        return {
          canEdit: true,
          canEditRecords: canEditOrCanSetResolver,
          canEditResolver: !fuses.CANNOT_SET_RESOLVER,
          canEditPermissions: !fuses.CANNOT_BURN_FUSES,
          canCreateSubdomains: !fuses.CANNOT_CREATE_SUBDOMAIN,
          canEditTTL: !fuses.CANNOT_SET_TTL,
        }
      },
    )
    .with(
      [
        {
          ownerData: {
            ownershipLevel: P.not('nameWrapper'),
            owner: P.when((owner) => owner === address),
          },
        },
      ],
      () => ({
        canEdit: true,
        canEditResolver: true,
        canEditPermissions: false,
        canCreateSubdomains: true,
        canEditTTL: true,
      }),
    )
    .otherwise(() => ({
      canEdit: false,
      canEditResolver: false,
      canEditPermissions: false,
      canCreateSubdomains: false,
      canEditTTL: false,
    }))
}