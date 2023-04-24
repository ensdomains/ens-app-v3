import type { JsonRpcSigner } from '@ethersproject/providers'
import { formatEther } from '@ethersproject/units'
import { useQuery, useSigner } from 'wagmi'

import {
  Transaction,
  TransactionName,
  transactions as _transactions,
  makeTransactionItem,
} from '@app/transaction-flow/transaction'
import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

type ENS = ReturnType<typeof useEns>
type TransactionItem = ReturnType<typeof makeTransactionItem>

export const fetchEstimateWithConfig =
  (transactionsObj: Transaction, signer: JsonRpcSigner, ens: ENS) =>
  async (transaction: TransactionItem) => {
    const transactionName = transaction.name as TransactionName
    const populatedTransaction = await transactionsObj[transactionName].transaction(
      signer as JsonRpcSigner,
      ens,
      transaction.data,
    )

    const gasLimit = await signer!.estimateGas(populatedTransaction)

    return {
      name: transactionName,
      gasLimit,
    }
  }

export const useEstimateGasLimitForTransactions = (
  transactions: TransactionItem[],
  isEnabled: boolean = true,
  extraKeys: string[] = [],
) => {
  const ens = useEns()
  const { ready: ensReady } = ens
  const { data: signer, isLoading: isSignerLoading } = useSigner()

  const { data, isLoading, isFetching, ...results } = useQuery(
    useQueryKeys().estimateGasLimitForTransactions(transactions, extraKeys),
    async () => {
      if (!signer) throw new Error('No signer available')
      if (!ens) throw new Error('ensjs did not load')
      const fetchEstimate = fetchEstimateWithConfig(
        _transactions,
        signer as JsonRpcSigner,
        ens as ENS,
      )
      const estimates = await Promise.all(transactions.map(fetchEstimate))
      const total = estimates.map((r) => r.gasLimit).reduce((a, b) => a.add(b))
      const gasPrice = await signer.getGasPrice()
      const gasCost = gasPrice.mul(total)

      return {
        estimates,
        gasCost,
        gasLimit: total,
      }
    },
    {
      enabled: ensReady && !isSignerLoading && isEnabled,
      onError: console.error,
      staleTime: 0,
    },
  )

  return {
    gasLimit: data?.gasLimit,
    gasCostEth: formatEther(data?.gasCost || 0),
    estimates: data?.estimates,
    isLoading,
    isFetching,
    ...results,
  }
}
