import { del as idbDel, get as idbGet, set as idbSet } from 'idb-keyval'
import { enableMapSet } from 'immer'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/vanilla/shallow'

import { createCurrentSlice } from './slices/createCurrentSlice'
import { createFlowSlice } from './slices/createFlowSlice'
import { createNotificationSlice } from './slices/createNotificationSlice'
import { createRegistrationFlowSlice } from './slices/createRegistrationFlowSlice'
import { createTransactionSlice } from './slices/createTransactionSlice'
import type { AllSlices } from './slices/types'
import { transactionReceiptListener } from './transactionReceiptListener'

// export const useTransactionStore = create<
//   AllSlices,
//   [
//     ['zustand/persist', unknown],
//     ['zustand/subscribeWithSelector', never],
//     ['zustand/immer', never],
//   ],
//   [],
// >()((...a) => ({
//   ...createCurrentSlice(...a),
//   ...createFlowSlice(...a),
//   ...createTransactionSlice(...a),
//   ...createNotificationSlice(...a),
// }))

enableMapSet()

export const useTransactionManager = createWithEqualityFn<AllSlices>()(
  persist(
    subscribeWithSelector(
      immer((...a) => ({
        ...createCurrentSlice(...a),
        ...createFlowSlice(...a),
        ...createTransactionSlice(...a),
        ...createNotificationSlice(...a),
        ...createRegistrationFlowSlice(...a),
      })),
    ),
    {
      name: 'transaction-data',
      storage: {
        getItem: async (name) => {
          const value = await idbGet(name)
          return value ?? null
        },
        setItem: idbSet,
        removeItem: idbDel,
      },
      onRehydrateStorage: (state) => {
        return () => state._setHasHydrated(true)
      },
      skipHydration: typeof window === 'undefined',
      partialize: (state) =>
        ({
          flows: state.flows,
          transactions: state.transactions,
        }) as Pick<AllSlices, 'flows' | 'transactions'>,
    },
  ),
  shallow,
)

export type UseTransactionManager = typeof useTransactionManager

useTransactionManager.subscribe(...transactionReceiptListener(useTransactionManager))
