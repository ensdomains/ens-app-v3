/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
import { transactions } from '@app/transaction-flow/transaction'
import { Dialog } from '@ensdomains/thorin'
import { Dispatch, useCallback, useMemo } from 'react'
import { DataInputComponents } from '../../../transaction-flow/input'
import { InternalTransactionFlow, TransactionFlowAction } from '../../../transaction-flow/types'
import { IntroStageModal } from './stage/Intro'
import { TransactionStageModal } from './stage/Transaction'

export const TransactionDialogManager = ({
  state,
  dispatch,
}: {
  state: InternalTransactionFlow
  dispatch: Dispatch<TransactionFlowAction>
}) => {
  const onDismiss = useCallback(() => {
    console.log('dismissing')
    dispatch({
      name: 'stopFlow',
    })
  }, [dispatch])

  const InnerComponent = useMemo(() => {
    if (state.key) {
      if (state.input && state.currentFlowStage === 'input') {
        const Component = DataInputComponents[state.input.name]
        return <Component {...{ data: state.input.data, dispatch, onDismiss }} />
      }
      if (state.intro && state.currentFlowStage === 'intro') {
        return (
          <IntroStageModal
            currentStep={state.currentTransaction}
            onSuccess={() => dispatch({ name: 'setFlowStage', payload: 'transaction' })}
            {...{ ...state.intro, onDismiss, transactions: state.transactions }}
          />
        )
      }

      const transactionItem = state.transactions[state.currentTransaction]
      const transaction = transactions[transactionItem.name]
      return (
        <TransactionStageModal
          actionName={transactionItem.name}
          displayItems={transaction.displayItems(transactionItem.data)}
          currentStep={state.currentTransaction}
          stepCount={state.transactions.length}
          transaction={transactionItem}
          txKey={state.key}
          onDismiss={onDismiss}
        />
      )
    }
    return null
  }, [
    state.key,
    state.input,
    state.currentFlowStage,
    state.intro,
    state.currentTransaction,
    state.transactions,
    dispatch,
    onDismiss,
  ])

  return (
    <Dialog variant="blank" open={!!state.key} onDismiss={onDismiss}>
      {InnerComponent}
    </Dialog>
  )
}
