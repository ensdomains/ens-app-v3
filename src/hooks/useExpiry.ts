import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

export const useExpiry = (name: string, skip?: boolean) => {
  const { ready, getExpiry } = useEns()

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery(
    useQueryKeys().expiry(name),
    async () => {
      const results = await getExpiry(name)
      return {
        expiry: results?.expiry?.valueOf(),
        gracePeriod: results?.gracePeriod,
      }
    },
    {
      enabled: !skip && ready,
    },
  )

  return {
    expiry: {
      expiry: data?.expiry ? new Date(data.expiry) : undefined,
      gracePeriod: data?.gracePeriod,
    },
    loading,
    error,
  }
}
