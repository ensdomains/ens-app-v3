import { useQuery } from 'wagmi'

import { getPrice, GetPriceParameters } from '@ensdomains/ensjs/public'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { usePublicClient } from '../../usePublicClient'

type UsePriceParameters = GetPriceParameters & {
  enabled?: boolean
}

export const usePrice = <TParams extends UsePriceParameters>({
  enabled = true,
  ...params
}: TParams) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const { data, status, isFetchedAfterMount, isFetched, ...rest } = useQuery(
    queryKeys.getPrice(params),
    ({ queryKey: [queryParams] }) => getPrice(publicClient, queryParams),
    {
      enabled: enabled && !!params.nameOrNames,
    },
  )

  return {
    data,
    status,
    isFetched,
    isFetchedAfterMount,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
    ...rest,
  }
}
