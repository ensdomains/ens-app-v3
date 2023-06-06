import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import type { Name } from '@ensdomains/ensjs/functions/getNames'

import { useGlobalErrorFunc } from '@app/hooks/errors/useGlobalErrorFunc'
import { useBlockTimestamp } from '@app/hooks/useBlockTimestamp'
import { useEns } from '@app/utils/EnsProvider'
import { chunkArr } from '@app/utils/array'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { filterBySearch, filterByType, isValidName, mergeNames, sortByType } from './utils'

export type ReturnedName = Name & {
  isController?: boolean
  isRegistrant?: boolean
  isWrappedOwner?: boolean
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

  const {
    data: blockTimestamp,
    isLoading: isBlockTimestampLoading,
    isFetching: isBlockTimestampFetching,
    isError: isBlockTimestampError,
  } = useBlockTimestamp()

  const queryKey = useQueryKeys().namesFromAddress(address)

  const { watchedFunc: watchedGetNames } = useGlobalErrorFunc<typeof getNames>({
    queryKey,
    func: getNames,
  })

  const {
    data: mixedNames,
    isLoading: isGetNamesLoading,
    isFetching: isGetNamesFetching,
    isError: isGetNamesError,
    status,
    refetch,
  } = useQuery(
    queryKey,
    () =>
      watchedGetNames({
        address: address!,
        type: 'all',
        orderBy: 'labelName',
        orderDirection: 'desc',
      }).then((r) => r || null),
    {
      enabled: ready && !!address && !isBlockTimestampLoading,
    },
  )

  // memoize the data before search to avoid reprocessing the data on every search
  const presearchNames = useMemo(() => {
    if (!mixedNames || !blockTimestamp) return undefined
    return mergeNames(mixedNames)
      .filter((name) => isValidName(blockTimestamp)(name) && filterByType(filter)(name))
      .sort(sortByType(sort.type, sort.orderDirection))
  }, [mixedNames, blockTimestamp, sort.type, sort.orderDirection, filter])

  // memoize pages data so changing page doesn't reprocess the data
  const pages = useMemo(() => {
    if (!presearchNames) return undefined
    const searchedNames = presearchNames?.filter(filterBySearch(search))
    return resultsPerPage === 'all' ? [searchedNames] : chunkArr(searchedNames, resultsPerPage)
  }, [presearchNames, search, resultsPerPage])

  const data = useMemo(() => {
    if (!pages) return undefined
    return {
      names: pages[page - 1] || [],
      pageCount: pages?.length || 0,
      nameCount: presearchNames?.length || 0,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, page])

  const isLoading = !ready || isGetNamesLoading || isBlockTimestampLoading
  const isFetching = isGetNamesFetching || isBlockTimestampFetching
  const isError = isGetNamesError || isBlockTimestampError

  return {
    data,
    isLoading,
    isFetching,
    isError,
    status,
    refetch,
  }
}
