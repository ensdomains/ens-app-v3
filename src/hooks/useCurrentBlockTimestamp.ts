import { useProvider, useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { useInvalidateOnBlock } from './useInvalidateOnBlock'

const useCurrentBlockTimestamp = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const provider = useProvider()
  const queryKeys = useQueryKeys().currentBlockTimestamp
  const { data } = useQuery(
    queryKeys,
    async () => {
      const { timestamp } = await provider.getBlock('latest')
      return timestamp
    },
    {
      enabled,
    },
  )

  useInvalidateOnBlock({
    enabled,
    queryKey: queryKeys,
  })

  return data
}

export default useCurrentBlockTimestamp
