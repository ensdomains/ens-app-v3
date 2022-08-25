import { useQuery } from '@tanstack/react-query'
import { BigNumberish, ethers } from 'ethers'
import { useProvider } from 'wagmi'

const gasLimitDictionary = {
  REGISTER: 240000,
  COMMIT: 42000,
}

type TransactionType = keyof typeof gasLimitDictionary

export const useEstimateTransactionCost = (
  transactions: TransactionType[],
  unitName: BigNumberish = 'gwei',
) => {
  const provider = useProvider()
  const { data, isLoading: loading } = useQuery(
    ['estimate-transaction-cost', ...transactions],
    async () => {
      const { maxFeePerGas } = await provider.getFeeData()
      if (!maxFeePerGas) throw new Error('Could not get feed data')
      const totalGasLimit = transactions
        .map((transaction) => gasLimitDictionary[transaction])
        .reduce((a, b) => a + b)
      const feePerGasGwei = parseFloat(ethers.utils.formatUnits(maxFeePerGas, unitName))
      if (Number.isNaN(feePerGasGwei)) throw new Error('Could not parse fee data')

      return {
        transactionCost: feePerGasGwei * totalGasLimit,
        gasPrice: feePerGasGwei,
        gasLimit: totalGasLimit,
      }
    },
    {
      enabled: !!provider,
    },
  )

  return {
    data,
    loading,
  }
}
