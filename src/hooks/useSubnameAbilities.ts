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

  const subnameAbilities = useMemo(() => {
    const abilities: Abilities = {
      canDelete: false,
    }
    if (!isSubname || !nameHasOwner || parentLoading || loadingSubnames) return abilities
    if (!isWrapped && isParentOwner)
      return {
        canDelete: !hasSubnames,
        canDeleteContract: 'registry',
        canDeleteError: hasSubnames ? t('errors.hasSubnames') : undefined,
      } as Abilities
    if (isWrapped && isPCCBurned && isOwner) {
      return {
        canDelete: !hasSubnames,
        canDeleteContract: 'nameWrapper',
        canDeleteMethod: 'setRecord',
        isPCCBurned,
        ...(hasSubnames ? { canDeleteError: t('errors.hasSubnames') } : {}),
      } as Abilities
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
