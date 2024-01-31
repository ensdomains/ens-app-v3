import { getAddress } from 'viem'

export const normalizeCoinAddress = ({
  coin,
  address,
}: {
  coin: string | number
  address?: string | null
}): string => {
  if (!address) return ''
  if (coin === 'eth' || coin === 'ETH' || coin === 60) {
    try {
      return getAddress(address)
    } catch {
      return address
    }
  }
  return address
}
