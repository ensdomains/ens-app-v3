/* eslint-disable no-param-reassign */
import { current } from 'immer'

export const initialState = {
  isOpen: false,
  steps: [],
  currentStep: 0,
  canAdvance: true,
}

export function reducer(draft, action) {
  switch (action.type) {
    case 'openModal': {
      draft.isOpen = true
      break
    }
    case 'setSteps': {
      draft.steps = action.payload
      break
    }
    case 'setCurrentStep': {
      draft.currentStep = action.payload
      break
    }
    case 'increaseStep': {
      draft.currentStep += 1
      break
    }
    case 'decreaseStep': {
      draft.currentStep -= 1
      break
    }
    case 'setCanAdvance': {
      draft.canAdvance = action.payload
      break
    }
    case 'setUpdateResolverTransactionInfo': {
      const transactionIndex = draft.steps.findIndex(
        (step) => step.transactionType === 'updateResolver',
      )

      const currentTransactionInfo = draft.steps[transactionIndex].transaction.transactionInfo
      draft.steps[transactionIndex].transaction.transactionInfo = {
        ...currentTransactionInfo,
        ...action.payload,
      }
      const currentResolverInfoItemIdx = draft.steps[transactionIndex].infoItems.findIndex(
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
    case 'setUpdateResolverCompletionInfo': {
      const transactionIndex = draft.steps.findIndex(
        (step) => step.transactionType === 'updateResolver',
      )
      draft.steps[transactionIndex + 1].infoItems = draft.steps[transactionIndex].infoItems
      break
    }
    case 'setStepStatus': {
      draft.steps[draft.currentStep].stepStatus = action.payload
      break
    }
    case 'cancelFlow': {
      return initialState
    }
    case 'updateStepTitle': {
      draft.steps[draft.currentStep].title = action.payload
      break
    }
    case 'updateStep': {
      draft.steps[draft.currentStep] = { ...draft.steps[draft.currentStep], ...action.payload }
      break
    }
    case 'setStepError': {
      draft.steps[draft.currentStep].error = action.payload
      break
    }
    case 'updateState': {
      return { ...draft, ...action.payload }
    }
    default: {
      console.error('default')
      break
    }
  }
}
