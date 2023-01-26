import { getAddress } from '@ethersproject/address'

import { formatsByName } from '@ensdomains/address-encoder'
import { validate } from '@ensdomains/ens-validation'

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
  async (address?: string): Promise<string | boolean> => {
    if (!address) return true
    try {
      let formattedAddress = address
      if (coin.toUpperCase() === 'ETH') {
        formattedAddress = getAddress(address)
      }
      const coinTypeInstance = formatsByName[coin.toUpperCase()]
      coinTypeInstance.decoder(formattedAddress)
      return true
    } catch (e: any) {
      if (typeof e === 'string') return e
      if (e.reason) return e.reason
      if (e.message) return e.message
      if (e.toString) return e.toString()
      return 'Invalid address'
    }
  }
