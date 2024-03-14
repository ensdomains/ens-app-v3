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
  } catch (e: any) {
    if (typeof e === 'string') return e
    if (e.reason) return e.reason
    if (e.message) return e.message
    if (e.toString) return e.toString()
    return 'Invalid address'
  }
}
