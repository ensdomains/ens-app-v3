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
}

type ReturnData = {
  abilities: {
    canDelete: boolean
    canDeleteContract?: 'registry' | 'nameWrapper'
    canDeleteError?: string
  }
  isLoading: boolean
  isCachedData: boolean
}

export const useSubnameAbilities = ({
  name,
  address,
  ownerData,
  wrapperData,
}: Props): ReturnData => {
  const { t } = useTranslation('profile')

  const nameHasOwner = !!ownerData
  const nameParts = name?.split('.') || []
  const parentName = nameParts.slice(1).join('.')

  const isSubname = nameParts.length > 2

  const {
    hasSubnames,
    isLoading: loadingSubnames,
    isCachedData: subnamesCachedData,
  } = useHasSubnames(name)

  const {
    ownerData: parentOwnerData,
    isLoading: parentLoading,
    isCachedData: parentCachedData,
  } = useBasicName(parentName)

  const isParentOwner = parentOwnerData?.owner === address
  const isOwner = ownerData?.owner === address
  const isWrapped = ownerData?.ownershipLevel === 'nameWrapper'
  const isPCCBurned = wrapperData?.parent.PARENT_CANNOT_CONTROL
  const isCannotTransferBurned = wrapperData?.child.CANNOT_TRANSFER

  const subnameAbilities = useMemo(() => {
    const abilities = {
      canDelete: false,
    }
    if (!isSubname || !nameHasOwner || parentLoading || loadingSubnames) return abilities
    if (!isWrapped && isParentOwner)
      return {
        canDelete: !hasSubnames,
        canDeleteContract: 'registry',
        canDeleteError: hasSubnames ? t('errors.hasSubnames') : undefined,
      } as const
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
      } as const
      /* eslint-enable no-nested-ternary */
    }
    if (isWrapped && !isPCCBurned && isParentOwner) {
      return {
        canDelete: !hasSubnames,
        canDeleteContract: 'nameWrapper',
        canDeleteError: hasSubnames ? t('errors.hasSubnames') : undefined,
      } as const
    }
    return abilities
  }, [
    isSubname,
    nameHasOwner,
    parentLoading,
    isWrapped,
    hasSubnames,
    loadingSubnames,
    isOwner,
    isParentOwner,
    isPCCBurned,
    t,
  ])

  return {
    abilities: subnameAbilities,
    isLoading: parentLoading || loadingSubnames,
    isCachedData: parentCachedData || subnamesCachedData,
  }
}
