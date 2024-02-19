import { describe, expect, it } from 'vitest'

import * as coins from '@ensdomains/address-encoder/coins'

import coinsWithIcons from '@app/constants/coinsWithIcons.json'
import coinsWithoutIcons from '@app/constants/coinsWithoutIcons.json'

const COIN_LIST = Object.keys(coins).filter((x) => !x.endsWith('Legacy'))

describe('coins with and without icons should cover all coins in coinlist', () => {
  it.each(COIN_LIST)('coin %s should be in coinlist', (coinName) => {
    const isIncluded = coinsWithIcons.includes(coinName) || coinsWithoutIcons.includes(coinName)
    expect(isIncluded).toBe(true)
  })
})
