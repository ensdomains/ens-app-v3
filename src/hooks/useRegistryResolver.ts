import { useQuery } from 'wagmi'

import { namehash } from '@ensdomains/ensjs/utils/normalise'

import { useEns } from '@app/utils/EnsProvider'

import { emptyAddress } from '../utils/constants'

type Contracts = NonNullable<ReturnType<typeof useEns>['contracts']>

export const getRegistryResolver = async (name: string, contracts: Contracts) => {
  try {
    const registry = await contracts.getRegistry()
    const resolver = await registry.resolver(namehash(name))
    return {
      resolver,
      exists: !!resolver && resolver !== emptyAddress,
    }
  } catch (e) {
    console.error(e)
    return {
      resolver: emptyAddress,
      exists: false,
    }
  }
}

export const useRegistryResolver = (name: string) => {
  const { ready, contracts } = useEns()

  const { data, isLoading, ...rest } = useQuery(
    ['getRegistryResolver', name],
    () => getRegistryResolver(name, contracts!),
    {
      enabled: !!name && ready && !!contracts,
    },
  )

  return { ...data, loading: isLoading, ...rest }
}
