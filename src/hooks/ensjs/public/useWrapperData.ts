import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import { getWrapperData, GetWrapperDataParameters } from '@ensdomains/ensjs/public'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { usePublicClient } from '../../usePublicClient'

type UseWrapperDataParameters = GetWrapperDataParameters & {
  enabled?: boolean
}

export const useWrapperData = <TParams extends UseWrapperDataParameters>({
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
    queryKeys.getWrapperData(params),
    ({ queryKey: [queryParams] }) => getWrapperData(publicClient, queryParams),
    {
      enabled: enabled && !!params.name,
    },
  )

  const data = useMemo(() => {
    if (!data_) return undefined
    const { expiry, ...remainingData } = data_
    return {
      ...remainingData,
      expiry: expiry
        ? {
            ...expiry,
            date: new Date(expiry.date),
          }
        : null,
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
