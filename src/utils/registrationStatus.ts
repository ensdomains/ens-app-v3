import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'

import { ParsedInputResult } from '@ensdomains/ensjs/utils/validation'

import type { ReturnedENS } from '@app/types/index'

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
  expiryOrResolverData,
  priceOrAddrData,
  supportedTLD,
  chainId,
}: {
  timestamp: number
  validation: Partial<Omit<ParsedInputResult, 'normalised' | 'isValid'>>
  ownerData?: ReturnedENS['getOwner']
  wrapperData?: ReturnedENS['getWrapperData']
  expiryOrResolverData?: ReturnedENS['getExpiry'] | ReturnedENS['getResolver']
  priceOrAddrData?: ReturnedENS['getPrice'] | ReturnedENS['getAddr']
  supportedTLD?: boolean | null
  chainId?: number
}): RegistrationStatus => {
  if (isETH && is2LD && isShort) {
    return 'short'
  }

  if (!ownerData && !wrapperData) return 'invalid'

  if (!isETH && !supportedTLD) {
    return 'unsupportedTLD'
  }

  if (isETH && is2LD) {
    const expiryData = expiryOrResolverData as ReturnedENS['getExpiry']
    const priceData = priceOrAddrData as ReturnedENS['getPrice']
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

  const addrData = priceOrAddrData as ReturnedENS['getAddr']
  const resolverData = expiryOrResolverData as ReturnedENS['getResolver']

  if (
    addrData &&
    addrData !== '0x0000000000000000000000000000000000000020' &&
    addrData !== emptyAddress &&
    resolverData === offchainDnsAddress[String(chainId) as keyof typeof offchainDnsAddress]
  ) {
    return 'imported'
  }
  console.log('will return not imported')
  return 'notImported'
}
