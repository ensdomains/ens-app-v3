import {
  GetAddressRecordReturnType,
  GetExpiryReturnType,
  GetOwnerReturnType,
  GetPriceReturnType,
  GetWrapperDataReturnType,
} from '@ensdomains/ensjs/public'
import { ParsedInputResult } from '@ensdomains/ensjs/utils'

import { getChainsFromUrl } from '@app/constants/chains'

import { emptyAddress } from './constants'

/**
 * Checks if a wrapped name is out of sync by comparing expiry timestamps.
 * A synced wrapped name has: wrapperExpiry === registrarExpiry + gracePeriod
 */
const isWrappedNameDesynced = (
  wrapperData: GetWrapperDataReturnType | undefined,
  expiryData: GetExpiryReturnType | undefined,
): boolean => {
  if (
    !wrapperData?.expiry?.value ||
    !expiryData?.expiry?.value ||
    expiryData.gracePeriod === undefined
  ) {
    return false
  }
  const expectedWrapperExpiry = expiryData.expiry.value + BigInt(expiryData.gracePeriod)
  return wrapperData.expiry.value !== expectedWrapperExpiry
}

export type RegistrationStatus =
  | 'invalid'
  | 'registered'
  | 'gracePeriod'
  | 'premium'
  | 'available'
  | 'short'
  | 'imported'
  | 'owned'
  | 'notImported'
  | 'notOwned'
  | 'unsupportedTLD'
  | 'offChain'
  | 'desynced'
  | 'desynced:gracePeriod'

export const getRegistrationStatus = ({
  timestamp,
  validation: { isETH, is2LD, isShort, type },
  ownerData,
  wrapperData,
  expiryData,
  priceData,
  addrData,
  supportedTLD,
  name,
}: {
  timestamp: number
  validation: Partial<Omit<ParsedInputResult, 'normalised' | 'isValid'>>
  ownerData?: GetOwnerReturnType
  wrapperData?: GetWrapperDataReturnType
  expiryData?: GetExpiryReturnType
  priceData?: GetPriceReturnType
  addrData?: GetAddressRecordReturnType
  supportedTLD?: boolean | null
  name?: string
}): RegistrationStatus => {
  if (name === '[root]') return 'owned'

  if (isETH && is2LD && isShort) {
    return 'short'
  }

  if (!ownerData && ownerData !== null && !wrapperData) return 'invalid'

  if (!isETH && !supportedTLD) {
    return 'unsupportedTLD'
  }

  if (isETH && is2LD) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    if (expiryData && expiryData.expiry) {
      const { expiry: _expiry, gracePeriod } = expiryData
      const expiry = new Date(_expiry.date)

      if (expiry.getTime() > timestamp) {
        // Proactive desync check: compare expiry timestamps
        if (isWrappedNameDesynced(wrapperData, expiryData)) {
          return 'desynced'
        }
        // Fallback: owner-based check (for edge cases where wrapper fully expired)
        if (
          ownerData &&
          ownerData.owner === emptyAddress &&
          ownerData.ownershipLevel === 'nameWrapper'
        ) {
          return 'desynced'
        }
        return 'registered'
      }
      if (expiry.getTime() + gracePeriod * 1000 > timestamp) {
        // Proactive desync check: compare expiry timestamps
        if (isWrappedNameDesynced(wrapperData, expiryData)) {
          return 'desynced:gracePeriod'
        }
        // Fallback: owner-based check (for edge cases)
        // Will need to rethink this when we add multiple chains to manager app.
        const chain = getChainsFromUrl()[0]
        if (
          chain &&
          ownerData &&
          ownerData.owner === chain.contracts.ensNameWrapper.address &&
          wrapperData === null
        ) {
          return 'desynced:gracePeriod'
        }
        return 'gracePeriod'
      }
      const { premium } = priceData || { premium: 0n }
      if (premium > 0n) {
        return 'premium'
      }
    }
    return 'available'
  }
  if (ownerData && ownerData.owner !== emptyAddress) {
    if (is2LD) {
      return 'imported'
    }
    return 'owned'
  }
  if (type === 'name' && !is2LD) {
    // more than 2 labels

    if (addrData?.value && addrData.value !== emptyAddress) {
      return 'offChain'
    }
    return 'notOwned'
  }

  if (
    addrData?.value &&
    addrData.value !== '0x0000000000000000000000000000000000000020' &&
    addrData.value !== emptyAddress
  ) {
    return 'imported'
  }

  return 'notImported'
}
