/* eslint-disable no-param-reassign */
import type { WritableDraft } from 'immer/dist/internal'
import type { StateCreator } from 'zustand'

import { onTransactionUpdateAnalytics } from '../analytics'
import type { StoredTransaction } from './createTransactionSlice'
import type { AllSlices, MiddlewareArray } from './types'
import { getIdentifiersOrNull } from './utils'

type SuccessOrRevertedTransaction = Extract<StoredTransaction, { status: 'success' | 'reverted' }>

export type NotificationSlice = {
  notificationBacklog: SuccessOrRevertedTransaction[]
  currentNotification: SuccessOrRevertedTransaction | null
  transactionDidUpdate: (transaction: StoredTransaction) => void
  dismissNotification: () => void
  clearNotifications: () => void
}

export const createNotificationSlice: StateCreator<
  AllSlices,
  MiddlewareArray,
  [],
  NotificationSlice
> = (set) => ({
  notificationBacklog: [],
  currentNotification: null,
  transactionDidUpdate: (transaction) =>
    set((mutable) => {
      const identifiers = getIdentifiersOrNull(mutable, undefined)
      if (!identifiers) return
      if (transaction.status !== 'success' && transaction.status !== 'reverted') return
      if (transaction.status === 'success') onTransactionUpdateAnalytics(transaction)
      if (mutable.currentNotification) {
        mutable.notificationBacklog.push({
          ...transaction,
        } as WritableDraft<SuccessOrRevertedTransaction>)
        return
      }

      mutable.currentNotification = transaction as WritableDraft<SuccessOrRevertedTransaction>
    }),
  dismissNotification: () =>
    set((mutable) => {
      if (mutable.notificationBacklog.length > 0) {
        mutable.currentNotification =
          mutable.notificationBacklog.pop() as WritableDraft<SuccessOrRevertedTransaction>
        return
      }

      mutable.currentNotification = null
    }),
  clearNotifications: () =>
    set((mutable) => {
      mutable.notificationBacklog = []
      mutable.currentNotification = null
    }),
})
