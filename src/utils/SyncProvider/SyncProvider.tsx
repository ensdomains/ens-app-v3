import { Query, QueryClient, useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { Config, useChainId } from 'wagmi'
import { GetEnsAvatarQueryKey } from 'wagmi/query'

import { SupportedChain } from '@app/constants/chains'
import { useSubgraphClient } from '@app/hooks/ensjs/subgraph/useSubgraphClient'
import { clearRelevantNameQueriesFromRegisterOrImport } from '@app/hooks/transactions/clearRelevantNameQueriesFromRegisterOrImport'
import { Transaction } from '@app/hooks/transactions/transactionStore'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { CreateQueryKey } from '@app/types'
import { useQuery } from '@app/utils/query/useQuery'

import { parse, stringify } from '../query/persist'
import { useHasSubgraphSyncErrors } from '../useHasSubgraphSyncErrors'

export type UpdateCallback = (transaction: Transaction) => void
type AddCallback = (key: string, callback: UpdateCallback) => void
type RemoveCallback = (key: string) => void
type SyncContext = {
  addCallback: AddCallback
  removeCallback: RemoveCallback
  isOutOfSync: boolean | undefined
  currentGraphBlock: number | undefined
  isError: boolean | undefined
  isSlow: boolean | undefined
  isFetching: boolean
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
  isError: undefined,
  isSlow: undefined,
  isFetching: false,
})

type ChainDependentQueryKey = CreateQueryKey<object, string, 'standard'>

const filterByChainDependentQuery =
  (chainId: SupportedChain['id']) =>
  ({ queryKey: queryKey_ }: Query) => {
    const queryKey = queryKey_ as
      | ChainDependentQueryKey
      | CreateQueryKey<object, string, 'graph'>
      | GetEnsAvatarQueryKey<Config>
      | never[]

    // useEnsAvatar query from wagmi
    if (queryKey[0] === 'ensAvatar' && queryKey[1]?.chainId === chainId) return true

    // internal queries
    if (queryKey[1] !== chainId) return false
    if (typeof queryKey[0] !== 'object' || queryKey[0] === null) return false
    // don't invalidate graph queries, which are handled separately
    if (queryKey[5] === 'graph') return false

    return true
  }

const invalidateAllCurrentChainQueries = async ({
  queryClient,
  chainId,
  updatedTransactions,
}: {
  queryClient: QueryClient
  chainId: SupportedChain['id']
  updatedTransactions: Transaction[]
}) => {
  // only invalidate all queries if a transaction has actually been confirmed
  if (!updatedTransactions.some((x) => x.status === 'confirmed')) return false
  return queryClient.invalidateQueries({
    predicate: filterByChainDependentQuery(chainId),
  })
}

export const SyncProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient()
  const chainId = useChainId()
  const subgraphClient = useSubgraphClient()

  const callbacks = useRef<Record<string, UpdateCallback>>({})

  const transactions = useRecentTransactions()
  const previousTransactions = useRef<Transaction[]>()
  const findTransactionHigherThanBlock = useCallback(
    (blockNumber: number) =>
      transactions.find((x) => x.minedData && x.minedData.blockNumber > blockNumber),
    [transactions],
  )

  const hasSubgraphSyncErrors = useHasSubgraphSyncErrors()
  const { data: currentGraphBlock } = useQuery<number>({
    queryKey: ['graphBlock', chainId, transactions],
    queryFn: () =>
      subgraphClient.request<GraphResponse>(query).then((res) => {
        return res!._meta.block.number
      }),
    initialData: 0,
    refetchInterval: (q) => {
      if (hasSubgraphSyncErrors.error) return false
      if (!q.state.data) return 1000
      const waitingForBlock = findTransactionHigherThanBlock(q.state.data)
      if (waitingForBlock) {
        return 1000
      }
      return false
    },
    enabled:
      !!subgraphClient &&
      !!transactions.find((x) => x.minedData?.blockNumber) &&
      !hasSubgraphSyncErrors.error,
  })

  // reset getSubnames and graph queries when the graph block is updated
  useEffect(() => {
    // only run when the graph block is updated and there are no transactions waiting for a higher block
    if (currentGraphBlock && !findTransactionHigherThanBlock(currentGraphBlock)) {
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
    }
  }, [currentGraphBlock, findTransactionHigherThanBlock, queryClient])

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
    previousTransactions.current = parse(stringify(transactions))
    const callbacksRef = Object.values(callbacks.current)
    invalidateAllCurrentChainQueries({ queryClient, chainId, updatedTransactions })
    clearRelevantNameQueriesFromRegisterOrImport({ queryClient, chainId, updatedTransactions })
    updatedTransactions.forEach((transaction) => {
      callbacksRef.forEach((callback) => callback(transaction))
    })
  }, [queryClient, chainId, transactions])

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
      isError: !!hasSubgraphSyncErrors.error,
      isSlow: !!hasSubgraphSyncErrors.slow,
      isFetching: hasSubgraphSyncErrors.isFetching,
    }),
    [
      currentGraphBlock,
      isOutOfSync,
      hasSubgraphSyncErrors.error,
      hasSubgraphSyncErrors.slow,
      hasSubgraphSyncErrors.isFetching,
    ],
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

export const useHasGraphError = () => {
  const { isFetching, isError } = useContext(Context)
  return { data: isError, isLoading: isFetching }
}

export const useGraphErrorType = () => {
  const context = useContext(Context)
  if (context.isError) return 'SubgraphError'
  if (context.isSlow) return 'SubgraphLatency'
  if (context.isOutOfSync) return 'SubgraphOutOfSync'
  return null
}
