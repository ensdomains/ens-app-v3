import { getTransactionKey } from '../key'
import type { TransactionStoreIdentifiers } from '../types'
import type { CurrentSlice } from './createCurrentSlice'
import type { StoredFlow } from './createFlowSlice'
import type { StoredTransactionIdentifiers } from './createTransactionSlice'
import type { AllSlices } from './types'

export const getIdentifiersOrNull = (
  state: CurrentSlice,
  identifiersOverride: TransactionStoreIdentifiers | undefined,
) => {
  const { account, sourceChainId } = identifiersOverride ?? state.current
  if (!account) return null
  if (!sourceChainId) return null
  return { account, sourceChainId }
}

export const getIdentifiers = (
  state: CurrentSlice,
  identifiersOverride: TransactionStoreIdentifiers | undefined,
) => {
  const { account, sourceChainId } = identifiersOverride ?? state.current
  if (!account) throw new Error('No account found')
  if (!sourceChainId) throw new Error('No sourceChainId found')
  return { account, sourceChainId }
}

export const getStoredTransaction = (
  state: AllSlices,
  identifiers: StoredTransactionIdentifiers,
) => {
  const transactionKey = getTransactionKey(identifiers)
  const transaction = state.transactions.get(transactionKey)
  if (!transaction) throw new Error('No transaction found')
  return transaction
}

export const compareFlow = (a: StoredFlow, b: StoredFlow) => {
  if (a.flowId !== b.flowId) return false
  if (a.account !== b.account) return false
  if (a.sourceChainId !== b.sourceChainId) return false
  return true
}
