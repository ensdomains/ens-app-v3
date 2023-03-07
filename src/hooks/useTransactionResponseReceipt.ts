import { useTransaction, useWaitForTransaction } from 'wagmi'

const useTransactionResponseReceipt = (hash: `0x${string}` | undefined) => {
  const { data: responseData, isLoading: responseLoading } = useTransaction({
    hash,
  })
  const { data: receiptData, isLoading: receiptLoading } = useWaitForTransaction({ hash })

  const isLoading = responseLoading || receiptLoading

  return { receipt: receiptData, response: responseData, isLoading }
}

export default useTransactionResponseReceipt
