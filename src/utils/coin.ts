import { getAddress } from 'viem'

export const normalizeCoinAddress = ({
  coin,
  address,
}: {
  coin: string | number
  address?: string | null
}): string => {
  if (!address) return ''
  if (coin === 'eth' || coin === 60) return getAddress(address)
  return address
}
