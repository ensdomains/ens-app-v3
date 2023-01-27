import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'

export const useResolver = (name: string) => {
  const { ready, getResolver } = useEns()
  return useQuery(
    ['use-resolver', name],
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
