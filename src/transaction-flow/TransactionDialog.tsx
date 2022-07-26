/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
import { Button, Dialog } from '@ensdomains/thorin'
import { Dispatch, useEffect } from 'react'
import { useImmerReducer } from 'use-immer'
import { DataInputComponents } from './input'
import {
  InternalTransactionFlow,
  TransactionDialogAction,
  TransactionDialogProps,
  TransactionFlowAction,
} from './types'

const initialState: TransactionDialogProps = {
  children: () => null,
  open: false,
  variant: 'actionable',
  trailing: {
    children: 'Confirm',
    shadowless: true,
  },
  leading: {
    children: 'Cancel',
    variant: 'secondary',
    tone: 'grey',
    shadowless: true,
  },
}

const reducer = (draft: TransactionDialogProps, action: TransactionDialogAction) => {
  switch (action.name) {
    case 'setLeadingProps':
      draft.leading = action.payload
      break
    case 'setTrailingProps':
      draft.trailing = action.payload
      break
    case 'addLeadingProps':
      draft.leading = {
        ...(draft.leading as any),
        ...(action.payload as any),
      }
      break
    case 'addTrailingProps':
      draft.trailing = {
        ...(draft.trailing as any),
        ...(action.payload as any),
      }
      break
    case 'setupInputStage':
      draft.children = action.payload.children
      draft.trailing = {
        ...(draft.trailing as any),
        ...(action.payload.trailing as any),
      }
      draft.open = true
      break
    case 'setOpen':
      draft.open = action.payload
      break
  }
}

export const TransactionDialog = ({
  state,
  dispatch,
}: {
  state: InternalTransactionFlow
  dispatch: Dispatch<TransactionFlowAction>
}) => {
  const [dialog, dispatchDialog] = useImmerReducer(reducer, initialState)

  const handleDismiss = () => {
    dispatchDialog({
      name: 'setOpen',
      payload: false,
    })
    dispatch({
      name: 'stopFlow',
    })
  }

  console.log(dialog)

  useEffect(() => {
    if (state.key !== null) {
      if (state.currentFlowStage === 'input') {
        dispatchDialog({
          name: 'setupInputStage',
          payload: {
            children: () =>
              DataInputComponents[state.input!.name]({
                data: state.input!.data,
                dispatch,
                dispatchDialog,
              }),
            trailing: {
              onClick: () =>
                dispatch({
                  name: 'setFlowStage',
                  payload: 'transaction',
                }),
            } as any,
          },
        })
      }
    }
  }, [dispatch, state.key, state.currentFlowStage, state.input, dispatchDialog])

  const Inner = () => (dialog.children ? dialog.children() : null)

  console.log(dialog.children)

  const Leading = (
    <Button
      {...{
        ...(dialog.leading as any),
        onClick: handleDismiss,
      }}
    />
  )
  const Trailing = <Button {...dialog.trailing} />

  return (
    <Dialog
      {...{
        ...dialog,
        leading: Leading,
        trailing: Trailing,
        onDismiss: handleDismiss,
      }}
    >
      <Inner />
    </Dialog>
  )
}
