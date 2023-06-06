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
  const {
    data: { name: primaryName } = {},
    isLoading: isPrimaryLoading,
    isFetching: isPrimaryFetching,
  } = usePrimary(address!, !!address)

  const {
    data: ownedOrManagedNamesData,
    isLoading: isOwnedOrManagedNamesLoading,
    isFetching: isOwnedOrManagedNamesFetching,
  } = useNamesFromAddress({
    address,
    sort: {
      type: 'labelName',
      orderDirection: 'desc',
    },
    page: 1,
    resultsPerPage: 'all',
  })

  const {
    data: resolvedAddressNames,
    isLoading: isResolvedAddressNamesLoading,
    isFetching: isResolvedAddressNamesFetching,
  } = useNamesFromResolvedAddress(address!)

  const isLoading =
    isOwnedOrManagedNamesLoading || isResolvedAddressNamesLoading || isPrimaryLoading
  const isFetching =
    isResolvedAddressNamesFetching || isPrimaryFetching || isOwnedOrManagedNamesFetching

  // memoize names before search to prevent recalculations
  const resolvedOrManagedNames = useMemo(() => {
    if (!ownedOrManagedNamesData || !resolvedAddressNames) return undefined
    return mergeNames(resolvedAddressNames, ownedOrManagedNamesData.names)
      .filter(checkAvailablePrimaryName(primaryName))
      .sort(sortByType(sort.type, sort.orderDirection))
  }, [ownedOrManagedNamesData, resolvedAddressNames, primaryName, sort.type, sort.orderDirection])

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
