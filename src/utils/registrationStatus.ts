import {
  GetAddressRecordReturnType,
  GetExpiryReturnType,
  GetOwnerReturnType,
  GetPriceReturnType,
  GetWrapperDataReturnType,
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
  | 'offChain'

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
