import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { useQuery, useQueryClient } from 'wagmi'

import { Transaction } from '@app/hooks/transactions/transactionStore'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useChainId } from '@app/hooks/useChainId'
import { useEns } from '@app/utils/EnsProvider'

export type UpdateCallback = (transaction: Transaction) => void
type AddCallback = (key: string, callback: UpdateCallback) => void
type RemoveCallback = (key: string) => void
type SyncContext = {
  addCallback: AddCallback
  removeCallback: RemoveCallback
  isOutOfSync: boolean | undefined
  currentGraphBlock: number | undefined
}

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

const Context = createContext<SyncContext>({
  addCallback: () => {},
  removeCallback: () => {},
  isOutOfSync: undefined,
  currentGraphBlock: undefined,
})

export const SyncProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient()
  const { gqlInstance } = useEns()
  const chainId = useChainId()

  const callbacks = useRef<Record<string, UpdateCallback>>({})

  const transactions = useRecentTransactions()
  const previousTransactions = useRef<Transaction[]>()
  const findTransactionHigherThanBlock = useCallback(
    (blockNumber: number) =>
      transactions.find((x) => x.minedData && x.minedData.blockNumber > blockNumber),
    [transactions],
  )

  const { data: currentGraphBlock } = useQuery<number>(
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
        queryClient.resetQueries({ exact: false, queryKey: ['getSubnames', 'infinite'] }).then(() =>
          queryClient.invalidateQueries({
            exact: false,
            queryKey: ['graph'],
            refetchType: 'all',
          }),
        )
      },
    },
  )

  // finds transactions that have been updated and calls the callbacks
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
    const callbacksRef = Object.values(callbacks.current)
    updatedTransactions.forEach((transaction) => {
      callbacksRef.forEach((callback) => callback(transaction))
    })
  }, [transactions])

  const isOutOfSync = useMemo(() => {
    if (typeof currentGraphBlock !== 'number') return false
    const waitingForBlock = findTransactionHigherThanBlock(currentGraphBlock)
    if (waitingForBlock) return true
    return false
  }, [currentGraphBlock, findTransactionHigherThanBlock])

  const value = useMemo<SyncContext>(
    () => ({
      addCallback: (key, callback) => {
        callbacks.current[key] = callback
      },
      removeCallback: (key) => {
        delete callbacks.current[key]
      },
      isOutOfSync,
      currentGraphBlock,
    }),
    [currentGraphBlock, isOutOfSync],
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useCallbackOnTransaction = (callback: UpdateCallback) => {
  const { addCallback, removeCallback } = useContext(Context)
  useEffect(() => {
    const key = window.crypto.randomUUID()
    addCallback(key, callback)
    return () => {
      removeCallback(key)
    }
  }, [callback, addCallback, removeCallback])
}

export const useGraphOutOfSync = () => {
  const { isOutOfSync } = useContext(Context)
  return !!isOutOfSync
}
