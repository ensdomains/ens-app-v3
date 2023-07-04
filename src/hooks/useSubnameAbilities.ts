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
  canDeleteRequiresWrap?: boolean
  isPCCBurned?: boolean
  isParentOwner?: boolean
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
    isParentWrapped,
    isParentOwner,
    hasSubnames,
    pccExpired,
    isOwner,
    isPCCBurned,
    isCannotTransferBurned,
    nameHasOwner,
  }: {
    isWrapped: boolean
    isParentWrapped: boolean
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
  // filter out any name with no owner, or if all owners are not the current address
  if (!nameHasOwner || (!isParentOwner && !isOwner)) return { canDelete: false }

  // all unwrapped names
  if (!isWrapped) {
    const canDeleteRequiresWrap = isParentWrapped && !pccExpired && !isOwner
    return {
      canDelete: !hasSubnames && !pccExpired,
      canDeleteContract: canDeleteRequiresWrap ? 'nameWrapper' : 'registry',
      canDeleteRequiresWrap,
      canDeleteMethod: isOwner ? 'setRecord' : 'setSubnodeOwner',
      isParentOwner,
      ...(hasSubnames ? { canDeleteError: t('errors.hasSubnames') } : {}),
    }
  }

  // all pcc burned names
  if (isPCCBurned) {
    if (!isOwner) return { canDelete: false }
    return {
      canDelete: !hasSubnames && !isCannotTransferBurned,
      canDeleteContract: 'nameWrapper',
      canDeleteMethod: 'setRecord',
      isPCCBurned,
      isParentOwner,
      ...(hasSubnames ? { canDeleteError: t('errors.hasSubnames') } : {}),
      ...(isCannotTransferBurned ? { canDeleteError: t('errors.permissionRevoked') } : {}),
    }
  }

  // all wrapped names, unburned PCC
  return {
    canDelete: !hasSubnames,
    canDeleteContract: isParentWrapped ? 'nameWrapper' : 'registry',
    canDeleteMethod: isOwner ? 'setRecord' : 'setSubnodeOwner',
    isParentOwner,
    isPCCBurned,
    ...(hasSubnames ? { canDeleteError: t('errors.hasSubnames') } : {}),
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
  } = useBasicName(parentName, { skipGraph: false })

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
          isParentWrapped,
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
