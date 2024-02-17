import { useMemo } from 'react'

import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

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
    return !!(
      ownerData?.ownershipLevel === 'registry' &&
      ownerData?.owner === nameWrapperAddress &&
      !wrapperData
    )
  }, [ownerData, wrapperData, nameWrapperAddress])
}
