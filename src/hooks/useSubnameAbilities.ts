import { useMemo } from 'react'
import { useAccount } from 'wagmi'

import { useGetWrapperData } from './useGetWrapperData'
import { useHasSubnames } from './useHasSubnames'
import { useNameDetails } from './useNameDetails'

type OwnerData = ReturnType<typeof useNameDetails>['ownerData']

type ReturnData = {
  canDelete: boolean
  canDeleteContract?: 'registry' | 'nameWrapper'
  canDeleteError?: string
}

export const useSubnameAbilities = (name: string, ownerData: OwnerData): ReturnData => {
  const nameHasOwner = !!ownerData
  const nameParts = name?.split('.') || []

  const isSubname = nameParts.length > 2

  const { hasSubnames, isLoading: loadingSubnames } = useHasSubnames(name)

  const parentName = nameParts.slice(1).join('.')

  const {
    ownerData: parentOwnerData,
    isWrapped,
    isLoading: isNameDetailsLoading,
  } = useNameDetails(parentName)

  const { address } = useAccount()
  const canDeleteSubnames = parentOwnerData?.owner === address

  const skipFuseData = isNameDetailsLoading || !isWrapped
  const { wrapperData, isLoading: isFuseDataLoading } = useGetWrapperData(name, skipFuseData)

  return useMemo(() => {
    const abilities = {
      canDelete: false,
    }
    if (!isSubname || !nameHasOwner || isNameDetailsLoading || loadingSubnames) return abilities
    if (canDeleteSubnames && !isWrapped)
      return {
        canDelete: !hasSubnames,
        canDeleteContract: 'registry',
        canDeleteError: hasSubnames ? 'This name has subnames' : undefined,
      }
    if (isFuseDataLoading) return abilities
    if (canDeleteSubnames && isWrapped && wrapperData) {
      return {
        canDelete: !hasSubnames,
        canDeleteContract: 'nameWrapper',
        canDeleteError: hasSubnames ? 'This name has subnames' : undefined,
      }
    }
    return abilities
  }, [
    isSubname,
    nameHasOwner,
    isNameDetailsLoading,
    canDeleteSubnames,
    isWrapped,
    isFuseDataLoading,
    wrapperData,
    hasSubnames,
    loadingSubnames,
  ])
}
