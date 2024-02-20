import { getPublicClient } from '@wagmi/core'
import { useQuery } from '@tanstack/react-query'

import { PublicClientWithChain } from '@app/types'

import { useQueryOptions } from '../useQueryOptions'

type UseBlockTimestampParameters = {
  enabled?: boolean
}

export const useBlockTimestamp = ({ enabled = true }: UseBlockTimestampParameters = {}) => {
  const { queryKey } = useQueryOptions({
    params: {},
    functionName: 'getBlockTimestamp',
    queryDependencyType: 'standard',
  })

  return useQuery(
    queryKey,
    async ({ queryKey: [, chainId] }) => {
      const publicClient = getPublicClient<PublicClientWithChain>({ chainId })
      const block = await publicClient.getBlock({ blockTag: 'latest' })
      return block.timestamp * 1000n
    },
    {
      enabled,
      refetchOnMount: true,
      refetchInterval: 1000 * 60 * 5, // 5 minutes
      staleTime: 1000 * 60, // 1 minute
    },
  )
}
