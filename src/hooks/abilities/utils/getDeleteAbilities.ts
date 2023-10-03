import { TFunction } from 'i18next'
import { match, P } from 'ts-pattern'

import type { useBasicName } from '@app/hooks/useBasicName'
import { checkSubname } from '@app/utils/utils'

import type { DeleteAbilities } from '../useAbilities'

type BasicName = ReturnType<typeof useBasicName>

const DELETE_INFO = {
  emancipatedSubname: {
    owner: {
      pattern: (address?: string) =>
        [
          {
            ownerData: {
              ownershipLevel: 'nameWrapper',
              owner: P.when((owner) => owner === address),
            },
            wrapperData: {
              fuses: {
                parent: {
                  PARENT_CANNOT_CONTROL: true,
                },
                child: P.select('fuses'),
              },
            },
          },
          {
            ownerData: {
              owner: P.select('parentOwner'),
            },
          },
        ] as const,
    },
    parent: {
      // Emancipated subnames can not be controlled by their parents
    },
  },
  wrappedSubname: {
    owner: {
      pattern: (address?: string) =>
        [
          {
            ownerData: {
              ownershipLevel: 'nameWrapper',
              owner: P.when((owner) => owner === address),
            },
            wrapperData: {
              fuses: {
                parent: {
                  PARENT_CANNOT_CONTROL: false,
                },
              },
            },
          },
          {
            ownerData: {
              owner: P.select('parentOwner'),
            },
          },
        ] as const,
    },
    parent: {
      pattern: (address?: string) =>
        [
          {
            ownerData: {
              ownershipLevel: 'nameWrapper',
            },
            wrapperData: {
              fuses: {
                parent: {
                  PARENT_CANNOT_CONTROL: false,
                },
              },
            },
          },
          {
            ownerData: {
              ownershipLevel: P.select('parentOwnershipLevel'),
              owner: P.when((owner) => owner === address),
            },
          },
        ] as const,
    },
  },
  unwrappedSubname: {
    ownerOrParent: {
      pattern: [
        {
          ownerData: {
            ownershipLevel: P.not('nameWrapper'),
            owner: P.select('owner'),
          },
          pccExpired: P.select('pccExpired'),
        },
        {
          ownerData: {
            ownershipLevel: P.select('parentOwnershipLevel'),
            owner: P.select('parentOwner'),
          },
        },
      ],
      guard:
        (address?: string) =>
        ([subname, parent]: [BasicName, BasicName]) => {
          const subnameOwner = subname.ownerData?.owner
          const parentOwner = parent.ownerData?.owner
          return subnameOwner === address || parentOwner === address
        },
    },
  },
} as const

const BASE_ABILITIES: DeleteAbilities = {
  canDelete: false,
}

export const getDeleteAbilities = ({
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
}): DeleteAbilities => {
  if (!checkSubname(name)) return BASE_ABILITIES
  return match([basicNameData, parentBasicNameData])
    .with(
      DELETE_INFO.emancipatedSubname.owner.pattern(address),
      ({ fuses, parentOwner }) =>
        ({
          canDelete: !hasSubnames && !fuses.CANNOT_TRANSFER,
          canDeleteContract: 'nameWrapper' as const,
          canDeleteMethod: 'setRecord' as const,
          isPCCBurned: true,
          isParentOwner: parentOwner === address,
          ...(hasSubnames ? { canDeleteError: t('errors.hasSubnames') } : {}),
          ...(fuses.CANNOT_TRANSFER ? { canDeleteError: t('errors.permissionRevoked') } : {}),
        }) as DeleteAbilities,
    )
    .with(
      DELETE_INFO.wrappedSubname.owner.pattern(address),
      ({ parentOwner }) =>
        ({
          canDelete: !hasSubnames,
          canDeleteContract: 'nameWrapper' as const,
          canDeleteMethod: 'setRecord' as const,
          isParentOwner: parentOwner === address,
          isPCCBurned: false,
          ...(hasSubnames ? { canDeleteError: t('errors.hasSubnames') } : {}),
        }) as DeleteAbilities,
    )
    .with(
      DELETE_INFO.wrappedSubname.parent.pattern(address),
      ({ parentOwnershipLevel }) =>
        ({
          canDelete: !hasSubnames,
          canDeleteContract:
            parentOwnershipLevel === 'nameWrapper'
              ? ('nameWrapper' as const)
              : ('registry' as const),
          canDeleteMethod: 'setSubnodeOwner' as const,
          isParentOwner: true,
          isPCCBurned: false,
          ...(hasSubnames ? { canDeleteError: t('errors.hasSubnames') } : {}),
        }) as DeleteAbilities,
    )
    .with(
      DELETE_INFO.unwrappedSubname.ownerOrParent.pattern,
      DELETE_INFO.unwrappedSubname.ownerOrParent.guard(address),
      ({ pccExpired, owner, parentOwnershipLevel, parentOwner }) => {
        const isOwner = owner === address
        const isParentWrapped = parentOwnershipLevel === 'nameWrapper'
        const canDeleteRequiresWrap = !pccExpired && !isOwner && isParentWrapped
        return {
          canDelete: !hasSubnames && !pccExpired,
          canDeleteContract: canDeleteRequiresWrap
            ? ('nameWrapper' as const)
            : ('registry' as const),
          canDeleteRequiresWrap,
          canDeleteMethod: isOwner ? ('setRecord' as const) : ('setSubnodeOwner' as const),
          isParentOwner: parentOwner === address,
          canDeleteError: hasSubnames ? t('errors.hasSubnames') : undefined,
        } as DeleteAbilities
      },
    )
    .otherwise(() => BASE_ABILITIES)
}
