import {
  GetAddressRecordReturnType,
  GetExpiryReturnType,
  GetOwnerReturnType,
  GetPriceReturnType,
} from '@ensdomains/ensjs/public'
import { ParsedInputResult } from '@ensdomains/ensjs/utils'

import { emptyAddress } from './constants'

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

export const getRegistrationStatus = ({
  timestamp,
  validation: { isETH, is2LD, isShort, type },
  ownerData,
  expiryData,
  priceData,
  addrData,
  supportedTLD,
}: {
  timestamp: number
  validation: Partial<Omit<ParsedInputResult, 'normalised' | 'isValid'>>
  ownerData?: GetOwnerReturnType
  expiryData?: GetExpiryReturnType
  priceData?: GetPriceReturnType
  addrData?: GetAddressRecordReturnType
  supportedTLD?: boolean | null
}): RegistrationStatus => {
  if (isETH && is2LD && isShort) {
    return 'short'
  }

  // TODO: temporarily disabling
  // if (!ownerData && ownerData !== null) return 'invalid'

  if (!isETH && !supportedTLD) {
    return 'unsupportedTLD'
  }

  if (isETH && is2LD) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    if (expiryData && expiryData.expiry) {
      const { expiry: _expiry, gracePeriod } = expiryData
      const expiry = new Date(_expiry.date)
      if (expiry.getTime() > timestamp) {
        return 'registered'
      }
      if (expiry.getTime() + gracePeriod * 1000 > timestamp) {
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
