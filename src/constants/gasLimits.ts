import { BigNumber } from 'ethers'

const SingleNameGasLimit = BigNumber.from('105000')
const BulkRenewalBaseGasLimit = BigNumber.from('105000')
const BulkRenewalGasLimitPerName = BigNumber.from('42000')
const gasLimitDictionary = {
  RENEW: (numberOfNames: number) => {
    if (!numberOfNames) return BigNumber.from('0')
    return numberOfNames === 1
      ? SingleNameGasLimit
      : BulkRenewalGasLimitPerName.mul(numberOfNames).add(BulkRenewalBaseGasLimit)
  },
}

export default gasLimitDictionary
