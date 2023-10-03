import { useQuery } from 'wagmi'

import { getAddressRecord, GetAddressRecordParameters } from '@ensdomains/ensjs/public'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { usePublicClient } from '../../usePublicClient'

type UseAddressRecordParameters = GetAddressRecordParameters & {
  enabled?: boolean
}

export const useAddressRecord = <TParams extends UseAddressRecordParameters>({
  enabled = true,
  ...params
}: TParams) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const { data, status, isFetchedAfterMount, isFetched, ...rest } = useQuery(
    queryKeys.getAddressRecord(params),
    ({ queryKey: [queryParams] }) => getAddressRecord(publicClient, queryParams),
    {
      enabled: enabled && !!params.name,
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
