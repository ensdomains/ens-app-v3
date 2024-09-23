import { trackEvent } from '@app/utils/analytics'

import type { StoredTransaction } from './slices/createTransactionSlice'

export const onTransactionUpdateAnalytics = (
  transaction: Extract<StoredTransaction, { status: 'success' }>,
) => {
  if (!transaction) return
  if (transaction.name === 'registerName') trackEvent('register', transaction.targetChainId)
  else if (transaction.name === 'commitName') trackEvent('commit', transaction.targetChainId)
  else if (transaction.name === 'extendNames') trackEvent('renew', transaction.targetChainId)
}
