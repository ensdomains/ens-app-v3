import { useCallback } from 'react'
import { Hash } from 'viem'
import { useNetwork } from 'wagmi'
import { validateChainId, validateTransactionData, isHighRiskTransaction } from '@/utils/security/web3'

export const useTransactionValidation = () => {
  const { chain } = useNetwork()

  const validateTransaction = useCallback(
    (transaction: { to: string; value?: bigint; data?: string; hash?: Hash }) => {
      if (!chain?.id || !validateChainId(chain.id)) {
        throw new Error('Unsupported network')
      }

      validateTransactionData(transaction)

      if (isHighRiskTransaction(transaction)) {
        const confirmed = window.confirm(
          'This transaction involves a large amount of ETH. Please confirm you want to proceed.'
        )
        if (!confirmed) {
          throw new Error('User rejected high-risk transaction')
        }
      }

      return true
    },
    [chain]
  )

  return {
    validateTransaction,
  }
}
