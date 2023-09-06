import { useMemo } from 'react'

import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

import { safeDateObj } from '@app/utils/date'

import { useContractAddress } from '../chain/useContractAddress'

export const usePccExpired = ({
  ownerData,
  wrapperData,
}: {
  ownerData: GetOwnerReturnType | undefined
  wrapperData: GetWrapperDataReturnType | undefined
}) => {
  const nameWrapperAddress = useContractAddress({ contract: 'ensNameWrapper' })
  return useMemo(() => {
    const wrappedExpiry = safeDateObj(wrapperData?.expiry?.date)
    return !!(
      ownerData?.ownershipLevel === 'registry' &&
      ownerData?.owner === nameWrapperAddress &&
      wrappedExpiry &&
      wrappedExpiry < new Date()
    )
  }, [ownerData, wrapperData, nameWrapperAddress])
}
