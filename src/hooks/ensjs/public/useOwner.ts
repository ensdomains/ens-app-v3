import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { GetOwnerParameters, getOwner } from '@ensdomains/ensjs/public'
import { usePublicClient } from '../../usePublicClient'

type UseOwnerParameters = GetOwnerParameters & {
  enabled?: boolean
}

export const useOwner = <TParams extends UseOwnerParameters>(
  { enabled = true, ...params }: TParams,
) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const { data, status, isFetchedAfterMount, isFetched, ...rest } = useQuery(queryKeys.getOwner(params), ({ queryKey: [params] }) => getOwner(publicClient, params), {
    enabled: enabled && !!params.name,
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
