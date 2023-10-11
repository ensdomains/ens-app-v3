import {
  QueryClient,
  QueryFunctionContext,
  useQueries,
  UseQueryResult,
} from '@tanstack/react-query'
import { Context, createContext, useMemo } from 'react'
import { Address, BlockTag, GetBlockParameters, GetBlockReturnType } from 'viem'
import { useAccount, useQueryClient } from 'wagmi'

import { ChainWithEns } from '@ensdomains/ensjs/contracts'
import { GetNameHistoryReturnType } from '@ensdomains/ensjs/subgraph'
import { ChildFuseKeys, decodeFuses, ParentFuseKeys } from '@ensdomains/ensjs/utils'

import { AnyFuseKey, CreateQueryKey, PublicClientWithChain } from '@app/types'

import { useNameHistory } from '../ensjs/subgraph/useNameHistory'
import { usePublicClient } from '../usePublicClient'
import { createQueryKey } from '../useQueryKeyFactory'

type UseFusesSetDatesParameters = {
  name: string
  enabled?: boolean
}

type FuseSetBlocks = [AnyFuseKey, number][]

type FuseSetEntries = {
  [key in AnyFuseKey]?: string
}

type GetBlockQueryKey<
  TIncludeTransactions extends boolean = false,
  TBlockTag extends BlockTag = 'latest',
> = CreateQueryKey<GetBlockParameters<TIncludeTransactions, TBlockTag>, 'getBlock', 'standard'>

export const getBlockQueryFn =
  (publicClient: PublicClientWithChain) =>
  async <TIncludeTransactions extends boolean = false, TBlockTag extends BlockTag = 'latest'>({
    queryKey: [params],
  }: QueryFunctionContext<GetBlockQueryKey<TIncludeTransactions, TBlockTag>>) => {
    return publicClient.getBlock(params)
  }

export const generateFuseSetBlocks = (
  nameHistory: GetNameHistoryReturnType | undefined,
): {
  blocksNeeded: Set<bigint>
  fuseSetBlocks: FuseSetBlocks
} => {
  if (!nameHistory) return { blocksNeeded: new Set<bigint>(), fuseSetBlocks: [] }
  const { domainEvents } = nameHistory

  let hasWrappedEvent = false
  const fusesSetMap: Map<AnyFuseKey, bigint> = new Map()

  for (let i = domainEvents.length - 1; i >= 0 && !hasWrappedEvent; i -= 1) {
    const reference = domainEvents[i]
    switch (reference.type) {
      case 'NameWrapped':
        hasWrappedEvent = true
      // eslint-disable-next-line no-fallthrough
      case 'FusesSet': {
        const decodedFuses = decodeFuses(reference.fuses)
        const burnedParentFuses = ParentFuseKeys.filter((key) => decodedFuses.parent[key])
        const burnedChildFuses = ChildFuseKeys.filter((key) => decodedFuses.child[key])
        const burnedFuses = [...burnedParentFuses, ...burnedChildFuses]
        for (const fuse of burnedFuses) {
          fusesSetMap.set(fuse, BigInt(reference.blockNumber))
        }
        break
      }
      default:
        break
    }
  }
  if (!hasWrappedEvent) return { blocksNeeded: new Set<bigint>(), fuseSetBlocks: [] }
  return {
    blocksNeeded: new Set(fusesSetMap.values()),
    fuseSetBlocks: [...fusesSetMap.entries()].map(([f, b]) => [f, Number(b)]),
  }
}

export const generateGetBlockQueryArray = (
  publicClient: PublicClientWithChain,
  { address, blocksNeeded }: { address: Address | undefined; blocksNeeded: Set<bigint> },
) => {
  return [...blocksNeeded].map(
    (blockNumber) =>
      ({
        queryKey: createQueryKey({
          chainId: publicClient.chain.id,
          address,
          functionName: 'getBlock',
          params: { blockNumber },
          queryDependencyType: 'standard',
        }),
        queryFn: getBlockQueryFn(publicClient),
        staleTime: Infinity,
      }) as const,
  )
}

export const generateMatchedFuseBlockData = ({
  fuseSetBlocks,
  blockDatas,
}: {
  fuseSetBlocks: FuseSetBlocks
  blockDatas: UseQueryResult<GetBlockReturnType<ChainWithEns, boolean, BlockTag>, unknown>[]
}) => {
  if (fuseSetBlocks.length === 0)
    return { data: undefined, hasLoadingBlocks: false, hasFetchingBlocks: false }
  const data: FuseSetEntries = {}
  const blockMap = new Map(blockDatas.map((query) => [query.data?.number?.toString(), query]))

  let hasLoadingBlocks = false
  let hasFetchingBlocks = false
  let hasIncompleteData = false
  let hasAllSuccessData = true

  for (const [fuseKey, blockNumber] of fuseSetBlocks) {
    const blockData = blockMap.get(blockNumber.toString())
    // don't allow incomplete data to be returned
    if (!blockData) {
      hasIncompleteData = true
      // eslint-disable-next-line no-continue
      continue
    }
    if (blockData.isLoading) hasLoadingBlocks = true
    if (blockData.isFetching) hasFetchingBlocks = true
    if (!blockData.isSuccess) hasAllSuccessData = false
    const { data: block } = blockData
    const dateString = new Date(Number(block!.timestamp) * 1000).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    data[fuseKey] = dateString
  }

  return {
    data: hasIncompleteData ? undefined : data,
    hasLoadingBlocks,
    hasFetchingBlocks,
    hasAllSuccessData,
  }
}

export const useFusesSetDates = ({ name, enabled = true }: UseFusesSetDatesParameters) => {
  const queryClient = useQueryClient()
  // wrap queryClient in context because useQueries needs it
  const context = useMemo(() => createContext(queryClient), [queryClient])

  const publicClient = usePublicClient()
  const { address } = useAccount()

  const {
    data: nameHistory,
    isLoading: isNameHistoryLoading,
    isFetching: isNameHistoryFetching,
    isSuccess: isNameHistorySuccess,
  } = useNameHistory({ name, enabled })
  const { blocksNeeded, fuseSetBlocks } = useMemo(
    () => generateFuseSetBlocks(nameHistory),
    [nameHistory],
  )

  const blockDatas = useQueries({
    queries: generateGetBlockQueryArray(publicClient, { address, blocksNeeded }),
    context: context as Context<QueryClient | undefined>,
  })

  const { data, hasLoadingBlocks, hasFetchingBlocks, hasAllSuccessData } = useMemo(
    () => generateMatchedFuseBlockData({ fuseSetBlocks, blockDatas }),
    [fuseSetBlocks, blockDatas],
  )

  return {
    data,
    isLoading: isNameHistoryLoading || hasLoadingBlocks,
    isFetching: isNameHistoryFetching || hasFetchingBlocks,
    isSuccess: isNameHistorySuccess && hasAllSuccessData,
  }
}
