import { InternalTransactionFlow } from './types'

export const getSelectedFlowItem = (state: InternalTransactionFlow) => {
  if (!state) return null
  const { selectedKey } = state
  if (!selectedKey) {
    return null
  }

  return state.items[selectedKey]
}
