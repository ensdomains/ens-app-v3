/* eslint-disable no-param-reassign */

import type { WritableDraft } from 'immer/dist/internal'
import type { Address } from 'viem'
import type { StateCreator } from 'zustand'

import type { SourceChain } from '@app/constants/chains'

import { getFlowKey, getTransactionKey } from '../key'
import type { TransactionStoreIdentifiers } from '../types'
import type { GenericTransactionInput, TransactionInput } from '../user/input'
import type { TransactionIntro } from '../user/intro'
import type { UserTransaction } from '../user/transaction'
import type {
  StoredTransaction,
  StoredTransactionList,
  TransactionId,
} from './createTransactionSlice'
import type { AllSlices, MiddlewareArray } from './types'
import { getIdentifiers } from './utils'

export type FlowId = string
export type FlowKey = `["${FlowId}",${SourceChain['id']},"${Address}"]`
export type TransactionFlowStage = 'input' | 'intro' | 'transaction'

export type StoredFlow = TransactionStoreIdentifiers & {
  flowId: FlowId
  transactionIds: TransactionId[]
  currentTransactionIndex: number
  currentStage: TransactionFlowStage
  input?: TransactionInput
  intro?: TransactionIntro
  resumable?: boolean
  requiresManualCleanup?: boolean
  autoClose?: boolean
  resumeLink?: string
  disableBackgroundClick?: boolean
}

export type FlowInitialiserData = Omit<
  StoredFlow,
  'currentStage' | 'currentTransactionIndex' | 'transactionIds' | keyof TransactionStoreIdentifiers
> & {
  transactions: UserTransaction[]
}

