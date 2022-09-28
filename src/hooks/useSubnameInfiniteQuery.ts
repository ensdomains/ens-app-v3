import { useMemo } from 'react'
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
  exclude?: string[],
) => {
  const { getSubnames } = useEns()

  const queryKey = ['getSubnames', name, orderBy, orderDirection, search]
  console.log('queryKey', queryKey)
  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery(
    queryKey,
    async ({ pageParam }) => {
      const result = await getSubnames({
        name,
        lastSubnames: pageParam,
        orderBy: orderBy === 'creationDate' ? 'createdAt' : 'labelName',
        orderDirection,
        pageSize: PAGE_SIZE,
        search,
      })

      console.log('result', result)

      const ownedSubnames = result.subnames.filter(
        (subname) => subname.owner.id !== '0x0000000000000000000000000000000000000000',
      )
      const isPageSize = result.subnames.length >= PAGE_SIZE
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
      enabled: !!name,
    },
  )

  /**
   * Since we don't have an event to know when graph-node has updated, we won't know when to refetch to update the list.
   * Instead I use a filter to exclude subnames that have been deleted.
   */
  const subnames: Subname[] = useMemo(() => {
    return (
      data?.pages.reduce<Subname[]>((acc, curr) => {
        return [...acc, ...(curr.subnames.filter((s) => !exclude?.includes(s.name)) || [])]
      }, []) || ([] as Subname[])
    )
  }, [data, exclude])

  return {
    subnames,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    hasResults: !!data?.pages[0].subnameCount,
    refetch,
  }
}
