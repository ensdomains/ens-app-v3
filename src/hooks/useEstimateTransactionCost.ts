import { useMemo } from 'react'
import { useFeeData } from 'wagmi'

const gasLimitDictionary = {
  COMMIT: 42000,
  RENEW: 61818,
}

const useEstimateTransactionCost = (...transactions: (keyof typeof gasLimitDictionary)[]) => {
  const { data: feeData, isLoading } = useFeeData()

  const data = useMemo(() => {
    if (!feeData || isLoading) return undefined
    const { maxFeePerGas } = feeData

    if (!maxFeePerGas) throw new Error('Fee data not found')
    const totalGasLimit = transactions
      .map((transaction) => gasLimitDictionary[transaction])
      .reduce((a, b) => a + b)
    const transactionFee = maxFeePerGas.mul(totalGasLimit)
    return {
      transactionFee,
      gasPrice: maxFeePerGas,
      gasLimit: totalGasLimit,
    }
  }, [transactions, feeData, isLoading])

  return {
    data,
    isLoading,
  }
}

export default useEstimateTransactionCost
