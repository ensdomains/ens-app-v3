import { infiniteQueryOptions, QueryFunctionContext } from '@tanstack/react-query'
import { useMemo } from 'react'

import type { GetSubnamesParameters, GetSubnamesReturnType } from '@ensdomains/ensjs/subgraph'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, InfiniteQueryConfig, PartialBy } from '@app/types'
import { useInfiniteQuery } from '@app/utils/query/useInfiniteQuery'
import { getSnrcSubnames } from '@app/utils/snrcSubnames'

type UseSubnamesParameters = Omit<PartialBy<GetSubnamesParameters, 'name'>, 'previousPage'>

type UseSubnamesReturnType = GetSubnamesReturnType

type UseSubnamesConfig = InfiniteQueryConfig<UseSubnamesReturnType, Error>

type QueryKey<TParams extends UseSubnamesParameters> = CreateQueryKey<
  TParams,
  'getSubnames',
  'graph'
>

export const getSubnamesQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseSubnamesParameters>({
    queryKey: [{ name, ...params }, chainId],
    pageParam,
  }: QueryFunctionContext<QueryKey<TParams>, GetSubnamesReturnType>) => {
    if (!name) throw new Error('name is required')
    // No subgraph: enumerate on-chain via the SubnameRegistrar. The whole set is
    // returned as a single page (SNRC subname sets are small).
    if (pageParam && pageParam.length > 0) return [] as GetSubnamesReturnType

    const client = config.getClient({ chainId })
    const search = (params as { searchString?: string }).searchString?.toLowerCase() || ''
    const subnames = await getSnrcSubnames(client, chainId, name)
    return subnames
      .filter((s) => !search || s.label.toLowerCase().includes(search))
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((s) => ({
        name: s.name,
        labelName: s.label,
        labelhash: s.labelhash,
        truncatedName: s.name,
        owner: s.owner,
        pccExpired: false,
        expiryDate: undefined,
        parentName: name,
        isMigrated: true,
        type: 'domain',
        createdAt: undefined,
      })) as unknown as GetSubnamesReturnType
  }

const getNextPageParam =
  <TParams extends UseSubnamesParameters>(params: TParams) =>
  (lastPage: GetSubnamesReturnType) => {
    if (lastPage?.length < (params.pageSize || 100)) return null
    return lastPage
  }

const initialPageParam = [] as GetSubnamesReturnType

export const useSubnames = <TParams extends UseSubnamesParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseSubnamesConfig) => {
  const paramsWithLowercaseSearchString = {
    ...params,
    searchString: params.searchString?.toLocaleLowerCase(),
  }

  const initialOptions = useQueryOptions({
    params: paramsWithLowercaseSearchString,
    scopeKey,
    functionName: 'getSubnames',
    queryDependencyType: 'graph',
    queryFn: getSubnamesQueryFn,
  })

  const preparedOptions = infiniteQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    getNextPageParam: getNextPageParam(paramsWithLowercaseSearchString),
    initialPageParam,
    enabled: enabled && !!paramsWithLowercaseSearchString.name,
    gcTime,
    staleTime,
  })

  const { data, status, isFetched, isFetchedAfterMount, ...rest } =
    useInfiniteQuery(preparedOptions)

  const pageCount = data?.pages.length || 0
  const nameCount = data?.pages.reduce((acc, page) => acc + page.length, 0) || 0

  const infiniteData = useMemo(
    () => (data?.pages ? data?.pages.reduce((acc, page) => [...acc, ...page], []) : []),
    [data?.pages],
  )

  return {
    data,
    infiniteData,
    page: data?.pages[0] || [],
    pageCount,
    nameCount,
    status,
    isFetched,
    isFetchedAfterMount,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
    ...rest,
  }
}
