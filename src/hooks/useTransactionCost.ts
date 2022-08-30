import { useFeeData, useQuery } from 'wagmi'

const gasLimitDictionary = {
  REGISTER: 240000,
  COMMIT: 42000,
}

type TransactionType = keyof typeof gasLimitDictionary

export const useEstimateTransactionCost = (transactions: TransactionType[]) => {
  const { data: feeData, isLoading: feeDataLoading } = useFeeData()

  const { data, isLoading } = useQuery(
    ['estimate-transaction-cost', ...transactions],
    async () => {
      if (!feeData || feeDataLoading) return undefined
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
    },
    {
      enabled: !feeDataLoading && !!feeData,
    },
  )

  return {
    data,
    loading: isLoading || feeDataLoading,
  }
}
