import type { AllSlices } from './slices/types'

export type TransactionStoreListener<selected> = [
  selector: (state: AllSlices) => selected,
  listener: (selectedState: selected, previousSelectedState: selected) => void,
  options?: {
    equalityFn?: (a: selected, b: selected) => boolean
    fireImmediately?: boolean
  },
]

export const createTransactionListener = <selected>(
  selector: (state: AllSlices) => selected,
  listener: (selectedState: selected, previousSelectedState: selected) => void,
  options?: {
    equalityFn?: (a: selected, b: selected) => boolean
    fireImmediately?: boolean
  },
): TransactionStoreListener<selected> => {
  return [selector, listener, options]
}
