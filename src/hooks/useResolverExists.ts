import { useQuery } from 'wagmi'

import { namehash } from '@ensdomains/ensjs/utils/normalise'

import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

const query = `
  query getResolverExists($id: String!) {
    resolver(id: $id) {
      id
    }
  }
`

/**
 * Check if a resolver exists for a given name. Used in registration to check if the
 * public resolver needs to have it's records cleared.
 */
const useResolverExists = (name: string, address: string) => {
  const { ready, gqlInstance } = useEns()
  const { data, isLoading } = useQuery(
    useQueryKeys().resolverExists(name),
    async () => {
      try {
        const { resolver } = await gqlInstance.client.request(query, {
          id: `${address}-${namehash(name)}`,
        })
        return !!resolver
      } catch (e) {
        // If the graph is down or has an error, we assume the resolver exists for safety
        return true
      }
    },
    {
      enabled: ready && name !== '',
    },
  )

  return {
    data,
    isLoading,
  }
}

export default useResolverExists
