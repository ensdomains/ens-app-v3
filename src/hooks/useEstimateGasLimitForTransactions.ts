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
  const { ready } = ens
  const { data: signer } = useSigner()

  return useQuery(
    ['use-estimate-gas-limit-for-transactions', ...keys],
    async () => {
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
      enabled: !!(ready && signer),
    },
  )
}

// type Transactions = {
//   name: TransactionName,
//   data:
// }
// const useEstimateGasForTransactions = (transactions: Transaction[]) => {
//   const ens = useEns()
//   const { ready } = ens
//   const { data: signer } = useSigner()

//   const { data } = useQuery([], async () => {

//     const results = await Promise.all(async (transaction) => {
//       const populatedTransaction = await _transactions[transaction.name].transaction(
//         signer as JsonRpcSigner,
//         ens,
//         transaction.data,
//       )
//       const gasLimit = await signer!.estimateGas(populatedTransaction)

//       return {
//         ...populatedTransaction,
//         to: populatedTransaction.to as `0x${string}`,
//         gasLimit,
//       }
//     })
//   }, {
//     enabled: !!(ready && signer),
//   })
// }
