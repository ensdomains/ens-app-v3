import coinsWithIcons from '@app/constants/coinsWithIcons.json'
import coinsWithoutIcons from '@app/constants/coinsWithoutIcons.json'

import COIN_LIST from './coinList'

describe('coins', () => {
  it('coins with and without icons should cover all the coins in coinlist', () => {
    const isIncluded = COIN_LIST.every((coin) => {
      const coinName = coin.toLowerCase()
      return coinsWithIcons.includes(coinName) || coinsWithoutIcons.includes(coinName)
    })
    expect(isIncluded).toBe(true)
  })
})
