export const getCurrentStep = (state) => state?.steps[state.currentStep]
export const getCurrentStepStatus = (state) => state?.steps[state.currentStep]?.stepStatus
export const getCurrentTransactionData = (state) => state?.steps[state.currentStep]?.transaction
