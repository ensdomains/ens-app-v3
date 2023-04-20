import { useProvider, useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { useInvalidateOnBlock } from './useInvalidateOnBlock'

const useCurrentBlockTimestamp = () => {
  const provider = useProvider()
  const queryKeys = useQueryKeys().currentBlockTimestamp
  const { data } = useQuery(queryKeys, async () => {
    const { timestamp } = await provider.getBlock('latest')
    return timestamp
  })

  useInvalidateOnBlock({
    enabled: true,
    queryKey: queryKeys,
  })

  return data
}

export default useCurrentBlockTimestamp
