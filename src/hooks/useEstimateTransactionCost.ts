import { useMemo } from 'react'
import { useFeeData } from 'wagmi'

const gasLimitDictionary = {
  COMMIT: 42000,
  RENEW: 61818,
}

const useEstimateTransactionCost = (...transactions: (keyof typeof gasLimitDictionary)[]) => {
  const { data: feeData, isLoading } = useFeeData({
    watch: true,
  })

  const data = useMemo(() => {
    if (!feeData || isLoading) return undefined
    const { lastBaseFeePerGas, maxPriorityFeePerGas } = feeData

    if (!lastBaseFeePerGas || !maxPriorityFeePerGas) throw new Error('Fee data not found')
    const totalGasLimit = transactions
      .map((transaction) => gasLimitDictionary[transaction])
      .reduce((a, b) => a + b)
    const gasPrice = lastBaseFeePerGas.add(maxPriorityFeePerGas)
    const transactionFee = gasPrice.mul(totalGasLimit)
    return {
      transactionFee,
      gasPrice,
      gasLimit: totalGasLimit,
    }
  }, [transactions, feeData, isLoading])

  return {
    data,
    isLoading,
  }
}

export default useEstimateTransactionCost
