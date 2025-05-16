import { getAddress } from 'viem'

export const isEthCoin = (coin: string | number): boolean =>
  (typeof coin === 'string' && coin.toLowerCase() === 'eth') || coin === 60

export const normalizeCoinAddress = ({
  coin,
  address,
}: {
  coin: string | number
  address?: string | null
}): string => {
  if (!address) return ''
  if (isEthCoin(coin)) {
    try {
      return getAddress(address)
    } catch {
      return address
    }
  }
  return address
}
