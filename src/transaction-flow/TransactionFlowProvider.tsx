import { useLocalStorageReducer } from '@app/hooks/useLocalStorage'
import React, { ComponentProps, ReactNode, useCallback, useContext, useMemo } from 'react'
import { TransactionDialogManager } from '../components/@molecules/TransactionDialogManager/TransactionDialogManager'
import { DataInputComponent } from './input'
import { initialState, reducer } from './reducer'
import { InternalTransactionFlow, TransactionFlowItem } from './types'
import { getSelectedFlowItem } from './utils'

type ShowDataInput = <C extends keyof DataInputComponent>(
  key: string,
  name: C,
  data: ComponentProps<DataInputComponent[C]>['data'],
) => void

type CreateTransactionFlow = (key: string, flow: TransactionFlowItem) => void

type ProviderValue = {
  showDataInput: ShowDataInput
  createTransactionFlow: CreateTransactionFlow
  resumeTransactionFlow: (key: string) => void
  getTransactionIndex: (key: string) => number
  getResumable: (key: string) => boolean
}

const TransactionContext = React.createContext<ProviderValue>({
  showDataInput: () => {},
  createTransactionFlow: () => {},
  resumeTransactionFlow: () => {},
  getTransactionIndex: () => 0,
  getResumable: () => false,
})

export const TransactionFlowProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useLocalStorageReducer(
    'tx-flow',
    reducer,
    initialState,
    (current: InternalTransactionFlow) => {
      const updatedItems = current.items
      // eslint-disable-next-line guard-for-in
      for (const key in updatedItems) {
        const item = updatedItems[key]
        const { length = 0 } = item.transactions
        const inx = item.currentTransaction
        if (
          inx + 1 > length ||
          (inx + 1 === length && item.currentTransactionComplete) ||
          !item.resumable
        ) {
          delete updatedItems[key]
        }
      }
      return {
        items: updatedItems,
        selectedKey: null,
      }
    },
  )
  const selectedFlowItem = getSelectedFlowItem(state)

  const getTransactionIndex = useCallback(
    (key: string) => state.items[key]?.currentTransaction || 0,
    [state.items],
  )

  const getResumable = useCallback(
    (key: string) => {
      const item = state.items[key]
      if (!item) return false
      if (!item.resumable) return false
      const { length = 0 } = item.transactions
      const inx = item.currentTransaction
      if (inx + 1 > length) return false
      if (inx + 1 === length && item.currentTransactionComplete) return false
      return true
    },
    [state.items],
  )

  const providerValue = useMemo(() => {
    return {
      showDataInput: ((key, name, data) =>
        dispatch({
          name: 'showDataInput',
          payload: { input: { name, data } },
          key,
        })) as ShowDataInput,
      createTransactionFlow: ((key, flow) =>
        dispatch({
          name: 'startFlow',
          key,
          payload: flow,
        })) as CreateTransactionFlow,
      resumeTransactionFlow: (key: string) => dispatch({ name: 'resumeFlow', key }),
      getTransactionIndex,
      getResumable,
    }
  }, [dispatch, getResumable, getTransactionIndex])

  return (
    <TransactionContext.Provider value={providerValue}>
      {children}
      <TransactionDialogManager {...{ state, dispatch, selectedFlowItem }} />
    </TransactionContext.Provider>
  )
}

export const useTransactionFlow = () => {
  const context = useContext(TransactionContext)
  return context
}
