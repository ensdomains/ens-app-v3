import { useChainId, useProvider, useQuery } from 'wagmi'

import { canResolverSetPrimaryName } from '@app/utils/canResolverSetPrimaryName'

export const useCanResolverSetPrimaryName = (
  resolver?: string,
  isNameWrapped = true,
  skip = false,
) => {
  const provider = useProvider()
  const chainId = useChainId()
  const { data, isLoading } = useQuery(
    ['canResolverSetPrimaryName', resolver, isNameWrapped, chainId],
    () => canResolverSetPrimaryName(resolver!, isNameWrapped, provider, chainId),
    {
      enabled: !!resolver && !skip && !!chainId,
    },
  )
  return {
    canResolverSetPrimaryName: data,
    isLoading,
  }
}
