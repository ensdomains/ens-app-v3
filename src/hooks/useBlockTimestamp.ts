import { useProvider, useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

export const useBlockTimestamp = () => {
  const provider = useProvider()
  return useQuery(
    useQueryKeys().blockTimestamp,
    async () => {
      const block = await provider.getBlock('latest')
      return block.timestamp * 1000
    },
    {
      enabled: !!provider,
      refetchOnMount: true,
      refetchInterval: 1000 * 60 * 5, // 5 minutes
      staleTime: 1000 * 60, // 1 minute
    },
  )
}
