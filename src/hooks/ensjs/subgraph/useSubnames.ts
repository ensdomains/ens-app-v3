import { useEffect, useMemo } from 'react'
import { useInfiniteQuery } from 'wagmi'

import { GetSubnamesParameters, getSubnames } from '@ensdomains/ensjs/subgraph'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { usePublicClient } from '../../usePublicClient'

type UseSubnamesParameters = Omit<GetSubnamesParameters, 'previousPage'> & {
  enabled?: boolean
}

export const useSubnames = ({ enabled = true, ...params }: UseSubnamesParameters) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const { data, status, isFetched, isFetchedAfterMount, ...rest } = useInfiniteQuery(
    queryKeys.getSubnames(params),
    ({ queryKey: [queryParams], pageParam }) =>
      getSubnames(publicClient, { ...queryParams, previousPage: pageParam }),
    {
      enabled: enabled && !!params.name,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, params, rest.fetchNextPage])

  const pageCount = data?.pages.length || 0
  const nameCount = data?.pages.reduce((acc, page) => acc + page.length, 0) || 0

  const infiniteData = useMemo(
    () => (data?.pages ? data?.pages.reduce((acc, page) => [...acc, ...page], []) : []),
    [data?.pages],
  )

  return {
    data,
    infiniteData,
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
