import { useMemo } from 'react'
import { Address } from 'viem'

import {
  getPrimaryDisplayName,
  hasValidPrimaryName,
} from '@app/hooks/ensjs/public/primaryNameUtils'
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
    const displayName = hasValidPrimaryName(primaryData)
      ? getPrimaryDisplayName(primaryData)
      : undefined

    return {
      nameOrAddr: displayName ?? shortenedAddress,
      type: displayName ? 'name' : 'address',
    }
  }, [primaryData, shortenedAddress])

  return {
    data,
    ...rest,
  }
}
