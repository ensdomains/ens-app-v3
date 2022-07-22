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
      const newResolverInfoItemIdx = draft.steps[transactionIndex].infoItems.findIndex(
        (infoItem) => infoItem.label === 'newResolver',
      )
      const newResolver = draft.steps[transactionIndex].infoItems[newResolverInfoItemIdx].value

      draft.steps[transactionIndex + 1].infoItems.push({
        label: 'newResolver',
        value: newResolver,
        type: 'address',
      })
      break
    }
    case 'setStepStatus': {
      draft.steps[draft.currentStep].stepStatus = action.payload
      break
    }
    case 'cancelFlow': {
      draft = initialState
      break
    }
    default: {
      console.error('default')
      break
    }
  }
}
