import { BigNumber } from 'ethers'

import type { ReturnedENS } from '@app/types/index'

import { emptyAddress } from './constants'
import { checkETH2LDName, checkETHName } from './utils'

export type RegistrationStatus =
  | 'invalid'
  | 'registered'
  | 'gracePeriod'
  | 'premium'
  | 'available'
  | 'short'
  | 'notImported'
  | 'notOwned'
  | 'unsupportedTLD'

export const getRegistrationStatus = ({
  name,
  ownerData,
  wrapperData,
  expiryData,
  priceData,
  supportedTLD,
}: {
  name: string | null
  ownerData?: ReturnedENS['getOwner']
  wrapperData?: ReturnedENS['getWrapperData']
  expiryData?: ReturnedENS['getExpiry']
  priceData?: ReturnedENS['getPrice']
  supportedTLD?: boolean
}): RegistrationStatus => {
  const labels = name?.split('.') || []
  const isDotETH = checkETHName(labels)
  const isDotEth2ld = checkETH2LDName(isDotETH, labels, true)

  if (isDotEth2ld && labels[0].length < 3) {
    return 'short'
  }

  if (!ownerData && !wrapperData) return 'invalid'

  if (!isDotETH && !supportedTLD) {
    return 'unsupportedTLD'
  }

  if (isDotEth2ld) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    if (expiryData && expiryData.expiry) {
      const { expiry: _expiry, gracePeriod } = expiryData as {
        expiry: Date | string
        gracePeriod: number
      }
      const expiry = new Date(_expiry)
      if (expiry.getTime() > Date.now()) {
        return 'registered'
      }
      if (expiry.getTime() + gracePeriod > Date.now()) {
        return 'gracePeriod'
      }
      const { premium } = priceData as {
        base: BigNumber
        premium: BigNumber
      }
      if (premium.gt(0)) {
        return 'premium'
      }
    }
    return 'available'
  }
  if (ownerData && ownerData.owner !== emptyAddress) {
    return 'registered'
  }
  if (labels.length > 2) {
    return 'notOwned'
  }
  return 'notImported'
}
