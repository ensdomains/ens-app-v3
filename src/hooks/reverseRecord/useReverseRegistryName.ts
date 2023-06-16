import { useAccount, useProvider, useQuery } from 'wagmi'

import { namehash } from '@ensdomains/ensjs/utils/normalise'

import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

type Options = {
  enabled?: boolean
}

export const useReverseRegistryName = ({ enabled }: Options = {}) => {
  const _enabled = enabled ?? true
  const provider = useProvider()
  const { ready, contracts } = useEns()
  const account = useAccount()
  return useQuery(
    useQueryKeys().reverseRegistryName(account?.address),
    async () => {
      try {
        const reverseRegistryHash = namehash(`${account.address!.slice(2)}.addr.reverse`)
        const registry = await contracts!.getRegistry()
        const resolverAddress = await registry.resolver(reverseRegistryHash)
        const resolver = await contracts!.getPublicResolver(provider, resolverAddress)
        const name = await resolver.name(reverseRegistryHash)
        return name
      } catch (e) {
        return ''
      }
    },
    {
      enabled: ready && _enabled && !!account?.address,
      refetchOnMount: true,
    },
  )
}
