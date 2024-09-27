/* eslint-disable default-case */

/* eslint-disable no-param-reassign */
import {
  InternalTransactionFlow,
  InternalTransactionFlowItem,
  TransactionFlowAction,
  TransactionFlowStage,
} from './types'
import { shouldSkipTransactionUpdateDuringTest } from './utils/shouldSkipTransactionUpdateDuringTest'

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
        disableBackgroundClick: action.payload.disableBackgroundClick || undefined,
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
    case 'resumeFlowWithCheck': {
      const {
        key,
        payload: { push },
      } = action
      const item = draft.items[key]
      if (!item) break // item no longer exists because transactions were completed
      if (item.resumeLink && getAllTransactionsComplete(item)) {
        push(item.resumeLink)
        break
      }
      // falls through
    }
    case 'resumeFlow': {
      const { key } = action
      const item = draft.items[key]
      if (!item) break // item no longer exists because transactions were completed
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
    case 'setFailedTransaction': {
      if (!action.payload.key) {
        console.error('No key provided for setFailedTransaction')
        break
      }
      const transaction = draft.items[action.payload.key].transactions.find(
        (x) => x.hash === action.payload.hash,
      )
      if (!transaction) {
        console.error('No transaction found for setFailedTransaction')
        break
      }
      transaction.stage = 'failed'
      break
    }
    case 'incrementTransaction': {
      getSelectedItem().currentTransaction += 1
      break
    }
    case 'resetTransactionStep': {
      getSelectedItem().currentTransaction = 0
      break
    }
    case 'setTransactionStage': {
      const selectedItem = getSelectedItem()
      if (!selectedItem) break
      const currentTransaction = getCurrentTransaction(selectedItem)

      currentTransaction.stage = action.payload
      break
    }
    case 'setTransactionHash': {
      const { hash, key } = action.payload
      const selectedItem = draft.items[key]
      if (!selectedItem) break
      const currentTransaction = getCurrentTransaction(selectedItem)

      currentTransaction.hash = hash
      currentTransaction.stage = 'sent'
      currentTransaction.sendTime = Date.now()
      break
    }
    case 'setTransactionHashFromUpdate': {
      const { hash, key } = action.payload
      const selectedItem = draft.items[key!]
      if (!selectedItem) break
      const currentTransaction = getCurrentTransaction(selectedItem) || selectedItem.transactions[0]
      currentTransaction.hash = hash
      currentTransaction.stage = 'sent'
      currentTransaction.sendTime = Date.now()
      break
    }
    case 'setTransactionStageFromUpdate': {
      const { hash, key, status, minedData, newHash } = action.payload

      const selectedItem = draft.items[key!]
      if (!selectedItem) break
      const transaction = selectedItem.transactions.find((x) => x.hash === hash)

      if (transaction) {
        if (status === 'repriced') {
          transaction.hash = newHash
          transaction.stage = 'sent'
          break
        }

        if (shouldSkipTransactionUpdateDuringTest(transaction)) break

        const stage = status === 'confirmed' ? 'complete' : 'failed'
        transaction.stage = stage
        transaction.minedData = minedData
        transaction.finaliseTime = minedData?.timestamp
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
