import { useProvider, useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { useInvalidateOnBlock } from './useInvalidateOnBlock'

const useCurrentBlockTimestamp = () => {
  const provider = useProvider()
  const { data } = useQuery(useQueryKeys().currentBlockTimestamp, async () => {
    const { timestamp } = await provider.getBlock('latest')
    return timestamp
  })

  useInvalidateOnBlock({
    enabled: true,
    queryKey: ['currentBlockTimestamp'],
  })

  return data
}

export default useCurrentBlockTimestamp
