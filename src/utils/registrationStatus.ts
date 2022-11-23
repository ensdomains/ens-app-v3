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

type BatchResult =
  | [...any[], ReturnedENS['getExpiry'], ReturnedENS['getPrice']]
  | [...any[], ReturnedENS['getOwner']]
  | undefined

export const getRegistrationStatus = (
  batchResults: any[] | undefined,
  name: string | null,
): RegistrationStatus => {
  const _batchResults = batchResults as BatchResult
  const labels = name?.split('.') || []
  const isDotETH = checkETHName(labels)
  const isDotEth2ld = checkETH2LDName(isDotETH, labels, true)
  if (isDotEth2ld && labels[0].length < 3) {
    return 'short'
  }
  if (!_batchResults) {
    return 'invalid'
  }
  const resLength = _batchResults?.length
  if (isDotEth2ld) {
    if (!resLength) return 'invalid'
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const expiryData = _batchResults[resLength - 2]
    const priceData = _batchResults[resLength - 1]
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
  const owner = _batchResults ? _batchResults[(resLength as number) - 1] : undefined
  if (owner && owner.owner !== emptyAddress) {
    return 'registered'
  }
  if (labels.length > 2) {
    return 'notOwned'
  }
  return 'notImported'
}
