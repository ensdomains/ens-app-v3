/* eslint-disable no-param-reassign */
// import { current } from 'immer'

import { Action, TransactionActionTypes, TransactionState } from '@app/types'

export const initialState: TransactionState = {
  isOpen: false,
  steps: [],
  currentStep: 0,
  canAdvance: true,
}

export function reducer(draft: TransactionState, action: Action) {
  console.log('action: ', action)
  switch (action.type) {
    case TransactionActionTypes.openModal: {
      draft.isOpen = true
      break
    }
    case TransactionActionTypes.setSteps: {
      draft.steps = action.payload
      break
    }
    case TransactionActionTypes.setCurrentStep: {
      draft.currentStep = action.payload
      break
    }
    case TransactionActionTypes.increaseStep: {
      draft.currentStep += 1
      break
    }
    case TransactionActionTypes.decreaseStep: {
      draft.currentStep -= 1
      break
    }
    case TransactionActionTypes.setCanAdvance: {
      draft.canAdvance = action.payload
      break
    }
    case TransactionActionTypes.setUpdateResolverTransactionInfo: {
      const transactionIndex = draft.steps.findIndex(
        (step) => step.transactionType === 'updateResolver',
      )

      const currentTransactionInfo = draft.steps[transactionIndex].transactionInfo
      draft.steps[transactionIndex].transactionInfo = {
        ...currentTransactionInfo,
        ...action.payload,
      }
      const currentResolverInfoItemIdx = draft.steps[transactionIndex]?.infoItems?.findIndex(
        (infoItem) => infoItem.label === 'currentResolver',
      )

      draft.steps[transactionIndex].infoItems[currentResolverInfoItemIdx].value =
        action.payload.currentResolver

      const newResolverInfoItemIdx = draft.steps[transactionIndex].infoItems.findIndex(
        (infoItem) => infoItem.label === 'newResolver',
      )
      draft.steps[transactionIndex].infoItems[newResolverInfoItemIdx].value =
        action.payload.newResolver

      break
    }
    case TransactionActionTypes.setUpdateResolverCompletionInfo: {
      const transactionIndex = draft.steps.findIndex(
        (step) => step.transactionType === 'updateResolver',
      )
      draft.steps[transactionIndex + 1].infoItems = draft.steps[transactionIndex].infoItems
      draft.steps[transactionIndex + 1].transactionHash = action.payload
      break
    }
    case TransactionActionTypes.setStepStatus: {
      draft.steps[draft.currentStep].stepStatus = action.payload
      break
    }
    case TransactionActionTypes.cancelFlow: {
      return initialState
    }
    case TransactionActionTypes.updateStepTitle: {
      draft.steps[draft.currentStep].title = action.payload
      break
    }
    case TransactionActionTypes.updateStep: {
      draft.steps[draft.currentStep] = { ...draft.steps[draft.currentStep], ...action.payload }
      break
    }
    case TransactionActionTypes.setStepError: {
      draft.steps[draft.currentStep].error = action.payload
      break
    }
    case TransactionActionTypes.updateState: {
      return { ...draft, ...action.payload }
    }
    default: {
      console.error('default')
      break
    }
  }
}
