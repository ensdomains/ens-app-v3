import { getAddress } from 'viem'

import { getCoderByCoinName } from '@ensdomains/address-encoder'

export const validateCryptoAddress = ({
  coin,
  address,
}: {
  coin: string
  address: string | undefined
}) => {
  try {
    if (!address) return 'addressRequired'
    const _coin = coin.toUpperCase()

    let _address
    if (_coin === 'ETH') _address = getAddress(address)
    else _address = address

    const coinTypeInstance = getCoderByCoinName(_coin)
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
