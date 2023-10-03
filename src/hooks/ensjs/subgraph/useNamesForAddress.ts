import { useEffect, useMemo, useState } from 'react'
import { useInfiniteQuery } from 'wagmi'

import {
  getNamesForAddress,
  GetNamesForAddressParameters,
  GetNamesForAddressReturnType,
} from '@ensdomains/ensjs/subgraph'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { usePublicClient } from '../../usePublicClient'

type UseNamesForAddressParameters = Omit<GetNamesForAddressParameters, 'previousPage'> & {
  enabled?: boolean
}

export const useNamesForAddress = ({ enabled = true, ...params }: UseNamesForAddressParameters) => {
  const publicClient = usePublicClient()

  const queryKeys = useQueryKeys()

  const [unfilteredPages, setUnfilteredPages] = useState<GetNamesForAddressReturnType>([])

  const { data, status, isFetched, isFetching, isLoading, isFetchedAfterMount, ...rest } =
    useInfiniteQuery(
      queryKeys.getNamesForAddress(params),
      ({ queryKey: [queryParams], pageParam }) =>
        getNamesForAddress(publicClient, { ...queryParams, previousPage: pageParam }),
      {
        enabled: enabled && !!params.address,
        getNextPageParam: (lastPage) => {
          if (lastPage?.length < (params.pageSize || 100)) return false
          return lastPage
        },
      },
    )

  const infiniteData = useMemo(
    () => (data?.pages ? data?.pages.reduce((acc, page) => [...acc, ...page], []) : []),
    [data?.pages],
  )

  useEffect(() => {
    if (!params.filter?.searchString) {
      setUnfilteredPages(infiniteData)
    }
  }, [params.filter?.searchString, infiniteData])

  const infiniteDataWithFetchingFill = useMemo(
    () =>
      params.filter?.searchString && isFetching
        ? unfilteredPages.filter((x) => x.labelName?.includes(params.filter!.searchString!))
        : infiniteData,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFetching, unfilteredPages, params.filter?.searchString, infiniteData],
  )

  const nameCount = infiniteDataWithFetchingFill.length || 0

  return {
    data,
    infiniteData: infiniteDataWithFetchingFill,
    page: data?.pages[0] || [],
    nameCount,
    status,
    isFetched,
    isFetching,
    isFetchedAfterMount,
    isLoading: !params.filter?.searchString
      ? isLoading
      : !infiniteDataWithFetchingFill.length && isLoading,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
    ...rest,
  }
}
