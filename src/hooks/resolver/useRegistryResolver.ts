import { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from 'wagmi'

import { namehash } from '@ensdomains/ensjs/utils/normalise'

import { useEns } from '@app/utils/EnsProvider'

import { useQueryKeys } from '../../utils/cacheKeyFactory'

type Options = Pick<UseQueryOptions, 'enabled'>

export const useRegistryResolver = (name: string, options: Options = {}) => {
  const { ready, contracts } = useEns()

  const enabled = options.enabled ?? true

  return useQuery(
    useQueryKeys().registryResolver(name),
    async () => {
      const registry = await contracts!.getRegistry()
      const resolver = await registry.resolver(namehash(name))
      return resolver
    },
    {
      enabled: ready && !!name && enabled,
    },
  )
}
