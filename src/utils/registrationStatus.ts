import { BigNumber } from 'ethers'

import type { PublicENS, ReturnedENS } from '@app/types/index'

import { emptyAddress } from './constants'
import { yearsToSeconds } from './utils'

export type RegistrationStatus =
  | 'invalid'
  | 'registered'
  | 'gracePeriod'
  | 'premium'
  | 'available'
  | 'short'
  | 'notImported'
  | 'notOwned'

const start = (name: string) => {
  const labels = name.split('.')
  const isDotETH = labels[labels.length - 1] === 'eth'
  return {
    labels,
    isDotETH,
  }
}

const is2ldEth = (isDotEth: boolean, labels: string[], requireValid?: boolean) =>
  isDotEth && labels.length === 2 && (requireValid ? labels[0].length >= 3 : true)

export const addRegistrationStatusToBatch = (ens: PublicENS, name: string) => {
  const { getExpiry, getPrice, getOwner } = ens
  const { labels, isDotETH } = start(name)
  if (is2ldEth(isDotETH, labels, true)) {
    if (labels[0].length < 3) {
      return []
    }
    return [getExpiry.batch(name), getPrice.batch(labels[0], yearsToSeconds(1), false)]
  }
  return [getOwner.batch(name, 'registry')]
}

type BatchResult =
  | [...any[], ReturnedENS['getExpiry'], ReturnedENS['getPrice']]
  | [...any[], ReturnedENS['getOwner']]
  | undefined

export const getRegistrationStatus = (
  batchResults: any[] | undefined,
  name: string,
): RegistrationStatus => {
  const _batchResults = batchResults as BatchResult
  const { labels, isDotETH } = start(name)
  const isDotEth2ld = is2ldEth(isDotETH, labels, false)
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
