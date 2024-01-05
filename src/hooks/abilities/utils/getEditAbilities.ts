import { P, match } from 'ts-pattern'

import type { useBasicName } from '@app/hooks/useBasicName'

import type { EditAbilities } from '../useAbilities'

type BasicName = ReturnType<typeof useBasicName>

const PATTERNS = {
  wrappedNameOwner: (address?: string) =>
    ({
      ownerData: {
        ownershipLevel: 'nameWrapper',
        owner: P.when((owner) => owner === address),
      },
      wrapperData: {
        child: P.select('fuses'),
      },
    } as const),
  unwrappedNameOwner: (address?: string) =>
    ({
      ownerData: {
        ownershipLevel: P.not('nameWrapper'),
        owner: P.when((owner) => owner === address),
      },
    } as const),
} as const

export const getEditAbilities = ({
  address,
  basicNameData,
  hasAuthorisedResolver,
}: {
  address?: string
  basicNameData: BasicName
  hasAuthorisedResolver?: boolean
}): EditAbilities => {
  return match(basicNameData)
    .with(PATTERNS.wrappedNameOwner(address), ({ fuses }) => {
      return {
        canEdit: true,
        canEditRecords: !!hasAuthorisedResolver,
        canEditResolver: !fuses.CANNOT_SET_RESOLVER,
        canEditPermissions: !fuses.CANNOT_BURN_FUSES,
        canCreateSubdomains: !fuses.CANNOT_CREATE_SUBDOMAIN,
        canEditTTL: !fuses.CANNOT_SET_TTL,
      }
    })
    .with(PATTERNS.unwrappedNameOwner(address), () => ({
      canEdit: true,
      canEditRecords: !!hasAuthorisedResolver,
      canEditResolver: true,
      canEditPermissions: false,
      canCreateSubdomains: true,
      canEditTTL: true,
    }))
    .otherwise(() => ({
      canEdit: false,
      canEditRecords: false,
      canEditResolver: false,
      canEditPermissions: false,
      canCreateSubdomains: false,
      canEditTTL: false,
    }))
}
