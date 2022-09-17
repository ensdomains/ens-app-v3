import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInfiniteQuery } from 'wagmi'

import { SortDirection, SortType } from '@app/components/@molecules/NameTableHeader/NameTableHeader'
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

  const _page = 0
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['getSubnames', name],
    async ({ pageParam }) => {
      const result = await getSubnames({
        name,
        lastSubnames: pageParam,
        orderBy: orderBy === 'creationDate' ? 'createdAt' : 'labelName',
        orderDirection,
        pageSize,
        search,
      })

      return {
        ...result,
        totalPages: Math.ceil(result.subnameCount / pageSize),
      }
    },
    {
      getNextPageParam: (last) => (last.subnames.length > 0 ? last.subnames : undefined),
      getPreviousPageParam: (_, all) => all[all.length - 2]?.subnames,
      refetchOnMount: 'always',
    },
  )

  console.log('pages', data?.pages)
  const latestPage = data?.pages && data.pages[data.pages.length - 1]
  const currentPage = data?.pages[_page]?.subnames || latestPage?.subnames || []
  const hasCurrentPage = (data?.pages[_page]?.subnames?.length || 0) > 0

  useEffect(() => {
    if (queryClient) {
      queryClient.resetQueries({ exact: false, queryKey: ['getSubnames'] })
    }
  }, [queryClient])

  useEffect(() => {
    if (!hasCurrentPage && hasNextPage) {
      fetchNextPage()
    }
  }, [hasCurrentPage, fetchNextPage, hasNextPage])

  return {
    subnames: currentPage,
    subnameCount: latestPage?.subnameCount || 0,
    isLoading,
    isFetching: !hasCurrentPage,
    max: _page + 1 === 1 ? 2 : 3,
    totalPages: latestPage?.totalPages || 0,
  }
}
