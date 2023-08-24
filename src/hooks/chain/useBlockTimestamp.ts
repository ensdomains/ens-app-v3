import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { usePublicClient } from '../usePublicClient'

type UseBlockTimestampParameters = {
  enabled?: boolean
}

export const useBlockTimestamp = ({ enabled = true }: UseBlockTimestampParameters = {}) => {
  const publicClient = usePublicClient()

  return useQuery(
    useQueryKeys().blockTimestamp,
    async () => {
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
