import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { usePublicClient } from '@app/hooks/usePublicClient'
import { GetDnsImportDataParameters, getDnsImportData } from '@ensdomains/ensjs/dns'

type UseDnsImportDataParameters = GetDnsImportDataParameters & {
  enabled?: boolean
}

export const useDnsImportData = <TParams extends UseDnsImportDataParameters>(
  { enabled = true, ...params }: TParams,
) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const { data, status, isFetchedAfterMount, isFetched, ...rest } = useQuery(queryKeys.getDnsImportData(params), ({ queryKey: [params] }) => getDnsImportData(publicClient, params), {
    enabled: enabled && !!params.name && !params.name?.endsWith('.eth') && params.name !== 'eth' && params.name !== '[root]',
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
