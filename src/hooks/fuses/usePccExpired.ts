import { useMemo } from 'react'

import { ReturnedENS } from '@app/types'
import { safeDateObj } from '@app/utils/date'

import { useContractAddress } from '../useContractAddress'

export const usePccExpired = ({
  ownerData,
  wrapperData,
}: {
  ownerData: ReturnedENS['getOwner'] | null
  wrapperData: ReturnedENS['getWrapperData'] | null
}) => {
  const nameWrapperAddress = useContractAddress('NameWrapper')
  return useMemo(() => {
    const wrappedExpiry = safeDateObj(wrapperData?.expiryDate)
    return !!(
      ownerData?.ownershipLevel === 'registry' &&
      ownerData?.owner === nameWrapperAddress &&
      wrappedExpiry &&
      wrappedExpiry < new Date()
    )
  }, [ownerData, wrapperData, nameWrapperAddress])
}
