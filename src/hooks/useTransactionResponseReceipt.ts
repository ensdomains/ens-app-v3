import { Hash } from '@wagmi/core'
import { useTransaction, useWaitForTransaction } from 'wagmi'

const useTransactionResponseReceipt = (hash: string) => {
  const { data: responseData, isLoading: responseLoading } = useTransaction({
    hash: hash as Hash,
  })
  const { data: receiptData, isLoading: receiptLoading } = useWaitForTransaction({
    hash: hash as Hash,
  })

  const isLoading = responseLoading || receiptLoading

  return { receipt: receiptData, response: responseData, isLoading }
}

export default useTransactionResponseReceipt
