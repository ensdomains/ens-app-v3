import { validate } from '@ensdomains/ens-validation'
import { isAddress } from 'ethers/lib/utils'

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
  (coin: string) =>
  (address: string): string | boolean => {
    const coinName = coin.toLowerCase()
    console.log(coinName)
    switch (coinName) {
      case 'eth':
        return isAddress(address) ? true : 'Invalid address format'
      default:
        return true
    }
  }
