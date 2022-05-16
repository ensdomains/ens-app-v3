import { useEns } from '@app/utils/EnsProvider'
import type { Name } from '@ensdomains/ensjs/dist/cjs/functions/getNames'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

export type ReturnedName = Name & {
  isController?: boolean
  isRegistrant?: boolean
}

const chunkArr = (arr: any[], chunkSize: number) => {
  const res = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize)
    res.push(chunk)
  }
  return res
}

export const useNamesFromAddress = ({
  address,
  sort,
  resultsPerPage,
  page,
  filter,
}: {
  address?: string
  sort: {
    type: 'labelName' | 'creationDate' | 'expiryDate'
    orderDirection: 'asc' | 'desc'
  }
  page: number
  resultsPerPage: number
  filter?: 'registration' | 'domain'
}) => {
  const { ready, getNames } = useEns()

  const { data, isLoading, status } = useQuery(
    ['names', address],
    () =>
      getNames({
        address: address!,
        type: 'all',
        orderBy: 'labelName',
        orderDirection: 'desc',
      }),
    {
      enabled: ready && !!address,
    },
  )
  const [sortedData, setSortedData] = useState<Name[] | null>(null)

  const sortFunc = useMemo(() => {
    if (sort.type === 'labelName') {
      console.log('SORT LABELNAME')
      if (sort.orderDirection === 'asc') {
        return (a: Name, b: Name) =>
          (a.truncatedName || '').localeCompare(b.truncatedName || '')
      }
      return (a: Name, b: Name) =>
        (b.truncatedName || '').localeCompare(a.truncatedName || '')
    }
    if (sort.type === 'creationDate') {
      if (sort.orderDirection === 'asc') {
        return (a: Name, b: Name) =>
          (a.registrationDate?.getTime() || a.createdAt?.getTime() || 0) -
          (b.registrationDate?.getTime() || b.createdAt?.getTime() || 0)
      }
      return (a: Name, b: Name) =>
        (b.registrationDate?.getTime() || b.createdAt?.getTime() || 0) -
        (a.registrationDate?.getTime() || a.createdAt?.getTime() || 0)
    }
    if (sort.orderDirection === 'asc') {
      return (a: Name, b: Name) =>
        (a.expiryDate?.getTime() || 0) - (b.expiryDate?.getTime() || 0)
    }
    return (a: Name, b: Name) =>
      (b.expiryDate?.getTime() || 0) - (a.expiryDate?.getTime() || 0)
  }, [sort.orderDirection, sort.type])

  useEffect(() => {
    if (status === 'success' && data) {
      console.log('resorting')
      setSortedData(
        data
          .sort(sortFunc)
          .filter((x) => (filter ? x.type === filter : true))
          .reduce((prev, curr) => {
            const existingEntry = prev.findIndex((x) => x.name === curr.name)
            const isController = curr.type === 'domain'
            const isRegistrant = curr.type === 'registration'
            const newArr = prev
            if (existingEntry !== -1) {
              newArr[existingEntry] = {
                ...prev[existingEntry],
                ...curr,
                isController:
                  newArr[existingEntry].isController || isController,
                isRegistrant:
                  newArr[existingEntry].isRegistrant || isRegistrant,
              }
            } else {
              newArr.push({
                ...curr,
                isController,
                isRegistrant,
              })
            }
            return newArr
          }, [] as ReturnedName[]),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, sort.type, sort.orderDirection, filter])

  const pages = useMemo(
    () => sortedData && chunkArr(sortedData, resultsPerPage),
    [sortedData, resultsPerPage],
  )

  const currentPage: ReturnedName[] | null = useMemo(
    () => pages && pages[page - 1],
    [pages, page],
  )

  return { currentPage, isLoading, status, pageLength: pages?.length || 0 }
}
