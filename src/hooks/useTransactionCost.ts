import { useFeeData, useQuery } from 'wagmi'

export const gasLimitDictionary = {
  REGISTER: 240000,
  COMMIT: 42000,
  RENEW: (count: number) => {
    if (!count) return 0
    return count === 1 ? 105000 : 42000 * count + 105000
  },
}

type PickByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>

type NumericalTransaction = keyof PickByValue<typeof gasLimitDictionary, number>

type TransactionType =
  | NumericalTransaction
  | {
      key: 'RENEW'
      args: [number]
    }

export const useEstimateTransactionCost = (transactions: TransactionType[]) => {
  const { data: feeData, isLoading: feeDataLoading } = useFeeData()

  const keys = transactions.map((transaction) =>
    typeof transaction === 'string'
      ? transaction
      : `${transaction.key}-${transaction.args?.join('-')}`,
  )

  console.log('keys', keys)

  const { data, isLoading } = useQuery(
    ['estimate-transaction-cost', keys],
    async () => {
      if (!feeData || feeDataLoading) return undefined
      const { maxFeePerGas } = feeData

      if (!maxFeePerGas) throw new Error('Fee data not found')
      const totalGasLimit = transactions
        .map((transaction) => {
          const key = typeof transaction === 'string' ? transaction : transaction.key
          if (!gasLimitDictionary[key]) return 0
          if (typeof gasLimitDictionary[key] === 'number') return gasLimitDictionary[key] as number
          let funtionalTransaction
          if (key === 'RENEW')
            funtionalTransaction = transaction as { key: 'RENEW'; args: [number] }
          else return 0
          return gasLimitDictionary[funtionalTransaction.key](...funtionalTransaction.args)
        })
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
