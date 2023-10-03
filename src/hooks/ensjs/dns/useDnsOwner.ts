import { useQuery } from 'wagmi'

import { getDnsOwner, GetDnsOwnerParameters } from '@ensdomains/ensjs/dns'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

type UseDnsOwnerParameters = GetDnsOwnerParameters & {
  enabled?: boolean
}

export const useDnsOwner = <TParams extends UseDnsOwnerParameters>({
  enabled = true,
  ...params
}: TParams) => {
  const queryKeys = useQueryKeys()

  const { data, status, isFetchedAfterMount, isFetched, ...rest } = useQuery(
    queryKeys.getDnsOwner(params),
    ({ queryKey: [queryParams] }) => getDnsOwner(queryParams),
    {
      enabled:
        enabled &&
        !!params.name &&
        !params.name?.endsWith('.eth') &&
        params.name !== 'eth' &&
        params.name !== '[root]',
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
