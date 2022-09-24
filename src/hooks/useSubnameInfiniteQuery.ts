import { useQueryClient } from '@tanstack/react-query'
import { useInfiniteQuery } from 'wagmi'

import { SortDirection, SortType } from '@app/components/@molecules/NameTableHeader/NameTableHeader'
import { useEns } from '@app/utils/EnsProvider'

const PAGE_SIZE = 10

export type Subname = {
  id: string
  name: string
  truncatedName?: string
  resultsPerPage?: number
  searchQuery?: string
  owner?: {
    id?: string
  }
}

export type SubnameSortType = Exclude<SortType, SortType.expiryDate>

export const useSubnameInfiniteQuery = (
  name: string,
  orderBy?: SubnameSortType,
  orderDirection?: SortDirection,
  search?: string,
) => {
  const queryClient = useQueryClient()
  const { getSubnames } = useEns()

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery(
    ['getSubnames', name, orderBy, orderDirection, search],
    async ({ pageParam }) => {
      const result = await getSubnames({
        name,
        lastSubnames: pageParam,
        orderBy: orderBy === 'creationDate' ? 'createdAt' : 'labelName',
        orderDirection,
        pageSize: PAGE_SIZE,
        search,
      })

      const ownedSubnames = result.subnames.filter(
        (subname) => subname.owner.id !== '0x0000000000000000000000000000000000000000',
      )
      const isPageSize = result.subnames.length === PAGE_SIZE
      const lastSubname = isPageSize ? result.subnames[result.subnames.length - 1] : undefined
      return {
        subnames: ownedSubnames,
        lastSubname,
        subnameCount: result.subnameCount,
      }
    },
    {
      getNextPageParam: (last) => (last.lastSubname ? [last.lastSubname] : undefined),
      refetchOnMount: 'always',
    },
  )

  const reset = () => {
    queryClient.invalidateQueries({ exact: false, queryKey: ['getSubnames'] })
  }

  const subnames: Subname[] =
    data?.pages.reduce<Subname[]>((acc, curr) => {
      return [...acc, ...(curr.subnames || [])]
    }, []) || ([] as Subname[])

  return {
    subnames,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    hasResults: !!data?.pages[0].subnameCount,
    reset,
    refetch,
  }
}
