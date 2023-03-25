import { useCallback, useMemo, useState } from 'react'

import { useNamesFromAddress } from './useNamesFromAddress'
import { useNamesFromResolvedAddress } from './useNamesFromResolvedAddress'
import { usePrimary } from './usePrimary'

type BaseName = NonNullable<ReturnType<typeof useNamesFromAddress>['currentPage']>[number]
type Name = BaseName & { isResolvedAddress?: boolean }

export const useAvailablePrimaryNamesForAddress = ({
  address,
  sort,
  resultsPerPage,
  search,
}: {
  address?: string
  sort: {
    type: 'labelName' | 'creationDate' | 'expiryDate'
    orderDirection: 'asc' | 'desc'
    resultsPerPage: number | 'all'
    page: number
  }
  resultsPerPage: number | 'all'
  search?: string
}) => {
  const { name: primaryName } = usePrimary(address!, !!address)

  const { currentPage: ownedOrManagedNames = [], isLoading: isOwnedOrManagedNamesLoading } =
    useNamesFromAddress({
      address,
      sort: {
        type: 'labelName',
        orderDirection: 'desc',
      },
      page: 1,
      resultsPerPage: 'all',
      search,
    })

  const { names: resolvedAddressNames = [], isLoading: isResolvedAddressNamesLoading } =
    useNamesFromResolvedAddress(address!)

  const filterFunc = useMemo(() => {
    const isResolvedOrManagedName = (n: Name) =>
      n.isResolvedAddress || n.isController || n.isWrappedOwner
    const isSearchedName = (n: Name) => !search || n.name.toLocaleLowerCase().indexOf(search) !== -1
    const isNotPrimaryName = (n: Name) => !primaryName || n.name !== primaryName
    return (n: Name) => isResolvedOrManagedName(n) && isSearchedName(n) && isNotPrimaryName(n)
  }, [search, primaryName])

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

  const resolvedOrManagedNames = useMemo(() => {
    const mergedNamesMap = [
      ...resolvedAddressNames.map((name) => ({ ...name, isResolvedAddress: true })),
      ...(ownedOrManagedNames || []),
    ].reduce<{ [key: string]: Name }>((acc, curr) => {
      const { name } = curr
      if (acc[name]) acc[name] = { ...acc[name], ...curr }
      else acc[name] = curr
      return acc
    }, {})
    return Object.values(mergedNamesMap).filter(filterFunc).sort(sortFunc)
  }, [ownedOrManagedNames, resolvedAddressNames, filterFunc, sortFunc])

  const [visibleNamesCount, setVisibleNamesCount] = useState<number>(
    resultsPerPage === 'all' ? Infinity : resultsPerPage,
  )
  const visibleNames = useMemo(() => {
    if (resultsPerPage === 'all') return resolvedOrManagedNames
    return resolvedOrManagedNames.slice(0, visibleNamesCount)
  }, [resolvedOrManagedNames, visibleNamesCount, resultsPerPage])

  const hasMore = resultsPerPage === 'all' ? false : visibleNames.length < visibleNamesCount

  const loadMore = useCallback(() => {
    if (resultsPerPage !== 'all' && hasMore) setVisibleNamesCount((prev) => prev + resultsPerPage)
  }, [setVisibleNamesCount, resultsPerPage, hasMore])

  return {
    names: visibleNames,
    isLoading: isOwnedOrManagedNamesLoading || isResolvedAddressNamesLoading,
    hasMore,
    loadMore,
  }
}
