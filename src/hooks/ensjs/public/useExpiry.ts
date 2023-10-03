import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import { getExpiry, GetExpiryParameters } from '@ensdomains/ensjs/public'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { usePublicClient } from '../../usePublicClient'

type UseExpiryParameters = GetExpiryParameters & {
  enabled?: boolean
}

export const useExpiry = <TParams extends UseExpiryParameters>({
  enabled = true,
  ...params
}: TParams) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const {
    data: data_,
    status,
    isFetchedAfterMount,
    isFetched,
    ...rest
  } = useQuery(
    queryKeys.getExpiry(params),
    ({ queryKey: [queryParams] }) => getExpiry(publicClient, queryParams),
    {
      enabled: enabled && !!params.name,
    },
  )

  const data = useMemo(() => {
    if (!data_) return undefined
    const { expiry, ...remainingData } = data_
    return {
      ...remainingData,
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
