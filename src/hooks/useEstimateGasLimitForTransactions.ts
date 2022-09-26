import type { JsonRpcSigner } from '@ethersproject/providers'
import { utils } from 'ethers'
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

export const useEstimateGasLimitForTransactions = (
  transactions: TransactionItem[],
  isEnabled: boolean = true,
  extraKeys: string[] = [],
) => {
  const keys = transactions.map((t) => t.name)

  const ens = useEns()
  const { ready: ensReady } = ens
  const { data: signer, isLoading: isSignerLoading } = useSigner()

  const { data, ...results } = useQuery(
    ['use-estimate-gas-limit-for-transactions', ...keys, ...extraKeys],
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
    },
  )

  return {
    gasLimit: data?.gasLimit,
    gasCostEth: utils.formatEther(data?.gasCost || 0),
    estimates: data?.estimates,
    ...results,
  }
}
