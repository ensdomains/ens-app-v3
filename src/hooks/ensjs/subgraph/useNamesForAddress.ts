import { useEffect } from 'react'
import { useInfiniteQuery } from 'wagmi'

import { GetNamesForAddressParameters, getNamesForAddress } from '@ensdomains/ensjs/subgraph'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { usePublicClient } from '../../usePublicClient'

type UseNamesForAddressParameters = Omit<GetNamesForAddressParameters, 'previousPage'> & {
  enabled?: boolean
}

export const useNamesForAddressPaginated = ({
  enabled = true,
  ...params
}: UseNamesForAddressParameters) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const { data, status, isFetched, isFetchedAfterMount, ...rest } = useInfiniteQuery(
    queryKeys.getNamesForAddress(params),
    ({ queryKey: [params], pageParam }) =>
      getNamesForAddress(publicClient, { ...params, previousPage: pageParam }),
    {
      enabled: enabled && !!params.address,
      getNextPageParam: (lastPage) => {
        if (lastPage?.length < (params.pageSize || 100)) return false
        return lastPage
      },
    },
  )

  useEffect(() => {
    if (enabled) {
      rest.fetchNextPage()
    }
  }, [enabled, params])

  const pageCount = data?.pages.length || 0
  const nameCount = data?.pages.reduce((acc, page) => acc + page.length, 0) || 0

  return {
    data,
    page: data?.pages[0] || [],
    pageCount,
    nameCount,
    status,
    isFetched,
    isFetchedAfterMount,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
    ...rest,
  }
}
