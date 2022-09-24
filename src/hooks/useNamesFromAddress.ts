import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'wagmi'

import type { Name } from '@ensdomains/ensjs/functions/getNames'

import { useEns } from '@app/utils/EnsProvider'

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
  search,
}: {
  address?: string
  sort: {
    type: 'labelName' | 'creationDate' | 'expiryDate'
    orderDirection: 'asc' | 'desc'
  }
  page: number
  resultsPerPage: number | 'all'
  filter?: Name['type']
  search?: string
}) => {
  const { ready, getNames } = useEns()

  const { data, isLoading, status, refetch } = useQuery(
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

  const mergedData = useMemo(() => {
    if (!data) return []
    const nameMap = data.reduce((map, curr) => {
      const existingEntry = map[curr.name] || {}
      const isController = curr.type === 'domain'
      const isRegistrant = curr.type === 'registration'
      const newMap = map
      newMap[curr.name] = {
        ...existingEntry,
        ...curr,
        isController: existingEntry.isController || isController,
        isRegistrant: existingEntry.isRegistrant || isRegistrant,
      }
      const newItem = newMap[curr.name]
      if (newItem.expiryDate) newItem.expiryDate = new Date(newItem.expiryDate)
      if (newItem.createdAt) newItem.createdAt = new Date(newItem.createdAt)
      if (newItem.registrationDate) newItem.registrationDate = new Date(newItem.registrationDate)
      return newMap
    }, {} as { [key: string]: ReturnedName })
    return Object.values(nameMap)
  }, [data])

  const [sortedData, setSortedData] = useState<Name[] | null>(null)

  const filterFunc = useMemo(() => {
    const baseFilter = (n: ReturnedName) => n.parent.name !== 'addr.reverse'
    let secondaryFilter: (n: ReturnedName) => boolean = () => true
    let searchFilter: (n: ReturnedName) => boolean = () => true
    if (filter === 'registration') secondaryFilter = (n: ReturnedName) => !!n.isRegistrant
    if (filter === 'domain') secondaryFilter = (n: ReturnedName) => !!n.isController
    if (search)
      searchFilter = (n: ReturnedName) => n.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
    return (n: ReturnedName) => baseFilter(n) && secondaryFilter(n) && searchFilter(n)
  }, [filter, search])

  const sortFunc = useMemo(() => {
    if (sort.type === 'labelName') {
      if (sort.orderDirection === 'asc') {
        return (a: Name, b: Name) => (a.truncatedName || '').localeCompare(b.truncatedName || '')
      }
      return (a: Name, b: Name) => (b.truncatedName || '').localeCompare(a.truncatedName || '')
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
      return (a: Name, b: Name) => {
        if (!a.expiryDate) {
          return 1
        }
        return (a.expiryDate?.getTime() || 0) - (b.expiryDate?.getTime() || 0)
      }
    }
    return (a: Name, b: Name) => (b.expiryDate?.getTime() || 0) - (a.expiryDate?.getTime() || 0)
  }, [sort.orderDirection, sort.type])

  useEffect(() => {
    if (status === 'success' && mergedData) {
      setSortedData(mergedData.filter(filterFunc).sort(sortFunc))
    }
  }, [status, mergedData, sortFunc, filterFunc])

  const pages = useMemo(
    () =>
      sortedData &&
      (resultsPerPage === 'all' ? [sortedData] : chunkArr(sortedData, resultsPerPage)),
    [sortedData, resultsPerPage],
  )

  const currentPage: ReturnedName[] | null = useMemo(() => pages && pages[page - 1], [pages, page])

  return {
    currentPage,
    isLoading,
    status,
    refetch,
    pageLength: pages?.length || 0,
    nameCount: sortedData?.length || 0,
  }
}
