import { TFunction } from 'i18next'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ReturnedENS } from '@app/types'

import { useBasicName } from './useBasicName'
import { useHasSubnames } from './useHasSubnames'

type Props = {
  name: string
  address: string | undefined
  ownerData: ReturnedENS['getOwner']
  wrapperData: ReturnedENS['getWrapperData']
  pccExpired: boolean
}

type DeleteAbilities = {
  canDelete: boolean
  canDeleteContract?: 'registry' | 'nameWrapper'
  canDeleteMethod?: 'setRecord' | 'setSubnodeOwner'
  canDeleteError?: string
  isPCCBurned?: boolean
}

type ReclaimAbilities = {
  canReclaim: boolean
}

type Abilities = DeleteAbilities & ReclaimAbilities

type ReturnData = {
  abilities: Abilities
  isLoading: boolean
  isCachedData: boolean
}

const getCanDeleteAbilities = (
  {
    isWrapped,
    isParentOwner,
    hasSubnames,
    pccExpired,
    isOwner,
    isPCCBurned,
    isCannotTransferBurned,
    nameHasOwner,
  }: {
    isWrapped: boolean
    isParentOwner: boolean
    hasSubnames: boolean
    pccExpired: boolean
    isOwner: boolean
    isPCCBurned: boolean
    isCannotTransferBurned: boolean
    nameHasOwner: boolean
  },
  t: TFunction,
): DeleteAbilities => {
  if (!nameHasOwner) return { canDelete: false }
  if (!isWrapped && isParentOwner)
    return {
      canDelete: !hasSubnames && !pccExpired,
      canDeleteContract: 'registry',
      canDeleteError: hasSubnames ? t('errors.hasSubnames') : undefined,
    }
  if (isWrapped && isPCCBurned && isOwner) {
    /* eslint-disable no-nested-ternary */
    return {
      canDelete: !hasSubnames && !isCannotTransferBurned,
      canDeleteContract: 'nameWrapper',
      canDeleteError: isCannotTransferBurned
        ? 'permissionRevoked'
        : hasSubnames
        ? t('errors.hasSubnames')
        : undefined,
      canDeleteMethod: 'setRecord',
      isPCCBurned,
      ...(hasSubnames ? { canDeleteError: t('errors.hasSubnames') } : {}),
    }
    /* eslint-enable no-nested-ternary */
  }
  if (isWrapped && !isPCCBurned && isParentOwner) {
    return {
      canDelete: !hasSubnames,
      canDeleteContract: 'nameWrapper',
      canDeleteMethod: 'setSubnodeOwner',
      ...(hasSubnames ? { canDeleteError: t('errors.hasSubnames') } : {}),
    }
  }
  if (isWrapped && !isPCCBurned && isOwner) {
    return {
      canDelete: !hasSubnames,
      canDeleteContract: 'nameWrapper',
      canDeleteMethod: 'setRecord',
      ...(hasSubnames ? { canDeleteError: t('errors.hasSubnames') } : {}),
    }
  }
  return {
    canDelete: false,
  }
}

const getCanReclaimAbilities = ({
  isParentOwner,
  isParentWrapped,
  pccExpired,
}: {
  isParentOwner: boolean
  isParentWrapped: boolean
  pccExpired: boolean
}): ReclaimAbilities => {
  return {
    canReclaim: isParentOwner && isParentWrapped && pccExpired,
  }
}

export const useSubnameAbilities = ({
  name,
  address,
  ownerData,
  wrapperData,
  pccExpired,
}: Props): ReturnData => {
  const { t } = useTranslation('profile')

  const nameHasOwner = !!ownerData
  const nameParts = name?.split('.') || []
  const parentName = nameParts.slice(1).join('.')

  const isSubname = nameParts.length > 2

  const {
    hasSubnames = false,
    isLoading: loadingSubnames,
    isCachedData: subnamesCachedData,
  } = useHasSubnames(name)

  const {
    ownerData: parentOwnerData,
    isLoading: parentLoading,
    isCachedData: parentCachedData,
  } = useBasicName(parentName)

  const isOwner = ownerData?.owner === address
  const isParentOwner = parentOwnerData?.owner === address
  const isWrapped = ownerData?.ownershipLevel === 'nameWrapper'
  const isParentWrapped = parentOwnerData?.ownershipLevel === 'nameWrapper'
  const isPCCBurned = !!wrapperData?.parent.PARENT_CANNOT_CONTROL
  const isCannotTransferBurned = !!wrapperData?.child.CANNOT_TRANSFER

  const subnameAbilities = useMemo(() => {
    if (!isSubname || parentLoading || loadingSubnames)
      return {
        canDelete: false,
        canReclaim: false,
      }

    return {
      ...getCanDeleteAbilities(
        {
          isWrapped,
          isParentOwner,
          hasSubnames,
          pccExpired,
          isOwner,
          isPCCBurned,
          isCannotTransferBurned,
          nameHasOwner,
        },
        t,
      ),
      ...getCanReclaimAbilities({
        isParentOwner,
        isParentWrapped,
        pccExpired,
      }),
    }
  }, [
    isSubname,
    nameHasOwner,
    parentLoading,
    loadingSubnames,
    isWrapped,
    isParentOwner,
    hasSubnames,
    pccExpired,
    t,
    isPCCBurned,
    isOwner,
    isCannotTransferBurned,
    isParentWrapped,
  ])

  return {
    abilities: subnameAbilities,
    isLoading: parentLoading || loadingSubnames,
    isCachedData: parentCachedData || subnamesCachedData,
  }
}
