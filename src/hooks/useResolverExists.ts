import { namehash, type Address } from 'viem'
import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { useSubgraphClient } from './ensjs/subgraph/useSubgraphClient'

const query = `
  query getResolverExists($id: String!) {
    resolver(id: $id) {
      id
    }
  }
`

type UseResolverExistsParameters = {
  name: string
  address: Address
  enabled?: boolean
}

/**
 * Check if a resolver exists for a given name. Used in registration to check if the
 * public resolver needs to have it's records cleared.
 */
export const useResolverExists = ({ enabled = true, ...params }: UseResolverExistsParameters) => {
  const subgraphClient = useSubgraphClient()
  return useQuery(
    useQueryKeys().getResolverExists(params),
    async ({ queryKey: [queryParams] }) => {
      try {
        const { resolver } = await subgraphClient.request(query, {
          id: `${queryParams.address}-${namehash(queryParams.name)}`,
        })
        return !!resolver
      } catch (e) {
        // If the graph is down or has an error, we assume the resolver exists for safety
        return true
      }
    },
    {
      enabled: enabled && !!params.name && !!params.address,
    },
  )
}
