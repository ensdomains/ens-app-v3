import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'

import { useChainId } from '../useChainId'
import { Transaction } from './transactionStore'
import { useRecentTransactions } from './useRecentTransactions'

export type UpdateCallback = (transaction: Transaction) => void

const query = `
  {
    _meta {
      block {
        number
      }
    }
  }
`
type GraphResponse = {
  _meta: {
    block: {
      number: number
    }
  }
}

const useCallbackOnTransaction = (callback: UpdateCallback) => {
  const queryClient = useQueryClient()
  const { gqlInstance } = useEns()
  const chainId = useChainId()
  const transactions = useRecentTransactions()
  const previousTransactions = useRef<Transaction[]>()
  const findTransactionHigherThanBlock = (blockNumber: number) =>
    transactions.find((x) => x.minedData && x.minedData.blockNumber > blockNumber)

  useQuery<number>(
    ['graphBlock', chainId, transactions],
    () =>
      gqlInstance.client
        .request(query)
        .then((res: GraphResponse | null) => res!._meta.block.number),
    {
      initialData: 0,
      refetchInterval: (data) => {
        if (!data) return 1000
        const waitingForBlock = findTransactionHigherThanBlock(data)
        if (waitingForBlock) {
          return 1000
        }
        return false
      },
      enabled: !!gqlInstance && !!transactions.find((x) => x.minedData?.blockNumber),
      onSuccess: (data) => {
        if (!data) return
        const waitingForBlock = findTransactionHigherThanBlock(data)
        if (waitingForBlock) return
        queryClient.invalidateQueries({ exact: false, queryKey: ['graph'], refetchType: 'all' })
        queryClient.resetQueries({ exact: false, queryKey: ['getSubnames'] })
      },
    },
  )

  useEffect(() => {
    const updatedTransactions = transactions.filter((transaction) => {
      if (previousTransactions.current) {
        const prevTransaction = previousTransactions.current.find(
          (tr) => tr.hash === transaction.hash,
        )
        if (prevTransaction) {
          return prevTransaction.status !== transaction.status
        }
      }
      return false
    })
    previousTransactions.current = JSON.parse(JSON.stringify(transactions))
    updatedTransactions.forEach(callback)
  }, [callback, transactions])
}

export default useCallbackOnTransaction
