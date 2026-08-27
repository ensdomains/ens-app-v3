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
import { isKnownLabel } from './shortName'

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
    }
    // Nothing above claimed the name, so everything left is a judgement about registering it — and
    // that cannot be made for a label the app cannot read. Registering an encoded labelhash would
    // register the bracket string itself, i.e. the wrong name; `isShort` is a statement about the
    // missing label rather than about its length; and a premium implies the name is registerable. So
    // an unhealed label is none of short, available or premium — it is simply not ours to offer.
    if (!isKnownLabel(name)) return 'notOwned'

    const { premium } = priceData || { premium: 0n }
    // A short name can never be re-registered, so it never enters the premium window.
    if (expiryData?.expiry && premium > 0n && !isShort) {
      return 'premium'
    }
    // Otherwise the name is registerable — unless its label is below the registrar's minimum, in
    // which case it is a dead end rather than an available name.
    return isShort ? 'short' : 'available'
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
