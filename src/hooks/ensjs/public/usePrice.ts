import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { GetPriceParameters, getPrice } from '@ensdomains/ensjs/public'
import { usePublicClient } from '../../usePublicClient'

type UsePriceParameters = GetPriceParameters & {
  enabled?: boolean
}

export const usePrice = <TParams extends UsePriceParameters>(
  { enabled = true, ...params }: TParams,
) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const { data, status, isFetchedAfterMount, isFetched, ...rest } = useQuery(queryKeys.getPrice(params), ({ queryKey: [params] }) => getPrice(publicClient, params), {
    enabled: enabled && !!params.nameOrNames,
  })

  return {
    data,
    status,
    isFetched,
    isFetchedAfterMount,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
    ...rest,
  }
}
