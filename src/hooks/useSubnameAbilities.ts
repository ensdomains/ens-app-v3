import { useMemo } from 'react'
import { useAccount, useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'

import { useGetWrapperData } from './useGetWrapperData'
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

  const { getSubnames, ready } = useEns()
  const { data: hasChildren, isLoading: loadingSubnames } = useQuery(
    ['get-subnames', name],
    async () => {
      const result = await getSubnames({ name, pageSize: 1 })
      return result.subnames.length > 0
    },
    {
      enabled: ready && !!name && isSubname,
      refetchOnMount: true,
    },
  )

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
        canDelete: !hasChildren,
        canDeleteContract: 'registry',
        canDeleteError: hasChildren ? 'This name has subnames' : undefined,
      }
    if (isFuseDataLoading) return abilities
    if (canDeleteSubnames && isWrapped && wrapperData) {
      return {
        canDelete: !hasChildren,
        canDeleteContract: 'nameWrapper',
        canDeleteError: hasChildren ? 'This name has subnames' : undefined,
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
    hasChildren,
    loadingSubnames,
  ])
}