export type FlowSlice = {
  flows: Map<FlowKey, StoredFlow>

  /* ID-specific Flow */
  /* Getters */
  getFlowOrNull: (
    flowId: FlowId,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => StoredFlow | null
  getFlowStageOrNull: (
    flowId: FlowId,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => TransactionFlowStage | 'complete' | null
  getFlowTransactions: (
    flowId: FlowId,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => StoredTransactionList
  getFlowTransactionsOrNull: (
    flowId: FlowId,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => StoredTransactionList | null
  isFlowResumable: (flowId: FlowId, identifiersOverride?: TransactionStoreIdentifiers) => boolean
  /* Setters */
  showFlowInput: (
    flowId: FlowId,
    {
      input,
      disableBackgroundClick,
    }: { input: GenericTransactionInput; disableBackgroundClick?: boolean },
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  startFlow: (flow: FlowInitialiserData, identifiersOverride?: TransactionStoreIdentifiers) => void
  resumeFlow: (flowId: FlowId, identifiersOverride?: TransactionStoreIdentifiers) => void
  resumeFlowWithCheck: (
    flowId: FlowId,
    { push }: { push: (path: string) => void },
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  cleanupFlow: (flowId: FlowId, identifiersOverride?: TransactionStoreIdentifiers) => void
  cleanupFlowUnsafe: (flowId: FlowId, identifiersOverride?: TransactionStoreIdentifiers) => void
  setFlowTransactions: (
    flowId: FlowId,
    transactions: UserTransaction[],
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void

  /* Current Flow */
  /* Getters */
  getCurrentFlowTransactions: () => StoredTransactionList
  getCurrentOrPreviousFlow: () => { flow: StoredFlow | null; isPrevious: boolean }
  /* Setters */
  setCurrentFlowTransactions: (transactions: UserTransaction[]) => void
  setCurrentFlowStage: (stage: TransactionFlowStage) => void
  stopCurrentFlow: () => void
  attemptCurrentFlowDismiss: () => void
  incrementCurrentFlowTransactionIndex: () => void
  resetCurrentFlowTransactionIndex: () => void
}

const getCurrentFlow = (state: AllSlices) => {
  const { account, sourceChainId, flowId } = state.current
  if (!flowId) throw new Error('No flowId found')
  if (!account) throw new Error('No account found')
  if (!sourceChainId) throw new Error('No sourceChainId found')
  const flowKey = getFlowKey({ flowId, sourceChainId, account })
  const flow = state.flows.get(flowKey)
  if (!flow) throw new Error('No flow found')
  return flow
}
export const getCurrentFlowOrNull = (state: AllSlices) => {
  const { account, sourceChainId, flowId } = state.current
  if (!account || !sourceChainId || !flowId) return null
  const flowKey = getFlowKey({ flowId, sourceChainId, account })
  return state.flows.get(flowKey) ?? null
}

export const getAllTransactionsComplete = (state: AllSlices, flow: StoredFlow) => {
  const identifiers = {
    account: flow.account,
    sourceChainId: flow.sourceChainId,
    flowId: flow.flowId,
  }
  return flow.transactionIds.every((transactionId) => {
    const transactionKey = getTransactionKey({ transactionId, ...identifiers })
    const transaction = state.transactions.get(transactionKey)
    return transaction?.status === 'success'
  })
}

export const getNoTransactionsStarted = (state: AllSlices, flow: StoredFlow) => {
  const identifiers = {
    account: flow.account,
    sourceChainId: flow.sourceChainId,
    flowId: flow.flowId,
  }
  return flow.transactionIds.every((transactionId) => {
    const transactionKey = getTransactionKey({ transactionId, ...identifiers })
    const transaction = state.transactions.get(transactionKey)
    return transaction?.status === 'empty'
  })
}

export const getCanRemoveFlow = (state: AllSlices, flow: StoredFlow) => {
  if (flow.requiresManualCleanup) return false
  if (!flow.transactionIds || flow.transactionIds.length === 0) return true
  if (!flow.resumable) return true

  if (getAllTransactionsComplete(state, flow)) return true
  return getNoTransactionsStarted(state, flow)
}

export const createFlowSlice: StateCreator<AllSlices, MiddlewareArray, [], FlowSlice> = (
  set,
  get,
) => ({
  flows: new Map(),
  getFlowOrNull: (flowId, identifiersOverride) => {
    const state = get()
    const identifiers = getIdentifiers(state, identifiersOverride)
    const flowKey = getFlowKey({ flowId, ...identifiers })
    return state.flows.get(flowKey) ?? null
  },
  getFlowStageOrNull: (flowId, identifiersOverride) => {
    const state = get()
    const flow = state.getFlowOrNull(flowId, identifiersOverride)
    if (!flow) return null
    if (flow.currentStage !== 'transaction') return flow.currentStage
    const transactions = state.getFlowTransactions(flow.flowId, flow)
    if (transactions.length === 0) return 'complete'
    const lastTransaction = transactions[transactions.length - 1]
    if (lastTransaction.status === 'success') return 'complete'
    return 'transaction'
  },
  getFlowTransactionsOrNull: (flowId, identifiersOverride) => {
    const state = get()
    const flow = state.getFlowOrNull(flowId, identifiersOverride)
    if (!flow) return null
    return state.getFlowTransactions(flow.flowId, flow)
  },
  getFlowTransactions: (flowId, identifiersOverride) => {
    const state = get()
    const flow = state.getFlowOrNull(flowId, identifiersOverride)
    if (!flow) throw new Error('No flow found')
    return flow.transactionIds.map((transactionId) => {
      const transactionKey = getTransactionKey({ transactionId, ...flow })
      const transaction = state.transactions.get(transactionKey)
      if (!transaction) throw new Error('No transaction found')
      return transaction
    })
  },
  isFlowResumable: (flowId, identifiersOverride) => {
    const state = get()
    const flow = state.getFlowOrNull(flowId, identifiersOverride)
    if (!flow) return false
    if (getCanRemoveFlow(state, flow)) return false
    return true
  },
  showFlowInput: (flowId, { input, disableBackgroundClick }, identifiersOverride) =>
    set((mutable) => {
      const identifiers = getIdentifiers(mutable, identifiersOverride)
      const flowKey = getFlowKey({ flowId, ...identifiers })
      mutable.flows.set(flowKey, {
        ...identifiers,
        flowId,
        currentStage: 'input',
        currentTransactionIndex: 0,
        transactionIds: [],
        input: input as WritableDraft<TransactionInput>,
        disableBackgroundClick,
      })
      mutable.current.flowId = flowId
    }),
  startFlow: ({ transactions, ...flow }, identifiersOverride) => {
    const { flowId } = flow
    const state = get()
    const identifiers = getIdentifiers(state, identifiersOverride)
    const flowKey = getFlowKey({ flowId, ...identifiers })
    const currentStage = (() => {
      if (flow.intro) return 'intro' as const
      if (flow.input) return 'input' as const
      return 'transaction' as const
    })()
    set((mutable) => {
      mutable.flows.set(flowKey, {
        ...flow,
        ...identifiers,
        transactionIds: [],
        flowId,
        currentTransactionIndex: 0,
        currentStage,
      } as WritableDraft<StoredFlow>)
      mutable.current.flowId = flowId
    })
    state.setFlowTransactions(flowId, transactions, identifiers)
  },
  resumeFlow: (flowId, identifiersOverride) =>
    set((mutable) => {
      const identifiers = getIdentifiers(mutable, identifiersOverride)
      const flowKey = getFlowKey({ flowId, ...identifiers })
      const flow = mutable.flows.get(flowKey)
      // item no longer exists because transactions were completed
      if (!flow) return
      if (flow.intro) flow.currentStage = 'intro'
      mutable.current.flowId = flowId
    }),
  resumeFlowWithCheck: (flowId, { push }, identifiersOverride) => {
    const state = get()
    const identifiers = getIdentifiers(state, identifiersOverride)
    const flowKey = getFlowKey({ flowId, ...identifiers })
    const flow = state.flows.get(flowKey)
    if (!flow) return
    if (flow.resumeLink && getAllTransactionsComplete(state, flow)) {
      push(flow.resumeLink)
      return
    }
    state.resumeFlow(flowId, identifiers)
  },
  cleanupFlowUnsafe: (flowId, identifiersOverride) =>
    set((mutable) => {
      const identifiers = getIdentifiers(mutable, identifiersOverride)
      const flowKey = getFlowKey({ flowId, ...identifiers })
      const flow = mutable.flows.get(flowKey)

      if (!flow) return

      for (const transaction of Object.values(mutable.transactions)) {
        if (
          transaction?.flowId === flowId &&
          identifiers.account === transaction.account &&
          identifiers.sourceChainId === transaction.sourceChainId
        ) {
          mutable.transactions.delete(getTransactionKey(transaction))
        }
      }

      mutable.flows.delete(flowKey)
    }),
  cleanupFlow: (flowId, identifiersOverride) => {
    const state = get()
    const flow = state.getFlowOrNull(flowId, identifiersOverride)
    if (!flow) return
    if (flow.requiresManualCleanup) return
    if (flow.resumable) return
    if (!getAllTransactionsComplete(state, flow)) return
    state.cleanupFlowUnsafe(flowId, identifiersOverride)
  },
  setFlowTransactions: (flowId, transactions, identifiersOverride) =>
    set((mutable) => {
      const identifiers = getIdentifiers(mutable, identifiersOverride)
      const flowKey = getFlowKey({ flowId, ...identifiers })
      const flow = mutable.flows.get(flowKey)
      if (!flow) throw new Error('No flow found')
      flow.transactionIds = []
      for (let i = 0; i < transactions.length; i += 1) {
        const transaction = transactions[i]
        const transactionId = `${transaction.name}-${i}` as const
        flow.transactionIds.push(transactionId)
        const transactionKey = getTransactionKey({ transactionId, ...flow })
        mutable.transactions.set(transactionKey, {
          ...transaction,
          targetChainId: transaction.targetChainId ?? flow.sourceChainId,
          flowId: flow.flowId,
          transactionId,
          sourceChainId: flow.sourceChainId,
          account: flow.account,
          currentHash: null,
          status: 'empty',
          transactionType: null,
        } as WritableDraft<StoredTransaction>)
      }
    }),
  getCurrentFlowTransactions: () => {
    const state = get()
    const flow = getCurrentFlowOrNull(state)
    if (!flow) return []
    return state.getFlowTransactions(flow.flowId, flow)
  },
  getCurrentOrPreviousFlow: () => {
    const state = get()
    const { account, sourceChainId, flowId: flowId_, _previousFlowId } = state.current
    if (!account || !sourceChainId) return { flow: null, isPrevious: false }

    const isPrevious = !flowId_ && !!_previousFlowId
    const flowId = isPrevious ? _previousFlowId : flowId_ ?? ''
    const flowKey = getFlowKey({ account, sourceChainId, flowId })
    const flow = state.flows.get(flowKey)
    if (!flow) return { flow: null, isPrevious: false }
    return { flow, isPrevious }
  },
  setCurrentFlowTransactions: (transactions) => {
    const state = get()
    const flow = getCurrentFlow(state)
    state.setFlowTransactions(flow.flowId, transactions, flow)
  },
  setCurrentFlowStage: (stage) =>
    set((mutable) => {
      const flow = getCurrentFlow(mutable)
      flow.currentStage = stage
    }),
  stopCurrentFlow: () => {
    const flow = getCurrentFlow(get())
    set((mutable) => {
      mutable.current._previousFlowId = flow.flowId
      mutable.current.flowId = null
    })
    setTimeout(() => {
      get().cleanupFlow(flow.flowId, flow)
      set((mutable) => {
        mutable.current._previousFlowId = null
      })
    }, 350)
  },
  attemptCurrentFlowDismiss: () => {
    const state = get()
    const flow = getCurrentFlowOrNull(state)
    if (!flow) return
    if (flow.disableBackgroundClick && flow.currentStage === 'input') return
    return state.stopCurrentFlow()
  },
  incrementCurrentFlowTransactionIndex: () =>
    set((mutable) => {
      const flow = getCurrentFlow(mutable)
      flow.currentTransactionIndex += 1
    }),
  resetCurrentFlowTransactionIndex: () =>
    set((mutable) => {
      const flow = getCurrentFlow(mutable)
      flow.currentTransactionIndex = 0
    }),
})
