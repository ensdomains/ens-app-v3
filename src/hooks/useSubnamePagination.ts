import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInfiniteQuery } from 'wagmi'

import { SortDirection, SortType } from '@app/components/@molecules/NameTableHeader/NameTableHeader'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useEns } from '@app/utils/EnsProvider'

export type Subname = {
  id: string
  name: string
  truncatedName?: string
  resultsPerPage?: number
  searchQuery?: string
}

export type SubnameSortType = Exclude<SortType, SortType.expiryDate>

export const useSubnamePagination = (
  name: string,
  page?: number,
  orderBy?: SubnameSortType,
  orderDirection?: SortDirection,
  pageSize = 10,
  search?: string,
) => {
  const queryClient = useQueryClient()
  const { getSubnames } = useEns()

  const breakpoint = useBreakpoint()

  const _page = typeof page === 'number' ? page - 1 : 0
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['getSubnames', name, orderBy, orderDirection, search, pageSize],
    async ({ pageParam }) => {
      const result = await getSubnames({
        name,
        lastSubnames: pageParam,
        orderBy: orderBy === 'creationDate' ? 'createdAt' : 'labelName',
        orderDirection,
        pageSize,
        search,
      })

      console.log('result', result)
      return {
        ...result,
        totalPages: Math.ceil(result.subnameCount / pageSize),
      }
    },
    {
      getNextPageParam: (last) => (last.subnames.length === pageSize ? last.subnames : undefined),
      // getPreviousPageParam: (_, all) => all[all.length - 2]?.subnames,
      refetchOnMount: 'always',
    },
  )

  const latestPage = data?.pages && data.pages[data.pages.length - 1]
  // const currentPage = data?.pages[_page]?.subnames || latestPage?.subnames || []
  const hasCurrentPage = (data?.pages[_page]?.subnames?.length || 0) > 0

  const latestPageHasNextPage = latestPage?.subnames?.length === pageSize

  useEffect(() => {
    if (queryClient) {
      alert('resetQueries')
      queryClient.resetQueries({ exact: false, queryKey: ['getSubnames'] })
    }
  }, [queryClient])

  useEffect(() => {
    if (!hasCurrentPage && hasNextPage) {
      console.log('fetching next page')
      // fetchNextPage()
    }
  }, [hasCurrentPage, fetchNextPage, hasNextPage])

  const currentPageCount =
    data?.pages.reduce((acc, curr, i, arr) => {
      const hasPageSize = curr.subnames.length === pageSize ? 1 : 0
      const hasPageSizeAndIsLastPage = hasPageSize && i === arr.length - 1
      if (hasPageSizeAndIsLastPage) return acc + 2
      if (hasPageSize) return acc + 1
      return acc
    }, 0) || 0
  const max = breakpoint.sm ? 4 : 3

  const subnames: Subname[] =
    data?.pages.reduce<Subname[]>((acc, curr) => {
      return [...acc, ...(curr.subnames || [])]
    }, []) || ([] as Subname[])

  return {
    subnames,
    fetchNextPage,
    subnameCount: latestPage?.subnameCount || 0,
    isLoading,
    isFetching: false,
    max: Math.min(max, currentPageCount + 1),
    totalPages: currentPageCount + (latestPageHasNextPage ? 2 : 1),
  }
}
