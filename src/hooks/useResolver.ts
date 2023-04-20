import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

export const useResolver = (name: string) => {
  const { ready, getResolver } = useEns()
  return useQuery(
    useQueryKeys().getResolver(name),
    async () => {
      const resolver = await getResolver(name)
      if (!resolver) return ''
      return resolver
    },
    {
      enabled: ready && !!name,
    },
  )
}
