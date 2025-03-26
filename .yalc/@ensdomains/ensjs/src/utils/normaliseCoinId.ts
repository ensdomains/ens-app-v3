import {
  getCoderByCoinName,
  getCoderByCoinType,
  type Coin,
} from '@ensdomains/address-encoder'
import { CoinFormatterNotFoundError } from '../errors/public.js'

export const normaliseCoinId = (coinId: string | number) => {
  const isString = typeof coinId === 'string'

  if (isString && Number.isNaN(parseInt(coinId))) {
    return {
      type: 'name',
      value: coinId.toLowerCase().replace(/legacy$/, 'Legacy'),
    } as const
  }
  return {
    type: 'id',
    value: isString ? parseInt(coinId as string) : (coinId as number),
  } as const
}

export const getCoderFromCoin = (coinId: string | number): Coin => {
  const normalisedCoin = normaliseCoinId(coinId)
  let coder: Coin
  try {
    coder =
      normalisedCoin.type === 'id'
        ? getCoderByCoinType(normalisedCoin.value)
        : getCoderByCoinName(normalisedCoin.value)
  } catch {
    throw new CoinFormatterNotFoundError({ coinType: coinId })
  }

  return coder
}
