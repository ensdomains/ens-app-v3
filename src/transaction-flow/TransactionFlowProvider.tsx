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

import { TransactionDialogManager } from '../components/@molecules/TransactionDialogManager/TransactionDialogManager'
import type { DataInputComponent } from './input'
import { helpers, initialState, reducer } from './reducer'
import { InternalTransactionFlow, TransactionFlowItem } from './types'

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

  console.log('state: ', state)

  const getTransactionIndex = useCallback(
    (key: string) => state.items[key]?.currentTransaction || 0,
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

  console.log('providervalue: ', providerValue)

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
