import type { JsonRpcSigner } from '@ethersproject/providers'
import { useQuery, useSigner } from 'wagmi'

import {
  Transaction,
  TransactionName,
  transactions as _transactions,
  makeTransactionItem,
} from '@app/transaction-flow/transaction'
import { useEns } from '@app/utils/EnsProvider'

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

export const useEstimateGasLimitForTransactions = (transactions: TransactionItem[]) => {
  const keys = transactions.map((t) => t.name)

  const ens = useEns()
  const { ready: ensReady } = ens
  const { data: signer, isLoading: isSignerLoading } = useSigner()

  const { data, ...results } = useQuery(
    ['use-estimate-gas-limit-for-transactions', ...keys],
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
      return {
        estimates,
        gasLimit: total,
      }
    },
    {
      enabled: ensReady && !isSignerLoading,
    },
  )

  return {
    gasLimit: data?.gasLimit,
    estimates: data?.estimates,
    ...results,
  }
}
