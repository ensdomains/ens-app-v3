import { useMemo } from 'react'

import { useContractAddress } from '../chain/useContractAddress'
import { useBasicName } from '../useBasicName'
import { getNameType, NameType } from './getNameType'

type Options = {
  enabled?: boolean
}

export const useNameType = (name: string, options: Options = {}) => {
  const enabled = options.enabled ?? true

  const basicName = useBasicName({ name, enabled })
  const nameWrapperAddress = useContractAddress({ contract: 'ensNameWrapper' })

  const { isLoading, isCachedData } = basicName

  const data: NameType | undefined = useMemo(() => {
    if (isLoading) return undefined
    return getNameType({
      name,
      ownerData: basicName.ownerData!,
      wrapperData: basicName.wrapperData!,
      pccExpired: basicName.pccExpired,
      registrationStatus: basicName.registrationStatus,
      nameWrapperAddress,
    })
  }, [
    isLoading,
    name,
    basicName.ownerData,
    basicName.wrapperData,
    basicName.pccExpired,
    basicName.registrationStatus,
    nameWrapperAddress,
  ])

  return {
    data,
    isLoading,
    isCachedData,
  }
}
