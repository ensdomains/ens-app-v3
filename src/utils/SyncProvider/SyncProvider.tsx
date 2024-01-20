import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { useQuery, useQueryClient } from 'wagmi'

import { useChainId } from '@app/hooks/chain/useChainId'
import { useSubgraphClient } from '@app/hooks/ensjs/subgraph/useSubgraphClient'
import { useHasGlobalError } from '@app/hooks/errors/useHasGlobalError'
import { Transaction } from '@app/hooks/transactions/transactionStore'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useRegisterNameCallback } from '@app/hooks/transactions/useRegisterNameCallback'

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
    hasIndexingErrors: boolean
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
  const chainId = useChainId()
  const subgraphClient = useSubgraphClient()

  const registerNameCallback = useRegisterNameCallback()
  const callbacks = useRef<Record<string, UpdateCallback>>({})

  const transactions = useRecentTransactions()
  const previousTransactions = useRef<Transaction[]>()
  const findTransactionHigherThanBlock = useCallback(
    (blockNumber: number) =>
      transactions.find((x) => x.minedData && x.minedData.blockNumber > blockNumber),
    [transactions],
  )

  const hasGlobalError = useHasGlobalError()
  const { data: currentGraphBlock } = useQuery<number>(
    ['graphBlock', chainId, transactions],
    () =>
      subgraphClient.request<GraphResponse>(query).then((res) => {
        return res!._meta.block.number
      }),
    {
      initialData: 0,
      refetchInterval: (data) => {
        if (hasGlobalError) return false
        if (!data) return 1000
        const waitingForBlock = findTransactionHigherThanBlock(data)
        if (waitingForBlock) {
          return 1000
        }
        return false
      },
      enabled:
        !!subgraphClient && !!transactions.find((x) => x.minedData?.blockNumber) && !hasGlobalError,
      onSuccess: (data) => {
        if (!data) return
        const waitingForBlock = findTransactionHigherThanBlock(data)
        if (waitingForBlock) return
        queryClient
          .resetQueries({
            predicate: (q) => {
              const { queryKey } = q
              const functionName = queryKey[4]
              if (typeof functionName !== 'string') return false
              return functionName === 'getSubnames'
            },
          })
          .then(() =>
            queryClient.invalidateQueries({
              predicate: (q) => q.queryKey[q.queryKey.length - 1] === 'graph',
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
      registerNameCallback(transaction)
      callbacksRef.forEach((callback) => callback(transaction))
    })
  }, [transactions, registerNameCallback])

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
