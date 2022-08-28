/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
import { useTranslation } from 'react-i18next'
import { transactions } from '@app/transaction-flow/transaction'
import { Dialog } from '@ensdomains/thorin'
import { Dispatch, useCallback, useMemo } from 'react'
import { DataInputComponents } from '../../../transaction-flow/input'
import { InternalTransactionFlow, TransactionFlowAction } from '../../../transaction-flow/types'
import { IntroStageModal } from './stage/Intro'
import { TransactionStageModal } from './stage/TransactionStageModal'

export const TransactionDialogManager = ({
  state,
  dispatch,
  selectedKey,
}: {
  state: InternalTransactionFlow
  dispatch: Dispatch<TransactionFlowAction>
  selectedKey: string | null
}) => {
  const { t } = useTranslation()
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
        const currentTx = selectedItem.transactions[selectedItem.currentTransaction]
        const currentStep =
          currentTx.stage === 'complete'
            ? selectedItem.currentTransaction + 1
            : selectedItem.currentTransaction

        const stepStatus =
          currentTx.stage === 'sent' || currentTx.stage === 'failed' ? 'inProgress' : 'notStarted'

        return (
          <IntroStageModal
            stepStatus={stepStatus}
            currentStep={currentStep}
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
        <TransactionStageModal
          actionName={transactionItem.name}
          displayItems={transaction.displayItems(transactionItem.data, t)}
          currentStep={selectedItem.currentTransaction}
          stepCount={selectedItem.transactions.length}
          transaction={transactionItem}
          txKey={selectedKey}
          dispatch={dispatch}
          onDismiss={onDismiss}
          backToInput={transaction.backToInput ?? false}
        />
      )
    }
    return null
  }, [selectedKey, selectedItem, onDismiss, dispatch, t])

  return (
    <Dialog variant="blank" open={!!state.selectedKey} onDismiss={onDismiss}>
      {InnerComponent}
      <Dialog.CloseButton onClick={onDismiss} />
    </Dialog>
  )
}
