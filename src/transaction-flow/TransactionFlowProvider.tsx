import React, {
  ComponentProps,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Hash } from 'viem'

import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useLocalStorageReducer } from '@app/hooks/useLocalStorage'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { UpdateCallback, useCallbackOnTransaction } from '@app/utils/SyncProvider/SyncProvider'

import { TransactionDialogManager } from '../components/@molecules/TransactionDialogManager/TransactionDialogManager'
import { DataInputComponent, DataInputComponents } from './input'
import { helpers, initialState, reducer } from './reducer'
import { GenericTransaction, InternalTransactionFlow, TransactionFlowItem } from './types'

type ShowDataInput<C extends keyof DataInputComponent> = (
  key: string,
  data: ComponentProps<DataInputComponent[C]>['data'],
  options?: {
    disableBackgroundClick?: boolean
  },
) => void

type UsePreparedDataInput = <C extends keyof DataInputComponent>(name: C) => ShowDataInput<C>

export type CreateTransactionFlow = (key: string, flow: TransactionFlowItem) => void

type ProviderValue = {
  usePreparedDataInput: UsePreparedDataInput
  createTransactionFlow: CreateTransactionFlow
  resumeTransactionFlow: (key: string) => void
  getSelectedKey: () => string | null
  getTransactionIndex: (key: string) => number
  getResumable: (key: string) => boolean
  getTransactionFlowStage: (
    key: string,
  ) => 'undefined' | 'input' | 'intro' | 'transaction' | 'completed'
  getLatestTransaction: (key: string) => GenericTransaction | undefined
  stopCurrentFlow: () => void
  cleanupFlow: (key: string) => void
  setTransactionHashFromUpdate: (key: string, hash: Hash) => void
}

const TransactionContext = React.createContext<ProviderValue>({
  usePreparedDataInput: () => () => {},
  createTransactionFlow: () => {},
  resumeTransactionFlow: () => {},
  getSelectedKey: () => null,
  getTransactionIndex: () => 0,
  getResumable: () => false,
  getTransactionFlowStage: () => 'undefined',
  getLatestTransaction: () => undefined,
  stopCurrentFlow: () => {},
  cleanupFlow: () => {},
  setTransactionHashFromUpdate: () => {},
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

  const getSelectedKey = useCallback(() => state.selectedKey, [state.selectedKey])

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

  const setTransactionHashFromUpdate = useCallback(
    (key: string, hash: Hash) => {
      dispatch({ name: 'setTransactionHashFromUpdate', payload: { key, hash } })
    },
    [dispatch],
  )

  const resumeTransactionFlow = useCallback(
    (key: string) => {
      dispatch({ name: 'resumeFlowWithCheck', key, payload: { push: router.pushWithHistory } })
    },
    [dispatch, router.pushWithHistory],
  )

  const providerValue: ProviderValue = useMemo(() => {
    return {
      usePreparedDataInput: <C extends keyof DataInputComponent>(name: C) => {
        const { address } = useAccountSafely()
        if (address) (DataInputComponents[name] as any).render.preload()
        const func: ShowDataInput<C> = (key, data, options = {}) =>
          dispatch({
            name: 'showDataInput',
            payload: {
              input: { name, data },
              disableBackgroundClick: options.disableBackgroundClick,
            },
            key,
          })
        return func
      },
      createTransactionFlow: ((key, flow) =>
        dispatch({
          name: 'startFlow',
          key,
          payload: flow,
        })) as CreateTransactionFlow,
      resumeTransactionFlow,
      getSelectedKey,
      getTransactionIndex,
      getTransaction,
      getResumable,
      getTransactionFlowStage,
      getLatestTransaction,
      stopCurrentFlow: () => dispatch({ name: 'stopFlow' }),
      cleanupFlow: (key: string) => dispatch({ name: 'forceCleanupTransaction', payload: key }),
      setTransactionHashFromUpdate,
    }
  }, [
    dispatch,
    resumeTransactionFlow,
    getResumable,
    getSelectedKey,
    getTransactionIndex,
    getLatestTransaction,
    getTransactionFlowStage,
    getTransaction,
    setTransactionHashFromUpdate,
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
