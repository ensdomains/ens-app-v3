import { validate } from '@ensdomains/ens-validation'
import { formatsByName } from '@ensdomains/address-encoder'

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
  async (address: string): Promise<string | boolean> => {
    try {
      const coinTypeInstance = formatsByName[coin.toUpperCase()]
      coinTypeInstance.decoder(address)
      return true
    } catch (e: any) {
      console.log(e, typeof e)
      if (typeof e === 'string') return e
      if (e.message) return e.message
      if (e.toString) return e.toString()
      return 'Invalid address'
    }
  }
