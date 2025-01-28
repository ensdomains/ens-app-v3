import { useCallback } from 'react'
import { Hash } from 'viem'
import { useNetwork } from 'wagmi/react'

import {
  isHighRiskTransaction,
  validateChainId,
  validateTransactionData,
} from '../utils/security/web3.js'

export const useTransactionValidation = () => {
  const { chain } = useNetwork()

  const validateTransaction = useCallback(
    (transaction: { to: string; value?: bigint; data?: string; hash?: Hash }) => {
      if (!chain?.id || !validateChainId(chain.id)) {
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
