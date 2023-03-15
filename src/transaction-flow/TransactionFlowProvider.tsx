import React, {
  ComponentProps,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useLocalStorageReducer } from '@app/hooks/useLocalStorage'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { UpdateCallback, useCallbackOnTransaction } from '@app/utils/SyncProvider'

import { TransactionDialogManager } from '../components/@molecules/TransactionDialogManager/TransactionDialogManager'
import type { DataInputComponent } from './input'
import { helpers, initialState, reducer } from './reducer'
import { GenericTransaction, InternalTransactionFlow, TransactionFlowItem } from './types'

type ShowDataInput = <C extends keyof DataInputComponent>(
  key: string,
  name: C,
  data: ComponentProps<DataInputComponent[C]>['data'],
  options?: {
    disableBackgroundClick?: boolean
  },
) => void

export type CreateTransactionFlow = (key: string, flow: TransactionFlowItem) => void

type ProviderValue = {
  showDataInput: ShowDataInput
  createTransactionFlow: CreateTransactionFlow
  resumeTransactionFlow: (key: string) => void
  getTransactionIndex: (key: string) => number
  getResumable: (key: string) => boolean
  getTransactionFlowStage: (
    key: string,
  ) => 'undefined' | 'input' | 'intro' | 'transaction' | 'completed'
  getLatestTransaction: (key: string) => GenericTransaction | undefined
  stopCurrentFlow: () => void
  cleanupFlow: (key: string) => void
}

const TransactionContext = React.createContext<ProviderValue>({
  showDataInput: () => {},
  createTransactionFlow: () => {},
  resumeTransactionFlow: () => {},
  getTransactionIndex: () => 0,
  getResumable: () => false,
  getTransactionFlowStage: () => 'undefined',
  getLatestTransaction: () => undefined,
  stopCurrentFlow: () => {},
  cleanupFlow: () => {},
})

export const TransactionFlowProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouterWithHistory()

  const [state, dispatch] = useLocalStorageReducer(
    'tx-flow',
    reducer,
    initialState,
    (current: InternalTransactionFlow) => {
      const updatedItems = current.items
      const { getCanRemoveItem } = helpers(current)
      // eslint-disable-next-line guard-for-in
      for (const key in updatedItems) {
        const item = updatedItems[key]
        if (getCanRemoveItem(item)) {
          delete updatedItems[key]
        }
      }
      return {
        items: updatedItems,
        selectedKey: null,
      }
    },
  )

  const getTransactionIndex = useCallback(
    (key: string) => state.items[key]?.currentTransaction || 0,
    [state.items],
  )

  const getTransactionFlowStage = useCallback(
    (key: string) => {
      const item = state.items[key]
      if (!item) return 'undefined'
      if (item.currentFlowStage !== 'transaction') return item.currentFlowStage
      const { transactions } = item
      if (transactions.length === 0) return 'completed'
      const lastTransaction = transactions[transactions.length - 1]
      if (lastTransaction.stage === 'complete') return 'completed'
      return 'transaction'
    },
    [state.items],
  )

  const getTransaction = useCallback(
    (key: string) => {
      return state.items[key]
    },
    [state.items],
  )

  const getResumable = useCallback(
    (key: string) => {
      const { getSelectedItem, getCanRemoveItem } = helpers({
        selectedKey: key,
        items: state.items,
      })
      const item = getSelectedItem()
      if (!item) return false
      if (getCanRemoveItem(item)) return false
      return true
    },
    [state.items],
  )

  const updateCallback = useCallback<UpdateCallback>(
    (transaction) => {
      if (transaction.status !== 'pending' && transaction.key) {
        dispatch({
          name: 'setTransactionStageFromUpdate',
          payload: transaction,
        })
      }
    },
    [dispatch],
  )

  useCallbackOnTransaction(updateCallback)

  const getLatestTransaction = useCallback(
    (key: string) => {
      const { getSelectedItem } = helpers({
        selectedKey: key,
        items: state.items,
      })
      const item = getSelectedItem()
      if (!item) return undefined
      return item.transactions[item.currentTransaction]
    },
    [state.items],
  )

  const resumeTransactionFlow = useCallback(
    (key: string) => {
      dispatch({ name: 'resumeFlowWithCheck', key, payload: { push: router.pushWithHistory } })
    },
    [dispatch, router.pushWithHistory],
  )

  const providerValue: ProviderValue = useMemo(() => {
    return {
      showDataInput: ((key, name, data, options = {}) =>
        dispatch({
          name: 'showDataInput',
          payload: {
            input: { name, data },
            disableBackgroundClick: options.disableBackgroundClick,
          },
          key,
        })) as ShowDataInput,
      createTransactionFlow: ((key, flow) =>
        dispatch({
          name: 'startFlow',
          key,
          payload: flow,
        })) as CreateTransactionFlow,
      resumeTransactionFlow,
      getTransactionIndex,
      getTransaction,
      getResumable,
      getTransactionFlowStage,
      getLatestTransaction,
      stopCurrentFlow: () => dispatch({ name: 'stopFlow' }),
      cleanupFlow: (key: string) => dispatch({ name: 'forceCleanupTransaction', payload: key }),
    }
  }, [
    dispatch,
    resumeTransactionFlow,
    getResumable,
    getTransactionIndex,
    getLatestTransaction,
    getTransactionFlowStage,
    getTransaction,
  ])

  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (state.selectedKey) {
      setSelectedKey(state.selectedKey)
    } else {
      timeout = setTimeout(() => {
        setSelectedKey((prev) => {
          if (prev) dispatch({ name: 'cleanupTransaction', payload: prev })
          return null
        })
      }, 350)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [state.selectedKey, dispatch])

  return (
    <TransactionContext.Provider value={providerValue}>
      {children}
      <TransactionDialogManager {...{ state, dispatch, selectedKey }} />
    </TransactionContext.Provider>
  )
}

export const useTransactionFlow = () => {
  const context = useContext(TransactionContext)
  return context
}
