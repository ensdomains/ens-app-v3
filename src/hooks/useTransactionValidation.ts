import { useCallback } from 'react'
import { Hash } from 'viem'
import { useChainId } from 'wagmi'

import {
  isHighRiskTransaction,
  validateChainId,
  validateTransactionData,
} from '../utils/security/web3'

export const useTransactionValidation = () => {
  const chainId = useChainId()

  const validateTransaction = useCallback(
    (transaction: { to: string; value?: bigint; data?: string; hash?: Hash }) => {
      if (!chainId || !validateChainId(chainId)) {
        throw new Error('Unsupported network')
      }

      validateTransactionData(transaction)

      if (isHighRiskTransaction(transaction)) {
        throw new Error('High-risk transaction detected')
      }

      return true
    },
    [chain],
  )

  return {
    validateTransaction,
  }
}
