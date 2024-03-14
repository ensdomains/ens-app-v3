const SingleNameGasLimit = 105000n
const BulkRenewalBaseGasLimit = 105000n
const BulkRenewalGasLimitPerName = 42000n
const gasLimitDictionary = {
  RENEW: (numberOfNames: number) => {
    if (!numberOfNames) return 0n
    return numberOfNames === 1
      ? SingleNameGasLimit
      : BulkRenewalGasLimitPerName * BigInt(numberOfNames) + BulkRenewalBaseGasLimit
  },
}

export default gasLimitDictionary
