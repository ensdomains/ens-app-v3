import React, { ComponentProps, ReactNode, useContext, useMemo } from 'react'
import { useImmerReducer } from 'use-immer'
import { TransactionDialogManager } from '../components/@molecules/TransactionDialogManager/TransactionDialogManager'
import { DataInputComponent } from './input'
import { initialState, reducer } from './reducer'

type ShowDataInput = <C extends keyof DataInputComponent>(
  key: string,
  name: C,
  data: ComponentProps<DataInputComponent[C]>['data'],
) => void

type ProviderValue = {
  showDataInput: ShowDataInput
  createTransactionFlow: any
  createTransaction: any
}

const TransactionContext = React.createContext<ProviderValue>({
  showDataInput: () => {},
  createTransactionFlow: () => {},
  createTransaction: () => {},
})

export const TransactionFlowProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState)

  const providerValue = useMemo(() => {
    return {
      showDataInput: ((key, name, data) =>
        dispatch({
          name: 'showDataInput',
          payload: { key, input: { name, data } },
        })) as ShowDataInput,
    }
  }, [dispatch])

  return (
    <TransactionContext.Provider value={providerValue}>
      {children}
      <TransactionDialogManager {...{ state, dispatch }} />
    </TransactionContext.Provider>
  )
}

export const useTransactionFlow = () => {
  const context = useContext(TransactionContext)
  return context
}
