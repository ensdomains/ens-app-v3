import { useTransaction, useWaitForTransaction } from '@web3modal/react'

const useTransactionResponseReceipt = (hash: string) => {
  const { data: responseData, isLoading: responseLoading } = useTransaction({
    hash: hash as `0x${string}`,
  })
  const { receipt: receiptData, isWaiting: receiptLoading } = useWaitForTransaction({ hash })

  const isLoading = responseLoading || receiptLoading

  return { receipt: receiptData, response: responseData, isLoading }
}

export default useTransactionResponseReceipt
