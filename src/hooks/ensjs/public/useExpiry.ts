import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { GetExpiryParameters, getExpiry } from '@ensdomains/ensjs/public'
import { useMemo } from 'react'
import { usePublicClient } from '../../usePublicClient'

type UseExpiryParameters = GetExpiryParameters & {
  enabled?: boolean
}

export const useExpiry = <TParams extends UseExpiryParameters>(
  { enabled = true, ...params }: TParams,
) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const { data: data_, status, isFetchedAfterMount, isFetched, ...rest } = useQuery(queryKeys.getExpiry(params), ({ queryKey: [params] }) => getExpiry(publicClient, params), {
    enabled: enabled && !!params.name,
  })

  const data = useMemo(() => {
    if (!data_) return undefined
    const { expiry, ...rest } = data_
    return {
      ...rest,
      expiry: {
        ...expiry,
        date: new Date(expiry.date),
      },
    }
  }, [data_])

  return {
    data,
    status,
    isFetched,
    isFetchedAfterMount,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
    ...rest,
  }
}
