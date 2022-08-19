/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
import { transactions } from '@app/transaction-flow/transaction'
import { Dialog } from '@ensdomains/thorin'
import { Dispatch, useCallback, useMemo } from 'react'
import { DataInputComponents } from '../../../transaction-flow/input'
import { InternalTransactionFlow, TransactionFlowAction } from '../../../transaction-flow/types'
import { IntroStageModal } from './stage/Intro'
import { TransactionStageModalNew } from './stage/TransactionStageModalNew'

export const TransactionDialogManager = ({
  state,
  dispatch,
  selectedKey,
}: {
  state: InternalTransactionFlow
  dispatch: Dispatch<TransactionFlowAction>
  selectedKey: string | null
}) => {
  const selectedItem = useMemo(
    () => (selectedKey ? state.items[selectedKey] : null),
    [selectedKey, state.items],
  )

  const onDismiss = useCallback(() => {
    dispatch({
      name: 'stopFlow',
    })
  }, [dispatch])

  const InnerComponent = useMemo(() => {
    if (selectedKey && selectedItem) {
      if (selectedItem.input && selectedItem.currentFlowStage === 'input') {
        const Component = DataInputComponents[selectedItem.input.name]
        return <Component {...{ data: selectedItem.input.data, dispatch, onDismiss }} />
      }
      if (selectedItem.intro && selectedItem.currentFlowStage === 'intro') {
        return (
          <IntroStageModal
            currentStep={selectedItem.currentTransaction}
            onSuccess={() => dispatch({ name: 'setFlowStage', payload: 'transaction' })}
            {...{
              ...selectedItem.intro,
              onDismiss,
              transactions: selectedItem.transactions,
            }}
          />
        )
      }

      const transactionItem = selectedItem.transactions[selectedItem.currentTransaction]
      const transaction = transactions[transactionItem.name]

      return (
        <TransactionStageModalNew
          actionName={transactionItem.name}
          displayItems={transaction.displayItems(transactionItem.data)}
          currentStep={selectedItem.currentTransaction}
          stepCount={selectedItem.transactions.length}
          transaction={transactionItem}
          txKey={selectedKey}
          dispatch={dispatch}
          onDismiss={onDismiss}
        />
      )
    }
    return null
  }, [selectedKey, selectedItem, onDismiss, dispatch])

  return (
    <Dialog variant="blank" open={!!state.selectedKey} onDismiss={onDismiss}>
      {InnerComponent}
    </Dialog>
  )
}
