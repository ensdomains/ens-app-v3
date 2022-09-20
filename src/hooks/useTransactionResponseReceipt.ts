import { useTransaction, useWaitForTransaction } from 'wagmi'

const useTransactionResponseReceipt = (hash: string) => {
  const { data: responseData, isLoading: responseLoading } = useTransaction({
    hash: hash as `0x${string}`,
  })
  const { data: receiptData, isLoading: receiptLoading } = useWaitForTransaction({ hash })

  const isLoading = responseLoading || receiptLoading

  return { receipt: receiptData, response: responseData, isLoading }
}

export default useTransactionResponseReceipt
