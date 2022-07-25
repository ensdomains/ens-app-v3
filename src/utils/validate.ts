import { validate } from '@ensdomains/ens-validation'
import { formatsByName } from '@ensdomains/address-encoder'
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
  async (address: string): Promise<string | boolean> => {
    try {
      const coinTypeInstance = formatsByName[coin.toUpperCase()]
      coinTypeInstance.decoder(address)
      return true
    } catch (e) {
      console.log(e)
      const error = e?.message
      return error
    }
  }
