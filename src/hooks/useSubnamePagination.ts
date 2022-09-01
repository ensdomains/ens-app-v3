import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

import { useEns } from '@app/utils/EnsProvider'

export type Subname = {
  id: string
  name: string
  truncatedName?: string
}

const maxCalc = (subnameCount: number, page: number) => {
  if (subnameCount >= 5000) {
    return page + 1 === 1 ? 2 : 3
  }
  return 5
}

export const useSubnamePagination = (name: string) => {
  const { getSubnames } = useEns()
  const isLargeQueryRef = useRef(false)
  const lastSubnamesRef = useRef<Subname[]>([])
  const [page, setPage] = useState(0)
  const queryClient = useQueryClient()
  const resultsPerPage = 10

  const {
    data: { subnames, subnameCount, max, totalPages } = {
      subnames: [],
      subnameCount: 0,
    },
    isLoading,
  } = useQuery(
    ['getSubnames', name, 'createdAt', 'desc', page, resultsPerPage],
    async () => {
      const result = await getSubnames({
        name,
        orderBy: 'createdAt',
        orderDirection: 'desc',
        page,
        pageSize: resultsPerPage,
        isLargeQuery: isLargeQueryRef.current,
        lastSubnames: lastSubnamesRef.current,
      })

      lastSubnamesRef.current = result.subnames

      if (result.subnameCount >= 5000) {
        isLargeQueryRef.current = true
      }

      return {
        ...result,
        max: maxCalc(result.subnameCount, page),
        totalPages: Math.ceil(result.subnameCount / resultsPerPage),
      }
    },
    { staleTime: Infinity, cacheTime: Infinity },
  )

  useEffect(() => {
    if (queryClient) {
      queryClient.resetQueries({ exact: false, queryKey: ['getSubnames'] })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
      queryClient.removeQueries({
        exact: false,
        queryKey: ['getSubnames'],
      })
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ['getSubnames'],
      })
    }
  }, [queryClient])

  return {
    subnames,
    subnameCount,
    isLoading,
    max,
    page,
    setPage,
    totalPages,
  }
}
