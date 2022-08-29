import { useEns } from '@app/utils/EnsProvider'
import { useEffect } from 'react'
import { useInfiniteQuery } from 'wagmi'

export type Subname = {
  id: string
  name: string
  truncatedName?: string
}

export const useSubnamePagination = (name: string, page: number) => {
  const _page = page - 1
  const { getSubnames } = useEns()
  const resultsPerPage = 10

  const { data, isLoading, fetchNextPage } = useInfiniteQuery(
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
      getNextPageParam: (last) => last.subnames,
      getPreviousPageParam: (_, all) => all[all.length - 2]?.subnames,
    },
  )

  const latestPage = data?.pages && data.pages[data.pages.length - 1]
  const currentPage = data?.pages[_page]?.subnames || latestPage?.subnames || []
  const hasCurrentPage = (data?.pages[_page]?.subnames?.length || 0) > 0

  useEffect(() => {
    if (!hasCurrentPage) {
      fetchNextPage()
    }
  }, [hasCurrentPage, fetchNextPage])

  return {
    subnames: currentPage,
    subnameCount: latestPage?.subnameCount || 0,
    isLoading,
    isFetching: !hasCurrentPage,
    max: _page + 1 === 1 ? 2 : 3,
    totalPages: latestPage?.totalPages || 0,
  }
}
