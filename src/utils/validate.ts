import { validate } from '@ensdomains/ens-validation'
import { AddressIconType } from '../assets/address/DynamicAddressIcon'

export const hasNonAscii = () => {
  const strs = window.location.pathname.split('/')
  const rslt = strs.reduce((accum, next) => {
    if (accum) return true
    if (!validate(next)) return true
    return accum
  }, false)
  return rslt
}

export const validateCryptoAddress =
  (coin: AddressIconType) =>
  (address: string): string | boolean => {
    switch (coin) {
      case 'eth':
        return /0x[a-fA-F0-9]{40}/.test(address) ? 'Invalid Address format' : ''
      case 'bnb':
        return 'Invalid address format'
      default:
        return true
    }
  }
