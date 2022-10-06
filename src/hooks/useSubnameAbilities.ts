import { useMemo } from 'react'
import { useAccount } from 'wagmi'

import { useGetWrapperData } from './useGetWrapperData'
import { useNameDetails } from './useNameDetails'
import { useSelfAbilities } from './useSelfAbilities'

type OwnerData = ReturnType<typeof useNameDetails>['ownerData']

type ReturnData = {
  canDelete: boolean
  canDeleteContract?: 'registry' | 'nameWrapper'
}

export const useSubnameAbilities = (name: string, ownerData: OwnerData): ReturnData => {
  const nameHasOwner = !!ownerData
  const nameParts = name?.split('.') || []
  const isValid2LD = nameParts.length === 3 && nameParts[2] === 'eth'

  const baseName = nameParts.slice(-2).join('.')

  const {
    ownerData: baseOwnerData,
    isWrapped,
    isLoading: isNameDetailsLoading,
  } = useNameDetails(baseName)

  const { address } = useAccount()
  const baseSelfAbilities = useSelfAbilities(address, baseOwnerData)

  const skipFuseData = isNameDetailsLoading || !isWrapped
  const { wrapperData, isLoading: isFuseDataLoading } = useGetWrapperData(name, skipFuseData)

  return useMemo(() => {
    const abilities = {
      canDelete: false,
    }
    if (!nameHasOwner || isNameDetailsLoading || !isValid2LD) return abilities
    if (baseSelfAbilities.canEdit && !isWrapped)
      return {
        canDelete: true,
        canDeleteContract: 'registry',
      }
    if (isFuseDataLoading) return abilities
    if (isWrapped && baseSelfAbilities.canEdit && wrapperData) {
      return {
        canDelete:
          !wrapperData.fuseObj.CANNOT_TRANSFER &&
          !wrapperData.fuseObj.CANNOT_SET_RESOLVER &&
          !wrapperData.fuseObj.PARENT_CANNOT_CONTROL,
        canDeleteContract: 'nameWrapper',
      }
    }
    return abilities
  }, [
    nameHasOwner,
    isNameDetailsLoading,
    isValid2LD,
    baseSelfAbilities.canEdit,
    isWrapped,
    isFuseDataLoading,
    wrapperData,
  ])
}
