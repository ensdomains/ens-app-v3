/* eslint-disable default-case */

/* eslint-disable no-param-reassign */
import {
  InternalTransactionFlow,
  InternalTransactionFlowItem,
  TransactionFlowAction,
  TransactionFlowStage,
} from './types'

export const initialState: InternalTransactionFlow = {
  selectedKey: null,
  items: {},
}

export const helpers = (draft: InternalTransactionFlow) => {
  const getSelectedItem = () => draft.items[draft.selectedKey!]
  const getCurrentTransaction = (item: InternalTransactionFlowItem) =>
    item.transactions[item.currentTransaction]
  const getAllTransactionsComplete = (item: InternalTransactionFlowItem) =>
    item.transactions.every(({ hash, stage }) => hash && stage === 'complete')
  const getNoTransactionsStarted = (item: InternalTransactionFlowItem) =>
    item.transactions.every(({ stage }) => !stage || stage === 'confirm')
  const getCanRemoveItem = (item: InternalTransactionFlowItem) =>
    item.requiresManualCleanup
      ? false
      : !item.transactions ||
        !item.resumable ||
        getAllTransactionsComplete(item) ||
        getNoTransactionsStarted(item)

  return {
    getSelectedItem,
    getCurrentTransaction,
    getAllTransactionsComplete,
    getCanRemoveItem,
  }
}

export const reducer = (draft: InternalTransactionFlow, action: TransactionFlowAction) => {
  const { getSelectedItem, getCurrentTransaction, getAllTransactionsComplete } = helpers(draft)

  switch (action.name) {
    case 'showDataInput': {
      draft.items[action.key] = {
        currentFlowStage: 'input',
        currentTransaction: 0,
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
        currentFlowStage,
      }
      draft.selectedKey = action.key
      break
    }
    case 'resumeFlow': {
      const { key } = action
      const item = draft.items[key]
      if (item.intro) {
        item.currentFlowStage = 'intro'
      }
      draft.items[key] = item
      draft.selectedKey = key
      break
    }
    case 'setTransactions': {
      getSelectedItem().transactions = action.payload
      break
    }
    case 'setFlowStage': {
      getSelectedItem().currentFlowStage = action.payload
      break
    }
    case 'stopFlow': {
      draft.selectedKey = null
      break
    }
    case 'incrementTransaction': {
      getSelectedItem().currentTransaction += 1
      break
    }
    case 'setTransactionStage': {
      const selectedItem = getSelectedItem()
      const currentTransaction = getCurrentTransaction(selectedItem)

      currentTransaction.stage = action.payload
      break
    }
    case 'setTransactionHash': {
      const selectedItem = getSelectedItem()
      const currentTransaction = getCurrentTransaction(selectedItem)

      currentTransaction.hash = action.payload
      currentTransaction.stage = 'sent'
      currentTransaction.sendTime = Date.now()
      break
    }
    case 'setTransactionStageFromUpdate': {
      const { hash, key, status } = action.payload
      const selectedItem = draft.items[key]
      const transaction = selectedItem.transactions.find((x) => x.hash === hash)
      if (transaction) {
        const stage = status === 'confirmed' ? 'complete' : 'failed'
        transaction.stage = stage
        transaction.finaliseTime = Date.now()
        if (
          key === draft.selectedKey &&
          selectedItem.autoClose &&
          getAllTransactionsComplete(selectedItem)
        ) {
          draft.selectedKey = null
        }
      }
      break
    }
    case 'forceCleanupTransaction':
    case 'cleanupTransaction': {
      const selectedItem = draft.items[action.payload]
      if (
        selectedItem &&
        (!selectedItem.requiresManualCleanup || action.name === 'forceCleanupTransaction') &&
        (!selectedItem.resumable || getAllTransactionsComplete(selectedItem))
      ) {
        delete draft.items[action.payload]
      }
      break
    }
  }
}
