import type { CurrentSlice } from './createCurrentSlice'
import type { FlowSlice } from './createFlowSlice'
import type { NotificationSlice } from './createNotificationSlice'
import type { RegistrationFlowSlice } from './createRegistrationFlowSlice'
import type { TransactionSlice } from './createTransactionSlice'

export type AllSlices = FlowSlice &
  CurrentSlice &
  TransactionSlice &
  NotificationSlice &
  RegistrationFlowSlice

export type MiddlewareArray = [
  ['zustand/persist', unknown],
  ['zustand/subscribeWithSelector', never],
  ['zustand/immer', never],
]
