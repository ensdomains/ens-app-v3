import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { usePublicClient } from '../usePublicClient'
import { useInvalidateOnBlock } from './useInvalidateOnBlock'

const useCurrentBlockTimestamp = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const publicClient = usePublicClient()
  const queryKey = useQueryKeys().currentBlockTimestamp
  const { data } = useQuery(
    queryKey,
    async () => {
      const { timestamp } = await publicClient.getBlock({ blockTag: 'latest' })
      return timestamp
    },
    {
      enabled,
    },
  )

  useInvalidateOnBlock({
    enabled,
    queryKey,
  })

  return data
}

export default useCurrentBlockTimestamp
