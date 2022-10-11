import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { yearsToSeconds } from '@app/utils/utils'

export const usePrice = (nameOrNames: string | string[], legacy?: boolean) => {
  const { ready, getPrice } = useEns()
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]
  const type = legacy ? 'legacy' : 'new'
  const {
    data,
    status,
    isFetched,
    isLoading: loading,
    error,
    internal: { isFetchedAfterMount },
  } = useQuery(
    ['usePrice', type, ...names],
    async () => getPrice(nameOrNames, yearsToSeconds(1), legacy),
    {
      enabled: !!(ready && nameOrNames && nameOrNames.length > 0),
    },
  )

  const base = data?.base
  const premium = data?.premium
  const hasPremium = data?.premium.gt(0)

  return {
    base,
    premium,
    hasPremium,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
    loading,
    error,
  }
}
