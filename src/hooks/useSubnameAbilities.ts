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

type Abilities = {
  canDelete: boolean
  canDeleteContract?: 'registry' | 'nameWrapper'
  canDeleteMethod?: 'setRecord' | 'setSubnodeOwner'
  canDeleteError?: string
  isPCCBurned?: boolean
}

type ReturnData = {
  abilities: Abilities
  isLoading: boolean
  isCachedData: boolean
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
    const abilities: Abilities = {
      canDelete: false,
    }
    if (!isSubname || !nameHasOwner || parentLoading || loadingSubnames) return abilities
    if (!isWrapped && isParentOwner)
      return {
        canDelete: !hasSubnames && !pccExpired,
        canDeleteContract: 'registry',
        canDeleteError: hasSubnames ? t('errors.hasSubnames') : undefined,
      } as Abilities
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
      } as Abilities
      /* eslint-enable no-nested-ternary */
    }
    if (isWrapped && !isPCCBurned && isParentOwner) {
      return {
        canDelete: !hasSubnames,
        canDeleteContract: 'nameWrapper',
        canDeleteMethod: 'setSubnodeOwner',
        ...(hasSubnames ? { canDeleteError: t('errors.hasSubnames') } : {}),
      } as Abilities
    }
    if (isWrapped && !isPCCBurned && isOwner) {
      return {
        canDelete: !hasSubnames,
        canDeleteContract: 'nameWrapper',
        canDeleteMethod: 'setRecord',
        ...(hasSubnames ? { canDeleteError: t('errors.hasSubnames') } : {}),
      } as Abilities
    }
    return abilities
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
  ])

  return {
    abilities: subnameAbilities,
    isLoading: parentLoading || loadingSubnames,
    isCachedData: parentCachedData || subnamesCachedData,
  }
}
