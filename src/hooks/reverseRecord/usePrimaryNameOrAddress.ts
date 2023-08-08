import { useMemo } from 'react'

import { usePrimary } from '@app/hooks/usePrimary'

import { shortenAddress } from '../../utils/utils'

export const usePrimaryNameOrAddress = (address: string, length = 4) => {
  const { data: primaryData, ...rest } = usePrimary(address)
  const shortenedAddress = shortenAddress(address, length)
  const data = useMemo(() => {
    return {
      nameOrAddr: primaryData?.name ?? shortenedAddress,
      type: primaryData?.name ? 'name' : 'address',
    }
  }, [primaryData, shortenedAddress])

  return {
    data,
    ...rest,
  }
}
