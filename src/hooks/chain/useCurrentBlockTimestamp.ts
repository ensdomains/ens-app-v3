import { getPublicClient } from '@wagmi/core'
import { useQuery } from 'wagmi'

import { PublicClientWithChain } from '@app/types'

import { useQueryKeyFactory } from '../useQueryKeyFactory'
import { useInvalidateOnBlock } from './useInvalidateOnBlock'

const useCurrentBlockTimestamp = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const queryKey = useQueryKeyFactory({
    params: {},
    functionName: 'getCurrentBlockTimestamp',
    queryDependencyType: 'standard',
  })

  const { data } = useQuery(
    queryKey,
    async ({ queryKey: [, chainId] }) => {
      const publicClient = getPublicClient<PublicClientWithChain>({ chainId })
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
