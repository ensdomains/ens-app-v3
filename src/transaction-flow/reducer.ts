/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
import {
  BaseInternalTransactionFlow,
  InternalTransactionFlow,
  TransactionFlowAction,
  TransactionFlowStage,
} from './types'

export const initialState: InternalTransactionFlow = {
  key: null,
}

export const reducer = (draft: InternalTransactionFlow, action: TransactionFlowAction) => {
  switch (action.name) {
    case 'showDataInput': {
      draft = draft as BaseInternalTransactionFlow
      draft.key = action.payload.key
      draft.currentFlowStage = 'input'
      draft.currentTransaction = 0
      draft.input = action.payload.input
      draft.transactions = []
      break
    }
    case 'startFlow': {
      let currentFlowStage: TransactionFlowStage = 'transaction'
      if (action.payload.intro) {
        currentFlowStage = 'intro'
      }
      if (action.payload.input) {
        currentFlowStage = 'input'
      }
      draft = {
        ...action.payload,
        currentTransaction: 0,
        currentFlowStage,
      }
      break
    }
    case 'setTransactions': {
      draft = draft as BaseInternalTransactionFlow
      draft.transactions = action.payload
      break
    }
    case 'setFlowStage': {
      draft = draft as BaseInternalTransactionFlow
      draft.currentFlowStage = action.payload
      break
    }
    case 'stopFlow': {
      draft.key = null
      break
    }
  }
}
