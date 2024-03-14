import { match, P } from 'ts-pattern'
import { Address } from 'viem'

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
        fuses: {
          child: P.select('fuses'),
        },
      },
    }) as const,
  unwrappedNameOwner: (address?: string) =>
    ({
      ownerData: {
        ownershipLevel: P.not('nameWrapper'),
        owner: P.when((owner) => owner === address),
      },
    }) as const,
  gracePeriodWrappedNameOwner: ({
    address,
    nameWrapperAddress,
  }: {
    address?: string
    nameWrapperAddress: Address
  }) =>
    ({
      ownerData: {
        ownershipLevel: 'registrar',
        owner: P.when((owner) => owner === nameWrapperAddress),
      },
      wrapperData: {
        owner: P.when((owner) => owner === address),
      },
      registrationStatus: 'gracePeriod',
    }) as const,
} as const

export const getEditAbilities = ({
  address,
  basicNameData,
  hasAuthorisedResolver,
  nameWrapperAddress,
}: {
  address?: string
  basicNameData: BasicName
  hasAuthorisedResolver?: boolean
  nameWrapperAddress: Address
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
        canCreateSubdomainsError: fuses.CANNOT_CREATE_SUBDOMAIN ? 'permissionRevoked' : undefined,
        canEditResolverError: fuses.CANNOT_SET_RESOLVER ? 'permissionRevoked' : undefined,
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
    .with(PATTERNS.gracePeriodWrappedNameOwner({ address, nameWrapperAddress }), () => ({
      canEdit: true,
      canEditRecords: true,
      canEditResolver: false,
      canEditPermissions: false,
      canCreateSubdomains: false,
      canEditTTL: false,
      canCreateSubdomainsError: 'gracePeriod',
      canEditResolverError: 'gracePeriod',
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
