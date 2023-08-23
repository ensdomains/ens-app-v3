import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { GetWrapperDataParameters, getWrapperData } from '@ensdomains/ensjs/public'
import { useMemo } from 'react'
import { usePublicClient } from '../../usePublicClient'

type UseWrapperDataParameters = GetWrapperDataParameters & {
  enabled?: boolean
}

export const useWrapperData = <TParams extends UseWrapperDataParameters>(
  { enabled = true, ...params }: TParams,
) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const { data: data_, status, isFetchedAfterMount, isFetched, ...rest } = useQuery(queryKeys.getWrapperData(params), ({ queryKey: [params] }) => getWrapperData(publicClient, params), {
    enabled: enabled && !!params.name,
  })

  const data = useMemo(() => {
    if (!data_) return undefined
    const { expiry, ...rest } = data_
    return {
      ...rest,
      expiry: expiry ? {
        ...expiry,
        date: new Date(expiry.date),
      } : null
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
