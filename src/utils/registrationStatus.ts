import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'

import { ParsedInputResult } from '@ensdomains/ensjs/utils/validation'

import type { Profile, ReturnedENS } from '@app/types/index'

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

const offchainDnsAddress = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '1': '0xF142B308cF687d4358410a4cB885513b30A42025',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '11155111': '0x179Be112b24Ad4cFC392eF8924DfA08C20Ad8583',
}

export const getRegistrationStatus = ({
  timestamp,
  validation: { isETH, is2LD, isShort, type },
  ownerData,
  wrapperData,
  expiryData,
  priceData,
  supportedTLD,
  profileData,
  chainId,
}: {
  timestamp: number
  validation: Partial<Omit<ParsedInputResult, 'normalised' | 'isValid'>>
  ownerData?: ReturnedENS['getOwner']
  wrapperData?: ReturnedENS['getWrapperData']
  expiryData?: ReturnedENS['getExpiry']
  priceData?: ReturnedENS['getPrice']
  supportedTLD?: boolean | null
  profileData?: Profile
  chainId: number
}): RegistrationStatus => {
  if (isETH && is2LD && isShort) {
    return 'short'
  }

  if (!ownerData && !wrapperData) return 'invalid'

  if (!isETH && !supportedTLD) {
    return 'unsupportedTLD'
  }

  if (isETH && is2LD) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    if (expiryData && expiryData.expiry) {
      const { expiry: _expiry, gracePeriod } = expiryData as {
        expiry: Date | string
        gracePeriod: number
      }
      const expiry = new Date(_expiry)
      if (expiry.getTime() > timestamp) {
        return 'registered'
      }
      if (expiry.getTime() + gracePeriod > timestamp) {
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
    if (is2LD) {
      return 'imported'
    }
    return 'owned'
  }
  if (type === 'name' && !is2LD) {
    // more than 2 labels
    return 'notOwned'
  }

  console.log(profileData)
  console.log(!!profileData?.address)
  console.log(profileData?.address !== '0x0000000000000000000000000000000000000020')
  console.log(profileData?.address !== emptyAddress)
  console.log(
    profileData?.resolverAddress ===
      offchainDnsAddress[String(chainId) as keyof typeof offchainDnsAddress],
  )

  if (
    profileData &&
    profileData.address &&
    profileData.address !== '0x0000000000000000000000000000000000000020' &&
    profileData.address !== emptyAddress &&
    profileData.resolverAddress ===
      offchainDnsAddress[String(chainId) as keyof typeof offchainDnsAddress]
  ) {
    return 'imported'
  }
  return 'notImported'
}
