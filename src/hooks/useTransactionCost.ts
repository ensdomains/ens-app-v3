import { useFeeData, useQuery } from 'wagmi'
import { BigNumber } from 'ethers'

const gasLimitDictionary = {
  REGISTER: 240000,
  COMMIT: 42000,
}

type TransactionType = keyof typeof gasLimitDictionary

type FeeData = {
  maxFeePerGas: BigNumber
  gasPrice: BigNumber
  maxPriorityFeePerGas: BigNumber
  formatted: {
    gasPrice: string
    maxFeePerGas: string
    maxPriorityFeePerGas: string
  }
}

type TransactionCost = {
  transactionFee: BigNumber
  gasPrice: BigNumber
  gasLimit: number
}

export const useEstimateTransactionCost = (transactions: TransactionType[]) => {
  const { data: feeData, isLoading: feeDataLoading } = useFeeData()

  const {
    data,
    isLoading: loading,
    isFetching: fetching,
  } = useQuery(
    ['estimate-transaction-cost', ...transactions],
    async () => {
      const { maxFeePerGas } = feeData as FeeData
      // if (!maxFeePerGas) throw new Error('Fee data not found')
      const totalGasLimit = transactions
        .map((transaction) => gasLimitDictionary[transaction])
        .reduce((a, b) => a + b)
      const transactionFee = maxFeePerGas.mul(totalGasLimit)
      return {
        transactionFee,
        gasPrice: maxFeePerGas,
        gasLimit: totalGasLimit,
      } as TransactionCost
    },
    {
      enabled: true,
    },
  )

  return {
    data,
    loading,
  }
}
