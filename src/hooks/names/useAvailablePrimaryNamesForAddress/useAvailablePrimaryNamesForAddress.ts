import { useCallback, useMemo, useState } from 'react'

import { Name as BaseName } from '@ensdomains/ensjs/functions/getNames'

import { useNamesFromAddress } from '@app/hooks/names/useNamesFromAddress/useNamesFromAddress'
import { chunkArr } from '@app/utils/array'

import { usePrimary } from '../../usePrimary'
import { filterBySearch, sortByType } from '../useNamesFromAddress/utils'
import { useNamesFromResolvedAddress } from '../useNamesFromResolvedAddress/useNamesFromResolvedAddress'
import { checkAvailablePrimaryName, mergeNames } from './utils'

export type Name = BaseName & {
  isController?: boolean
  isRegistrant?: boolean
  isWrappedOwner?: boolean
  isResolvedAddress?: boolean
}

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
  }
  resultsPerPage: number | 'all'
  search?: string
}) => {
  const primary = usePrimary(address!, !!address)

  const namesFromAddress = useNamesFromAddress({
    address,
    sort: {
      type: 'labelName',
      orderDirection: 'desc',
    },
    page: 1,
    resultsPerPage: 'all',
  })

  const namesFromResolvedAddress = useNamesFromResolvedAddress(address!)

  const isLoading =
    namesFromAddress.isLoading || namesFromResolvedAddress.isLoading || primary.isLoading
  const isFetching =
    namesFromResolvedAddress.isFetching || primary.isFetching || namesFromAddress.isFetching

  // memoize names before search to prevent recalculations
  const resolvedOrManagedNames = useMemo(() => {
    if (!namesFromAddress.data || !namesFromResolvedAddress.data) return undefined
    return mergeNames(namesFromResolvedAddress.data, namesFromAddress.data.names)
      .filter(checkAvailablePrimaryName(primary.data?.name))
      .sort(sortByType(sort.type, sort.orderDirection))
  }, [
    namesFromAddress.data,
    namesFromResolvedAddress.data,
    primary.data?.name,
    sort.type,
    sort.orderDirection,
  ])

  // memoize pages to prevent recalculations for each page
  const pages = useMemo(() => {
    if (!resolvedOrManagedNames) return undefined
    const searchedNames = resolvedOrManagedNames.filter(filterBySearch(search))
    return resultsPerPage === 'all' ? [searchedNames] : chunkArr(searchedNames, resultsPerPage)
  }, [resolvedOrManagedNames, resultsPerPage, search])

  const [page, setPage] = useState(0)
  const hasNextPage = resultsPerPage === 'all' ? false : pages && pages[page + 1]?.length > 0

  const fetchNextPage = useCallback(() => {
    if (hasNextPage) setPage((prev) => prev + 1)
  }, [hasNextPage])

  const data = useMemo(() => {
    if (!pages) return undefined
    return {
      pages: pages.slice(0, page + 1),
    }
  }, [pages, page])

  return {
    data,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  }
}
