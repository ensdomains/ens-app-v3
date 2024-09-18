import { useBlock, useChainId, useConfig } from 'wagmi'
import { getBlockQueryOptions } from 'wagmi/query'

import { usePrefetchQuery } from '../usePrefetchQuery'

type UseBlockTimestampParameters = {
  enabled?: boolean
}

export const useBlockTimestamp = ({ enabled = true }: UseBlockTimestampParameters = {}) => {
  return useBlock({
    blockTag: 'latest',
    query: {
      enabled,
      refetchOnMount: true,
      refetchInterval: 1000 * 60 * 5 /* 5 minutes */,
      staleTime: 1000 * 60 /* 1 minute */,
      select: (b) => b.timestamp * 1000n,
    },
  })
}

export const usePrefetchBlockTimestamp = () => {
  const config = useConfig()
  const chainId = useChainId()
  return usePrefetchQuery(getBlockQueryOptions(config, { chainId, blockTag: 'latest' }))
}
