/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
import { InternalTransactionFlow, TransactionFlowAction, TransactionFlowStage } from './types'

export const initialState: InternalTransactionFlow = {
  selectedKey: null,
  items: {},
}

export const reducer = (draft: InternalTransactionFlow, action: TransactionFlowAction) => {
  switch (action.name) {
    case 'showDataInput': {
      draft.items[action.key] = {
        currentFlowStage: 'input',
        currentTransaction: 0,
        currentTransactionComplete: false,
        input: action.payload.input,
        transactions: [],
      }
      draft.selectedKey = action.key
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
      draft.items[action.key] = {
        ...action.payload,
        currentTransaction: 0,
        currentTransactionComplete: false,
        currentFlowStage,
      }
      draft.selectedKey = action.key
      break
    }
    case 'resumeFlow': {
      const { key } = action
      const item = draft.items[key]
      if (item.currentTransactionComplete) {
        item.currentTransaction += 1
        item.currentTransactionComplete = false
      }
      if (item.intro) {
        item.currentFlowStage = 'intro'
      }
      draft.items[key] = item
      draft.selectedKey = key
      break
    }
    case 'setTransactions': {
      draft.items[draft.selectedKey!] = {
        ...draft.items[draft.selectedKey!],
        transactions: action.payload,
      }
      break
    }
    case 'setFlowStage': {
      draft.items[draft.selectedKey!] = {
        ...draft.items[draft.selectedKey!],
        currentFlowStage: action.payload,
      }
      break
    }
    case 'stopFlow': {
      const { resumable, currentTransaction, currentTransactionComplete, transactions } =
        draft.items[draft.selectedKey!]
      if (!resumable || (currentTransactionComplete && currentTransaction >= transactions.length)) {
        delete draft.items[draft.selectedKey!]
      } else if (currentTransactionComplete) {
        draft.items[draft.selectedKey!] = {
          ...draft.items[draft.selectedKey!],
          currentTransaction: currentTransaction + 1,
          currentTransactionComplete: false,
        }
      }
      draft.selectedKey = null
      break
    }
    case 'setTransactionComplete': {
      draft.items[draft.selectedKey!] = {
        ...draft.items[draft.selectedKey!],
        currentTransactionComplete: true,
      }
      break
    }
    case 'incrementTransaction': {
      draft.items[draft.selectedKey!].currentTransactionComplete = false
      draft.items[draft.selectedKey!] = {
        ...draft.items[draft.selectedKey!],
        currentTransaction: draft.items[draft.selectedKey!].currentTransaction + 1,
      }
      break
    }
  }
}
