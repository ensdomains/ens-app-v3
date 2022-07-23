export const createDispatchers = (dispatch) => ({
  openModal: () =>
    dispatch({
      type: 'openModal',
    }),
  setSteps: (steps = []) =>
    dispatch({
      type: 'setSteps',
      payload: steps,
    }),
  setCurrentStep: (payload) =>
    dispatch({
      type: 'setCurrentStep',
      payload,
    }),
  setCanAdvance: (payload) =>
    dispatch({
      type: 'setCanAdvance',
      payload,
    }),
  increaseStep: () =>
    dispatch({
      type: 'increaseStep',
    }),
  decreaseStep: () =>
    dispatch({
      type: 'decreaseStep',
    }),
  setUpdateResolverTransactionInfo: (payload) =>
    dispatch({
      type: 'setUpdateResolverTransactionInfo',
      payload,
    }),
  setUpdateResolverCompletionInfo: (payload) =>
    dispatch({
      type: 'setUpdateResolverCompletionInfo',
      payload,
    }),
  setTransactionState: (payload) =>
    dispatch({
      type: 'setTransactionState',
      payload,
    }),
  setStepStatus: (payload) =>
    dispatch({
      type: 'setStepStatus',
      payload,
    }),
  cancelFlow: () =>
    dispatch({
      type: 'cancelFlow',
    }),
  updateStep: (payload) =>
    dispatch({
      type: 'updateStep',
      payload,
    }),
})
