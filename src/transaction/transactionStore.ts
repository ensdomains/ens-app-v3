/* eslint-disable no-param-reassign */

import { watchAccount, watchChainId } from '@wagmi/core'
import { del as idbDel, get as idbGet, set as idbSet } from 'idb-keyval'
import { WritableDraft } from 'immer/dist/internal'
import { create, StateCreator } from 'zustand'
import { persist, StorageValue, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { parse, stringify } from '@app/utils/query/persist'
import { wagmiConfig } from '@app/utils/query/wagmi'

import { getFlowKey, getTransactionKey } from './key'
import { transactionAnalyticsListener } from './transactionAnalyticsListener'
import { transactionReceiptListener } from './transactionReceiptListener'
import type {
  StoredTransaction,
  StoredTransactionStatus,
  TransactionStore,
  TransactionStoreIdentifiers,
} from './types'

const getIdentifiers = (
  state: TransactionStore,
  identifiersOverride: TransactionStoreIdentifiers | undefined,
) => {
  const { account, chainId } = identifiersOverride ?? state._internal.current
  if (!account) throw new Error('No account found')
  if (!chainId) throw new Error('No chainId found')
  return { account, chainId }
}

const getCurrentFlow = (state: TransactionStore) => {
  const { account, chainId, flowId } = state._internal.current
  if (!flowId) throw new Error('No flowId found')
  if (!account) throw new Error('No account found')
  if (!chainId) throw new Error('No chainId found')
  const flowKey = getFlowKey({ flowId, chainId, account })
  const flow = state._internal.flows[flowKey]
  if (!flow) throw new Error('No flow found')
  return flow
}
const getCurrentFlowOrNull = (state: TransactionStore) => {
  const { account, chainId, flowId } = state._internal.current
  if (!account || !chainId || !flowId) return null
  const flowKey = getFlowKey({ flowId, chainId, account })
  return state._internal.flows[flowKey] ?? null
}

const initialiser: StateCreator<
  TransactionStore,
  [
    ['zustand/persist', unknown],
    ['zustand/subscribeWithSelector', never],
    ['zustand/immer', never],
  ],
  [],
  TransactionStore
> = (set, get) => ({
  _internal: {
    flows: {},
    transactions: {},
    current: {
      account: null,
      chainId: null,
      flowId: null,
      _previousFlowId: null,
    },
    lastTransactionChange: null,
  },
  flow: {
    helpers: {
      getAllTransactionsComplete: (flow) => {
        const state = get()
        const identifiers = {
          account: flow.account,
          chainId: flow.chainId,
          flowId: flow.flowId,
        }
        return flow.transactionIds.every((transactionId) => {
          const transactionKey = getTransactionKey({ transactionId, ...identifiers })
          const transaction = state._internal.transactions[transactionKey]
          return transaction?.status === 'success'
        })
      },
      getNoTransactionsStarted: (flow) => {
        const state = get()
        const identifiers = {
          account: flow.account,
          chainId: flow.chainId,
          flowId: flow.flowId,
        }
        return flow.transactionIds.every((transactionId) => {
          const transactionKey = getTransactionKey({ transactionId, ...identifiers })
          const transaction = state._internal.transactions[transactionKey]
          return transaction?.status === 'empty'
        })
      },
      getCanRemoveFlow: (flow) => {
        if (flow.requiresManualCleanup) return false
        if (!flow.transactionIds || flow.transactionIds.length === 0) return true
        if (!flow.resumable) return true

        const { helpers } = get().flow
        if (helpers.getAllTransactionsComplete(flow)) return true
        return helpers.getNoTransactionsStarted(flow)
      },
    },
    showInput: (flowId, { input, disableBackgroundClick }, identifiersOverride) =>
      set((state) => {
        const identifiers = getIdentifiers(state, identifiersOverride)
        const flowKey = getFlowKey({ flowId, ...identifiers })
        state._internal.flows[flowKey] = {
          ...identifiers,
          flowId,
          currentStage: 'input',
          currentTransaction: 0,
          transactionIds: [],
          input: input as WritableDraft<typeof input>,
          disableBackgroundClick,
        }
        state._internal.current.flowId = flowId
      }),
    start: (flowId, flow, identifiersOverride) =>
      set((state) => {
        const identifiers = getIdentifiers(state, identifiersOverride)
        const flowKey = getFlowKey({ flowId, ...identifiers })
        const currentStage = (() => {
          if (flow.intro) return 'intro' as const
          if (flow.input) return 'input' as const
          return 'transaction' as const
        })()
        state._internal.flows[flowKey] = {
          ...(flow as WritableDraft<typeof flow>),
          ...identifiers,
          flowId,
          currentTransaction: 0,
          currentStage,
        }
        state._internal.current.flowId = flowId
      }),
    resume: (flowId, identifiersOverride) =>
      set((state) => {
        const identifiers = getIdentifiers(state, identifiersOverride)
        const flowKey = getFlowKey({ flowId, ...identifiers })
        const flow = state._internal.flows[flowKey]
        // item no longer exists because transactions were completed
        if (!flow) return
        if (flow.intro) flow.currentStage = 'intro'
        state._internal.current.flowId = flowId
      }),
    resumeWithCheck: (flowId, { push }, identifiersOverride) =>
      set((state) => {
        const identifiers = getIdentifiers(state, identifiersOverride)
        const flowKey = getFlowKey({ flowId, ...identifiers })
        const flow = state._internal.flows[flowKey]
        // item no longer exists because transactions were completed
        if (!flow) return
        if (flow.resumeLink && state.flow.helpers.getAllTransactionsComplete(flow)) {
          push(flow.resumeLink)
          return
        }
        state.flow.resume(flowId, identifiers)
      }),
    cleanup: (flowId, identifiersOverride) =>
      set((state) => {
        const identifiers = getIdentifiers(state, identifiersOverride)
        const flowKey = getFlowKey({ flowId, ...identifiers })
        delete state._internal.flows[flowKey]
      }),
    getResumable: (flowId, identifiersOverride) => {
      const state = get()
      const identifiers = getIdentifiers(state, identifiersOverride)
      const flowKey = getFlowKey({ flowId, ...identifiers })
      const flow = state._internal.flows[flowKey]
      if (!flow) return false
      if (state.flow.helpers.getCanRemoveFlow(flow)) return false
      return true
    },
    current: {
      setTransactions: (transactions) =>
        set((state) => {
          const flow = getCurrentFlow(state)
          flow.transactionIds = []
          for (let i = 0; i < transactions.length; i += 1) {
            const transaction = transactions[i]
            const transactionId = `${transaction.name}-${i}`
            flow.transactionIds.push(transactionId)
            const transactionKey = getTransactionKey({ transactionId, ...flow })
            state._internal.transactions[transactionKey] = {
              ...(transaction as WritableDraft<typeof transaction>),
              flowId: flow.flowId,
              transactionId,
              chainId: flow.chainId,
              account: flow.account,
              currentHash: null,
              status: 'empty',
              transactionType: null,
            }
          }
        }),
      setStage: ({ stage }) =>
        set((state) => {
          const flow = getCurrentFlow(state)
          flow.currentStage = stage
        }),
      stop: () =>
        set((state) => {
          const flow = getCurrentFlow(state)
          state._internal.current._previousFlowId = flow.flowId
          state._internal.current.flowId = null
          setTimeout(() => {
            state._internal.current._previousFlowId = null
            state.flow.cleanup(flow.flowId)
          }, 350)
        }),
      incrementTransaction: () =>
        set((state) => {
          const flow = getCurrentFlow(state)
          flow.currentTransaction += 1
        }),
      resetTransactionIndex: () =>
        set((state) => {
          const flow = getCurrentFlow(state)
          flow.currentTransaction = 0
        }),
      selectedOrPrevious: () => {
        const state = get()
        const { account, chainId, flowId: flowId_, _previousFlowId } = state._internal.current
        if (!account || !chainId) return { flow: null, isPrevious: false }

        const isPrevious = !flowId_ && !!_previousFlowId
        const flowId = isPrevious ? _previousFlowId : flowId_ ?? ''
        const flowKey = getFlowKey({ account, chainId, flowId })
        const flow = state._internal.flows[flowKey]
        if (!flow) return { flow: null, isPrevious: false }
        return { flow, isPrevious }
      },
      attemptDismiss: () => {
        const state = get()
        const flow = getCurrentFlowOrNull(state)
        if (!flow) return
        if (flow.disableBackgroundClick && flow.currentStage === 'input') return
        return state.flow.current.stop()
      },
      getTransactions: () => {
        const state = get()
        const flow = getCurrentFlowOrNull(state)
        if (!flow) return []
        return flow.transactionIds.map((transactionId) => {
          const transactionKey = getTransactionKey({ transactionId, ...flow })
          const transaction = state._internal.transactions[transactionKey]
          if (!transaction) throw new Error('No transaction found')
          return transaction
        })
      },
    },
  },
  transaction: {
    setStatus: (identifiers, status) =>
      set((state) => {
        const transactionKey = getTransactionKey(identifiers)
        const transaction = state._internal.transactions[transactionKey]
        if (!transaction) throw new Error('No transaction found')
        transaction.status = status
        // important: set lastTransactionChange for transaction update consumers
        state._internal.lastTransactionChange = transaction
      }),
    setHash: (identifiers, hash) =>
      set((state) => {
        const transactionKey = getTransactionKey(identifiers)
        const transaction = state._internal.transactions[transactionKey]
        if (!transaction) throw new Error('No transaction found')
        transaction.currentHash = hash
        if (transaction.status === 'empty') state.transaction.setStatus(identifiers, 'pending')
        // don't set lastTransactionChange for hash update since nothing else is updated
      }),
    setSubmission: (identifiers, submission) =>
      set((state) => {
        const transactionKey = getTransactionKey(identifiers)
        const transaction = state._internal.transactions[transactionKey]
        if (!transaction) throw new Error('No transaction found')
        transaction.submission = {
          input: submission.input,
          timestamp: submission.timestamp,
          nonce: submission.nonce,
        }
        transaction.transactionType = submission.transactionType
        transaction.status = 'waitingForUser'
      }),
    getAll: () => {
      const state = get()
      const identifiers = getIdentifiers(state, undefined)
      return Object.values(state._internal.transactions).filter(
        (x): x is StoredTransaction =>
          !!x && x.chainId === identifiers.chainId && x.account === identifiers.account,
      )
    },
    getByStatus: <status extends StoredTransactionStatus>(status: status) => {
      const state = get()
      const identifiers = getIdentifiers(state, undefined)
      return Object.values(state._internal.transactions).filter(
        (x): x is StoredTransaction<status> =>
          !!x &&
          x.status === status &&
          x.chainId === identifiers.chainId &&
          x.account === identifiers.account,
      )
    },
  },
})

export const useTransactionStore = create(
  persist(subscribeWithSelector(immer(initialiser)), {
    name: 'transaction-data',
    storage: {
      getItem: async (name) => {
        const value = await idbGet(name)
        return value ? parse<StorageValue<TransactionStore>>(value) : null
      },
      setItem: async (name, value) => {
        const stringValue = stringify(value)
        await idbSet(name, stringValue)
      },
      removeItem: async (name) => {
        await idbDel(name)
      },
    },
  }),
)

export type UseTransactionStore = typeof useTransactionStore

useTransactionStore.subscribe(...transactionReceiptListener(useTransactionStore))
useTransactionStore.subscribe(...transactionAnalyticsListener)

watchAccount(wagmiConfig, {
  onChange: (account) => {
    useTransactionStore.setState((state) => {
      state._internal.current.account = account.address ?? null
      state._internal.current.flowId = null
    })
  },
})
watchChainId(wagmiConfig, {
  onChange: (chainId) => {
    useTransactionStore.setState((state) => {
      state._internal.current.chainId = chainId
      state._internal.current.flowId = null
    })
  },
})
