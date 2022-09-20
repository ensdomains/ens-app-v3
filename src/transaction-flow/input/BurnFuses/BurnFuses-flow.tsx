import { Dispatch } from 'react'

import type { NamedFusesToBurn } from '@ensdomains/ensjs'

import BurnFusesContent from '@app/components/@molecules/BurnFuses/BurnFusesContent'
import { useGetFuseData } from '@app/hooks/useGetFuseData'

import { makeTransactionItem } from '../../transaction'
import { TransactionDialogPassthrough, TransactionFlowAction } from '../../types'

type Data = {
  name: string
}

export type Props = {
  data: Data
  onDismiss: () => void
  dispatch: Dispatch<TransactionFlowAction>
} & TransactionDialogPassthrough

export const BurnFuses = ({ data, onDismiss, dispatch }: Props) => {
  const { name } = data
  const { fuseData } = useGetFuseData((name as string) || '')

  const onSubmit = (selectedFuses: NamedFusesToBurn, permissions: string[]) => {
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('burnFuses', {
          name: name as string,
          selectedFuses: selectedFuses as NamedFusesToBurn,
          permissions,
        }),
      ],
    })
    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }

  return <BurnFusesContent fuseData={fuseData} onDismiss={onDismiss} onSubmit={onSubmit} />
}

export default BurnFuses
