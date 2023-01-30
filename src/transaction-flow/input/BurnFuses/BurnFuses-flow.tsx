import { Dispatch } from 'react'

import type { ChildFuses } from '@ensdomains/ensjs'

import BurnFusesContent from '@app/components/@molecules/BurnFuses/BurnFusesContent'
import { useGetWrapperData } from '@app/hooks/useGetWrapperData'
import { deleteProperties } from '@app/utils/utils'

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
  const { wrapperData } = useGetWrapperData((name as string) || '')

  const onSubmit = (selectedFuses: ChildFuses['fuse'][], permissions: string[]) => {
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('burnFuses', {
          name: name as string,
          selectedFuses,
          permissions,
        }),
      ],
    })
    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }

  return (
    <BurnFusesContent
      fuseData={
        wrapperData
          ? deleteProperties(wrapperData.child, 'unnamed', 'CAN_DO_EVERYTHING')
          : undefined
      }
      onDismiss={onDismiss}
      onSubmit={onSubmit}
    />
  )
}

export default BurnFuses
