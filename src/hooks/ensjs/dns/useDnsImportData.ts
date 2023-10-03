import { useQuery } from 'wagmi'

import { getDnsImportData, GetDnsImportDataParameters } from '@ensdomains/ensjs/dns'

import { usePublicClient } from '@app/hooks/usePublicClient'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

type UseDnsImportDataParameters = GetDnsImportDataParameters & {
  enabled?: boolean
}

export const useDnsImportData = <TParams extends UseDnsImportDataParameters>({
  enabled = true,
  ...params
}: TParams) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const { data, status, isFetchedAfterMount, isFetched, ...rest } = useQuery(
    queryKeys.getDnsImportData(params),
    ({ queryKey: [queryParams] }) => getDnsImportData(publicClient, queryParams),
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
