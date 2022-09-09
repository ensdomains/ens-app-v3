import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInfiniteQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'

export type Subname = {
  id: string
  name: string
  truncatedName?: string
}

export const useSubnamePagination = (name: string, page: number) => {
  const _page = page - 1
  const resultsPerPage = 10

  const queryClient = useQueryClient()
  const { getSubnames } = useEns()

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['getSubnames', name],
    async ({ pageParam }) => {
      const result = await getSubnames({
        name,
        page: 0,
        isLargeQuery: true,
        lastSubnames: pageParam || [{ createdAt: Math.floor(Date.now() / 1000) }],
        orderBy: 'createdAt',
        orderDirection: 'desc',
        pageSize: 10,
      })

      return {
        ...result,
        totalPages: Math.ceil(result.subnameCount / resultsPerPage),
      }
    },
    {
      getNextPageParam: (last) => (last.subnames.length > 0 ? last.subnames : undefined),
      getPreviousPageParam: (_, all) => all[all.length - 2]?.subnames,
      refetchOnMount: 'always',
    },
  )

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
