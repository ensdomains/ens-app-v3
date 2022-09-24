import { BigNumber } from 'ethers'

const gasLimitDictionary = {
  RENEW: (count: number) => {
    if (!count) return BigNumber.from('0')
    return count === 1
      ? BigNumber.from('105000')
      : BigNumber.from('42000').mul(count).add(BigNumber.from('105000'))
  },
}

export default gasLimitDictionary
