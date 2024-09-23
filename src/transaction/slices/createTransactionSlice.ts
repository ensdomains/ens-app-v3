import type { Address, Hash, Hex } from 'viem'
import type { StateCreator } from 'zustand'

import type { SourceChain, TargetChain } from '@app/constants/chains'

import type { TransactionStoreIdentifiers } from '../types'
import type { UserTransactionData, UserTransactionName } from '../user/transaction'
import {
  getAllTransactionsComplete,
  getCanRemoveFlow,
  getCurrentFlowOrNull,
  type FlowId,
} from './createFlowSlice'
import type { AllSlices, MiddlewareArray } from './types'
import { compareFlow, getIdentifiersOrNull, getStoredTransaction } from './utils'

type TransactionIndex = number
export type TransactionId = `${UserTransactionName}-${TransactionIndex}`
export type TransactionKey = `["${TransactionId}","${FlowId}",${SourceChain['id']},"${Address}"]`
export type StoredTransactionStatus =
  | 'empty'
  | 'waitingForUser'
  | 'pending'
  | 'success'
  | 'reverted'
export type StoredTransactionType = 'standard' | 'safe'

type TransactionSubmission = {
  input: Hex
  timestamp: number
  nonce: number
}

type EmptyStoredTransaction = {
  status: 'empty'
  currentHash: null
  transactionType: null
  transaction?: never
  receipt?: never
  search?: never
}

type WaitingForUserStoredTransaction = {
  status: 'waitingForUser'
  currentHash: null
  transactionType: StoredTransactionType
  transaction: TransactionSubmission
  receipt?: never
}

type PendingStoredTransaction = {
  status: 'pending'
  currentHash: Hash
  transactionType: StoredTransactionType
}

type SuccessStoredTransaction = {
  status: 'success'
  currentHash: Hash
  transactionType: StoredTransactionType
  receipt: ReceiptData
}

type RevertedStoredTransaction = {
  status: 'reverted'
  currentHash: Hash
  transactionType: StoredTransactionType
  receipt: ReceiptData
}

export type StoredTransactionIdentifiers = TransactionStoreIdentifiers & {
  targetChainId: TargetChain['id']
  flowId: FlowId
  transactionId: TransactionId
}

type ReceiptData = {
  // TODO(tate): idk what we need from this yet
  timestamp: number
}

export type GenericStoredTransaction<
  name extends UserTransactionName = UserTransactionName,
  status extends StoredTransactionStatus = StoredTransactionStatus,
> = StoredTransactionIdentifiers & {
  name: name
  data: UserTransactionData<name>
  status: status
  currentHash: Hash | null
  transactionType: StoredTransactionType | null

  submission?:
    | TransactionSubmission
    | {
        timestamp: number
      }
  receipt?: ReceiptData
  search?: {
    retries: number
    status: 'searching' | 'found'
  }
} & (
    | EmptyStoredTransaction
    | WaitingForUserStoredTransaction
    | PendingStoredTransaction
    | SuccessStoredTransaction
    | RevertedStoredTransaction
  )

export type StoredTransaction<
  status extends StoredTransactionStatus = StoredTransactionStatus,
  other = {},
> = {
  [action in UserTransactionName]: GenericStoredTransaction<action, status> & other
}[UserTransactionName]

export type StoredTransactionList<
  status extends StoredTransactionStatus = StoredTransactionStatus,
> = StoredTransaction<status>[]

export type TransactionSlice = {
  transactions: Map<TransactionKey, StoredTransaction>
  getTransactionsByStatus: <status extends StoredTransactionStatus>(
    status: status,
  ) => StoredTransaction<status>[]
  getAllTransactions: () => StoredTransaction[]
  isTransactionResumable: (transaction: StoredTransaction) => boolean
  setTransactionStatus: (
    identifiers: StoredTransactionIdentifiers,
    status: StoredTransactionStatus,
  ) => void
  setTransactionReceipt: (identifiers: StoredTransactionIdentifiers, receipt: ReceiptData) => void
  setTransactionHash: (identifiers: StoredTransactionIdentifiers, hash: Hash) => void
  setTransactionSubmission: (
    identifiers: StoredTransactionIdentifiers,
    submission: TransactionSubmission & Pick<StoredTransaction, 'transactionType'>,
  ) => void
  clearTransactionsAndFlows: () => void
}

export const createTransactionSlice: StateCreator<
  AllSlices,
  MiddlewareArray,
  [],
  TransactionSlice
> = (set, get) => ({
  transactions: new Map(),
  getTransactionsByStatus: <status extends StoredTransactionStatus>(status: status) => {
    const state = get()
    const identifiers = getIdentifiersOrNull(state, undefined)
    if (!identifiers) return []
    return Array.from(state.transactions.values()).filter(
      (t): t is StoredTransaction<status> =>
        !!t &&
        t.status === status &&
        t.sourceChainId === identifiers.sourceChainId &&
        t.account === identifiers.account,
    )
  },
  getAllTransactions: () => {
    const state = get()
    const identifiers = getIdentifiersOrNull(state, undefined)
    if (!identifiers) return []
    return Array.from(state.transactions.values()).filter(
      (t): t is StoredTransaction =>
        !!t && t.sourceChainId === identifiers.sourceChainId && t.account === identifiers.account,
    )
  },
  isTransactionResumable: (transaction) => {
    const state = get()
    const flow = state.getFlowOrNull(transaction.flowId, transaction)
    if (!flow) return false
    if (getCanRemoveFlow(state, flow)) return false
    const transactionIndex = flow.transactionIds.indexOf(transaction.transactionId)
    return transactionIndex === flow.currentTransactionIndex
  },
  setTransactionStatus: (identifiers, status) => {
    set((mutable) => {
      const transaction = getStoredTransaction(mutable, identifiers)
      transaction.status = status
    })
    const state = get()
    const transaction = getStoredTransaction(state, identifiers)
    state.transactionDidUpdate(transaction)

    const flow = state.getFlowOrNull(transaction.flowId, transaction)
    if (!flow) return
    if (!flow.autoClose) return
    if (!getAllTransactionsComplete(state, flow)) return

    const currentFlow = getCurrentFlowOrNull(state)
    if (!currentFlow) return
    const isEqual = compareFlow(currentFlow, flow)
    if (!isEqual) return
    state.stopCurrentFlow()
  },
  setTransactionReceipt: (identifiers, receipt) =>
    set((mutable) => {
      const transaction = getStoredTransaction(mutable, identifiers)
      transaction.receipt = receipt
    }),
  setTransactionHash: (identifiers, hash) => {
    set((mutable) => {
      const transaction = getStoredTransaction(mutable, identifiers)
      transaction.currentHash = hash
    })
    const state = get()
    const transaction = getStoredTransaction(state, identifiers)
    if (transaction.status === 'empty' || transaction.status === 'waitingForUser')
      state.setTransactionStatus(identifiers, 'pending')
  },
  setTransactionSubmission: (identifiers, { transactionType, ...submission }) => {
    set((mutable) => {
      const transaction = getStoredTransaction(mutable, identifiers)
      transaction.submission = submission
      transaction.transactionType = transactionType
    })
    const state = get()
    state.setTransactionStatus(identifiers, 'waitingForUser')
  },
  clearTransactionsAndFlows: () =>
    set((mutable) => {
      mutable.transactions.clear()
      mutable.flows.clear()
    }),
})
