import { getCoderByCoinName } from '@ensdomains/address-encoder'

import { normalizeCoinAddress } from '@app/utils/coin'

export const validateCryptoAddress = ({
  coin,
  address,
}: {
  coin: string
  address: string | undefined
}) => {
  try {
    if (!address) return 'addressRequired'
    const _address = normalizeCoinAddress({ coin, address })
    const coinTypeInstance = getCoderByCoinName(coin)
    coinTypeInstance.decode(_address)
    return true
  } catch (e: unknown) {
    if (typeof e === 'string') return e
    if (typeof e === 'object' && e) {
      if ('reason' in e && e.reason) return e.reason as string
      if ('message' in e && e.message) return e.message as string
      if ('toString' in e && typeof e.toString === 'function') return e.toString()
    }
    return 'Invalid address'
  }
}
