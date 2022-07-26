import { TransactionState } from '@app/types'

export const getCurrentStep = (state: TransactionState) => state?.steps[state.currentStep]
export const getCurrentStepStatus = (state: TransactionState) =>
  state?.steps[state.currentStep]?.stepStatus
