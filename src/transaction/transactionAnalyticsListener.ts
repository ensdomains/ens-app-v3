import { trackEvent } from '@app/utils/analytics'

import { createTransactionListener } from './createTransactionListener'
import type { LastTransactionChange } from './types'

export const transactionAnalyticsListener = createTransactionListener(
  (
    s,
  ): Extract<
    LastTransactionChange,
    { status: 'success'; name: 'registerName' | 'commitName' | 'extendNames' }
  > | null => {
    const lastChange = s._internal.lastTransactionChange
    if (!lastChange) return null
    if (lastChange.status !== 'success') return null

    if (lastChange.name === 'registerName') return lastChange
    if (lastChange.name === 'commitName') return lastChange
    if (lastChange.name === 'extendNames') return lastChange

    return null
  },
  (transaction) => {
    if (!transaction) return
    if (transaction.name === 'registerName') trackEvent('register', transaction.chainId)
    else if (transaction.name === 'commitName') trackEvent('commit', transaction.chainId)
    else if (transaction.name === 'extendNames') trackEvent('renew', transaction.chainId)
  },
)
