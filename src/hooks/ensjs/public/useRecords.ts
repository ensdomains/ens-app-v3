import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { GetRecordsParameters, getRecords } from '@ensdomains/ensjs/public'
import { usePublicClient } from '../../usePublicClient'

type UseRecordsParameters = GetRecordsParameters & {
  enabled?: boolean
}

export const useRecords = <TParams extends UseRecordsParameters>(
  { enabled = true, ...params }: TParams,
) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const { data, status, isFetchedAfterMount, isFetched, ...rest } = useQuery(queryKeys.getRecords(params), ({ queryKey: [params] }) => getRecords(publicClient, params), {
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
