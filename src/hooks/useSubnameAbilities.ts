import { useMemo } from 'react'

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
  const nameHasOwner = !!ownerData
  const nameParts = name?.split('.') || []

  const isSubname = nameParts.length > 2

  const {
    hasSubnames,
    isLoading: loadingSubnames,
    isCachedData: subnamesCachedData,
  } = useHasSubnames(name)

  const parentName = nameParts.slice(1).join('.')

  const {
    ownerData: parentOwnerData,
    isWrapped,
    isLoading: parentLoading,
    isCachedData: parentCachedData,
  } = useBasicName(parentName)

  const canDeleteSubnames = parentOwnerData?.owner === address

  const subnameAbilities = useMemo(() => {
    const abilities = {
      canDelete: false,
    }
    if (!isSubname || !nameHasOwner || parentLoading || loadingSubnames) return abilities
    if (canDeleteSubnames && !isWrapped)
      return {
        canDelete: !hasSubnames,
        canDeleteContract: 'registry',
        canDeleteError: hasSubnames ? 'This name has subnames' : undefined,
      } as const
    if (canDeleteSubnames && isWrapped && wrapperData) {
      return {
        canDelete: !hasSubnames,
        canDeleteContract: 'nameWrapper',
        canDeleteError: hasSubnames ? 'This name has subnames' : undefined,
      } as const
    }
    return abilities
  }, [
    isSubname,
    nameHasOwner,
    parentLoading,
    canDeleteSubnames,
    isWrapped,
    wrapperData,
    hasSubnames,
    loadingSubnames,
  ])

  return {
    abilities: subnameAbilities,
    isLoading: parentLoading || loadingSubnames,
    isCachedData: parentCachedData || subnamesCachedData,
  }
}
