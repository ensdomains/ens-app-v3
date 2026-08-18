import { infiniteQueryOptions, QueryFunctionContext } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import {
  getNamesForAddress,
  GetNamesForAddressParameters,
  GetNamesForAddressReturnType,
} from '@ensdomains/ensjs/subgraph'

import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, InfiniteQueryConfig, PartialBy } from '@app/types'
import { useInfiniteQuery } from '@app/utils/query/useInfiniteQuery'
import { removeStaleWrappedNameData } from '@app/utils/removeStaleWrappedNameData'

type UseNamesForAddressParameters = Omit<
  PartialBy<GetNamesForAddressParameters, 'address'>,
  'previousPage'
>

type UseNamesForAddressReturnType = GetNamesForAddressReturnType

type UseNamesForAddressConfig = InfiniteQueryConfig<UseNamesForAddressReturnType, Error>

type QueryKey<TParams extends UseNamesForAddressParameters> = CreateQueryKey<
  TParams,
  'getNamesForAddress',
  'graph'
>

export const getNamesForAddressQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseNamesForAddressParameters>({
    queryKey: [{ address, ...params }, chainId],
    pageParam,
  }: QueryFunctionContext<QueryKey<TParams>, GetNamesForAddressReturnType>) => {
    if (!address) throw new Error('address is required')

    const client = config.getClient({ chainId })

    return getNamesForAddress(client, { address, ...params, previousPage: pageParam })
  }

const getNextPageParam =
  <TParams extends UseNamesForAddressParameters>(params: TParams) =>
  (lastPage: GetNamesForAddressReturnType) => {
    if (lastPage?.length < (params.pageSize || 100)) return null
    return lastPage
  }

const initialPageParam = [] as GetNamesForAddressReturnType

export const useNamesForAddress = <TParams extends UseNamesForAddressParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseNamesForAddressConfig) => {
  const paramsWithLowercaseSearchString = {
    ...params,
    filter: { ...params.filter, searchString: params.filter?.searchString?.toLocaleLowerCase() },
  }

  const initialOptions = useQueryOptions({
    params: paramsWithLowercaseSearchString,
    scopeKey,
    functionName: 'getNamesForAddress',
    queryDependencyType: 'graph',
    queryFn: getNamesForAddressQueryFn,
  })

  const preparedOptions = infiniteQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    getNextPageParam: getNextPageParam(paramsWithLowercaseSearchString),
    initialPageParam,
    enabled: enabled && !!paramsWithLowercaseSearchString.address,
    gcTime,
    staleTime,
  })

  const { data, status, isFetched, isFetching, isLoading, isFetchedAfterMount, ...rest } =
    useInfiniteQuery(preparedOptions)

  const [unfilteredPages, setUnfilteredPages] = useState<GetNamesForAddressReturnType>([])

  const nameWrapperAddress = useContractAddress({ contract: 'ensNameWrapper' })

  // stale wrapped data is removed here rather than in the query function so that the
  // raw pages are preserved in the cache, since ensjs relies on the last page's data
  // to create the pagination cursor for the next page
  const { normalisedData, infiniteData } = useMemo(() => {
    if (!data) {
      return {
        normalisedData: data,
        infiniteData: [] as GetNamesForAddressReturnType,
      }
    }

    const pages = data.pages.map((page) =>
      removeStaleWrappedNameData({ names: page, nameWrapperAddress }),
    )

    return {
      normalisedData: { ...data, pages },
      infiniteData: pages.reduce<GetNamesForAddressReturnType>(
        (acc, page) => [...acc, ...page],
        [],
      ),
    }
  }, [data, nameWrapperAddress])

  useEffect(() => {
    if (!paramsWithLowercaseSearchString.filter?.searchString) {
      setUnfilteredPages(infiniteData)
    }
  }, [paramsWithLowercaseSearchString.filter?.searchString, infiniteData])

  const infiniteDataWithFetchingFill = useMemo(
    () =>
      paramsWithLowercaseSearchString.filter?.searchString && isFetching
        ? unfilteredPages.filter(
            (x) => x.labelName?.includes(paramsWithLowercaseSearchString.filter!.searchString!),
          )
        : infiniteData,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isFetching,
      unfilteredPages,
      paramsWithLowercaseSearchString.filter?.searchString,
      infiniteData,
    ],
  )

  const nameCount = infiniteDataWithFetchingFill.length || 0

  return {
    data: normalisedData,
    infiniteData: infiniteDataWithFetchingFill,
    page: normalisedData?.pages[0] || [],
    nameCount,
    status,
    isFetched,
    isFetching,
    isFetchedAfterMount,
    isLoading: !paramsWithLowercaseSearchString.filter?.searchString
      ? isLoading
      : !infiniteDataWithFetchingFill.length && isLoading,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
    ...rest,
  }
}
