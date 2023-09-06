import { QueryFunctionContext, UseQueryResult, useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address, BlockTag, GetBlockParameters, GetBlockReturnType } from 'viem'

import { ChainWithEns } from '@ensdomains/ensjs/contracts'
import { GetNameHistoryReturnType } from '@ensdomains/ensjs/subgraph'
import { ChildFuseKeys, ParentFuseKeys, decodeFuses } from '@ensdomains/ensjs/utils'

import { AnyFuseKey, PublicClientWithChain } from '@app/types'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { useNameHistory } from '../ensjs/subgraph/useNameHistory'
import { usePublicClient } from '../usePublicClient'

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
> = readonly [
  GetBlockParameters<TIncludeTransactions, TBlockTag>,
  number,
  Address | undefined,
  'getBlock',
]

const getBlockQueryFn =
  (publicClient: PublicClientWithChain) =>
  async <TIncludeTransactions extends boolean = false, TBlockTag extends BlockTag = 'latest'>({
    queryKey: [params],
  }: QueryFunctionContext<GetBlockQueryKey<TIncludeTransactions, TBlockTag>>) => {
    return publicClient.getBlock(params)
  }

const generateQueryArray = (
  publicClient: PublicClientWithChain,
  {
    queryKeyFn,
    blocksNeeded,
  }: { queryKeyFn: ReturnType<typeof useQueryKeys>; blocksNeeded: Set<bigint> },
) => {
  return [...blocksNeeded].map(
    (blockNumber) =>
      ({
        queryKey: queryKeyFn.getBlock({ blockNumber }),
        queryFn: getBlockQueryFn(publicClient),
        staleTime: Infinity,
      } as const),
  )
}

const generateFuseSetBlocks = (nameHistory: GetNameHistoryReturnType | undefined) => {
  if (!nameHistory) return { blocksNeeded: new Set<bigint>(), fuseSetBlocks: [] }
  const { domainEvents } = nameHistory

  let hasWrappedEvent = false
  const fuseSetBlocks: FuseSetBlocks = []
  const blocksNeeded: Set<bigint> = new Set()

  for (let i = domainEvents.length - 1; i >= 0 && !hasWrappedEvent; i -= 1) {
    const reference = domainEvents[i]
    switch (reference.type) {
      case 'NameWrapped':
        hasWrappedEvent = true
      case 'FusesSet':
        const decodedFuses = decodeFuses(reference.fuses)
        const burnedParentFuses = ParentFuseKeys.filter((key) => decodedFuses.parent[key])
        const burnedChildFuses = ChildFuseKeys.filter((key) => decodedFuses.child[key])
        const burnedFuses = [...burnedParentFuses, ...burnedChildFuses]
        fuseSetBlocks.push(
          ...(burnedFuses.map((key) => [key, reference.blockNumber]) as FuseSetBlocks),
        )
        blocksNeeded.add(BigInt(reference.blockNumber))
        break
      default:
        break
    }
  }
  if (!hasWrappedEvent) return { blocksNeeded: new Set<bigint>(), fuseSetBlocks: [] }
  return { blocksNeeded, fuseSetBlocks }
}

const generateMatchedFuseBlockData = ({
  fuseSetBlocks,
  blockDatas,
}: {
  fuseSetBlocks: FuseSetBlocks
  blockDatas: UseQueryResult<GetBlockReturnType<ChainWithEns, boolean, BlockTag>, unknown>[]
}) => {
  if (fuseSetBlocks.length === 0)
    return { data: undefined, hasLoadingBlocks: false, hasFetchingBlocks: false }
  const data: FuseSetEntries = {}
  const blockMap = new Map(blockDatas.map((query) => [query.data?.number, query]))

  let hasLoadingBlocks = false
  let hasFetchingBlocks = false
  let hasIncompleteData = false

  for (const [fuseKey, blockNumber] of fuseSetBlocks) {
    const blockData = blockMap.get(BigInt(blockNumber))
    // don't allow incomplete data to be returned
    if (!blockData) {
      hasIncompleteData = true
      continue
    }
    if (blockData.isLoading) hasLoadingBlocks = true
    if (blockData.isFetching) hasFetchingBlocks = true
    const { data: block } = blockData
    const dateString = new Date(Number(block!.timestamp) * 1000).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    data[fuseKey] = dateString
  }

  return {
    data: hasIncompleteData ? {} : data,
    hasLoadingBlocks,
    hasFetchingBlocks,
  }
}

export const useFusesSetDates = ({ name, enabled = true }: UseFusesSetDatesParameters) => {
  const publicClient = usePublicClient()
  const queryKeyFn = useQueryKeys()

  const {
    data: nameHistory,
    isLoading: isNameHistoryLoading,
    isFetching: isNameHistoryFetching,
  } = useNameHistory({ name, enabled })
  const { blocksNeeded, fuseSetBlocks } = useMemo(
    () => generateFuseSetBlocks(nameHistory),
    [nameHistory],
  )

  const blockDatas = useQueries({
    queries: generateQueryArray(publicClient, { queryKeyFn, blocksNeeded }),
  })

  const { data, hasLoadingBlocks, hasFetchingBlocks } = useMemo(
    () => generateMatchedFuseBlockData({ fuseSetBlocks, blockDatas }),
    [fuseSetBlocks, blockDatas],
  )

  return {
    data,
    isLoading: isNameHistoryLoading || hasLoadingBlocks,
    isFetching: isNameHistoryFetching || hasFetchingBlocks,
  }
}
