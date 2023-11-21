import { useMemo } from 'react'
import { Address } from 'viem'

import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'

import { shortenAddress } from '../../utils/utils'

type UsePrimaryNameOrAddressParameters = {
  address: Address
  shortenedAddressLength?: number
  enabled?: boolean
}

export const usePrimaryNameOrAddress = ({
  address,
  shortenedAddressLength = 4,
  enabled = true,
}: UsePrimaryNameOrAddressParameters) => {
  const { data: primaryData, ...rest } = usePrimaryName({ address, enabled })
  const shortenedAddress = shortenAddress(address, shortenedAddressLength)
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
