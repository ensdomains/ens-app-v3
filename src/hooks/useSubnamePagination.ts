import { useEns } from '@app/utils/EnsProvider'
import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'

export type Subname = {
  id: string
  name: string
  truncatedName?: string
}

const maxCalc = (subnameCount: number, page: number) => {
  if (subnameCount > 5000) {
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

      if (result.subnameCount > 5000) {
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
    return () => {
      queryClient.removeQueries('getSubnames')
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
