/* eslint-disable default-case */

/* eslint-disable no-param-reassign */
import { Dispatch, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import usePrevious from 'react-use/lib/usePrevious'
import { useAccount } from 'wagmi'

import { Dialog } from '@ensdomains/thorin'

import { transactions } from '@app/transaction-flow/transaction'

import { DataInputComponents } from '../../../transaction-flow/input'
import { InternalTransactionFlow, TransactionFlowAction } from '../../../transaction-flow/types'
import { IntroStageModal } from './stage/Intro'
import { TransactionStageModal } from './stage/TransactionStageModal'

export const useResetSelectedKey = (dispatch: any) => {
  const { address } = useAccount()
  const prevAddress = usePrevious(address)

  useEffect(() => {
    if (prevAddress && prevAddress !== address) {
      dispatch({
        name: 'stopFlow',
      })
    }
  }, [prevAddress, address, dispatch])
}

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

  useResetSelectedKey(dispatch)

  const onDismiss = useCallback(() => {
    dispatch({
      name: 'stopFlow',
    })
  }, [dispatch])

  const onBackgroundDismiss = useCallback(() => {
    if (selectedItem?.disableBackgroundClick) return
    dispatch({
      name: 'stopFlow',
    })
  }, [dispatch, selectedItem?.disableBackgroundClick])

  const InnerComponent = useMemo(() => {
    if (selectedKey && selectedItem) {
      if (selectedItem.input && selectedItem.currentFlowStage === 'input') {
        const Component = DataInputComponents[selectedItem.input.name]
        return (
          <Component
            {...{
              data: selectedItem.input.data,
              transactions: selectedItem.transactions,
              dispatch,
              onDismiss,
            }}
          />
        )
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
          helper={transaction.helper?.(transactionItem.data, t)}
          currentStep={selectedItem.currentTransaction}
          stepCount={selectedItem.transactions.length}
          transaction={transactionItem}
          txKey={selectedKey}
          backToInput={transaction.backToInput ?? false}
          {...{ dispatch, onDismiss }}
        />
      )
    }
    return null
  }, [selectedKey, selectedItem, onDismiss, dispatch, t])

  return (
    <Dialog
      variant="blank"
      open={!!state.selectedKey}
      onDismiss={onBackgroundDismiss}
      onClose={onDismiss}
    >
      {InnerComponent}
    </Dialog>
  )
}
