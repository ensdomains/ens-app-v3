import { TFunction } from 'i18next'
import { P, match } from 'ts-pattern'

import type { useBasicName } from '@app/hooks/useBasicName'
import { checkSubname } from '@app/utils/utils'

type BasicName = ReturnType<typeof useBasicName>

type Result = {
  canDelete: boolean
  canDeleteContract?: 'nameWrapper' | 'registry'
  canDeleteRequiresWrap?: boolean
  canDeleteMethod?: 'setRecord' | 'setSubnodeOwner'
  isPCCBurned?: boolean
  isParentOwner?: boolean
  canDeleteError?: string
}

const BASE_ABILITIES: Result = {
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
}): Result => {
  if (!checkSubname(name)) return BASE_ABILITIES
  return (
    match([basicNameData, parentBasicNameData])
      /* --------------- WRAPPED WITH PCC BURNED --------------- */
      /*
       * WRAPPED NAME OWNER
       * */
      .with(
        [
          {
            ownerData: {
              ownershipLevel: 'nameWrapper',
              owner: P.when((owner) => owner === address),
            },
            wrapperData: {
              parent: {
                PARENT_CANNOT_CONTROL: true,
              },
              child: P.select('fuses'),
            },
          },
          {
            ownerData: {
              owner: P.select('parentOwner'),
            },
          },
        ],
        ({ fuses, parentOwner }) => ({
          ...BASE_ABILITIES,
          canDelete: !hasSubnames && !fuses?.CANNOT_TRANSFER,
          canDeleteContract: 'nameWrapper' as const,
          canDeleteMethod: 'setRecord' as const,
          isPCCBurned: true,
          isParentOwner: parentOwner === address,
          ...(hasSubnames ? { canDeleteError: t('errors.hasSubnames') } : {}),
          ...(fuses.CANNOT_TRANSFER ? { canDeleteError: t('errors.permissionRevoked') } : {}),
        }),
      )
      /* --------------- WRAPPED WITH PCC NOT BURNED ---------------- */
      // WRAPPED NAME OWNER
      .with(
        [
          {
            ownerData: {
              ownershipLevel: 'nameWrapper',
              owner: P.when((owner) => owner === address),
            },
            wrapperData: {
              parent: {
                PARENT_CANNOT_CONTROL: P.not(true),
              },
            },
          },
          {
            ownerData: {
              ownershipLevel: P.select('parentOwnershipLevel'),
              owner: P.select('parentOwner'),
            },
          },
        ],
        ({ parentOwner }) => ({
          ...BASE_ABILITIES,
          canDelete: !hasSubnames,
          canDeleteContract: 'nameWrapper' as const,
          canDeleteMethod: 'setRecord' as const,
          isParentOwner: parentOwner === address,
          isPCCBurned: false,
          ...(hasSubnames ? { canDeleteError: t('errors.hasSubnames') } : {}),
        }),
      )
      // WRAPPED NAME PARENT OWNER
      .with(
        [
          {
            ownerData: {
              ownershipLevel: 'nameWrapper',
            },
            wrapperData: {
              parent: {
                PARENT_CANNOT_CONTROL: P.not(true),
              },
            },
          },
          {
            ownerData: {
              ownershipLevel: P.select('parentOwnershipLevel'),
              owner: P.when((owner) => owner === address),
            },
          },
        ],
        ({ parentOwnershipLevel }) => ({
          ...BASE_ABILITIES,
          canDelete: !hasSubnames,
          canDeleteContract:
            parentOwnershipLevel === 'nameWrapper'
              ? ('nameWrapper' as const)
              : ('registry' as const),
          canDeleteMethod: 'setSubnodeOwner' as const,
          isParentOwner: true,
          isPCCBurned: false,
          ...(hasSubnames ? { canDeleteError: t('errors.hasSubnames') } : {}),
        }),
      )
      /* --------------- UNWRAPPED ----------------- */
      .with(
        [
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
        ([
          {
            ownerData: { owner },
          },
          {
            ownerData: { owner: parentOwner },
          },
        ]) => owner === address || parentOwner === address,
        ({ pccExpired, owner, parentOwnershipLevel, parentOwner }) => {
          const isOwner = owner === address
          const isParentWrapped = parentOwnershipLevel === 'nameWrapper'
          const canDeleteRequiresWrap = !pccExpired && !isOwner && isParentWrapped
          return {
            ...BASE_ABILITIES,
            canDelete: !hasSubnames && !pccExpired,
            canDeleteContract: canDeleteRequiresWrap
              ? ('nameWrapper' as const)
              : ('registry' as const),
            canDeleteRequiresWrap,
            canDeleteMethod: isOwner ? ('setRecord' as const) : ('setSubnodeOwner' as const),
            isParentOwner: parentOwner === address,
            canDeleteError: hasSubnames ? t('errors.hasSubnames') : undefined,
          }
        },
      )
      .otherwise(() => BASE_ABILITIES)
  )
}
