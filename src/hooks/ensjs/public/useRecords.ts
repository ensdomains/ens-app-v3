import {
  PlaceholderDataFunction,
  Query,
  QueryClient,
  QueryFunctionContext,
  QueryKey,
  useQueryClient,
} from '@tanstack/react-query'

import {
  GetAddressRecordReturnType,
  getRecords,
  GetRecordsParameters,
  GetRecordsReturnType,
} from '@ensdomains/ensjs/public'

import { usePrefetchQuery } from '@app/hooks/usePrefetchQuery'
import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { matchExactOrNullParamItem } from '@app/utils/query/match/matchExactOrNullParamItem'
import { matchQueryKeyMeta } from '@app/utils/query/match/matchQueryKeyMeta'
import {
  QueryKeyToInternalParams,
  queryKeyToInternalParams,
} from '@app/utils/query/match/queryKeyToInternalParams'
import { useQuery } from '@app/utils/query/useQuery'

type UseRecordsParameters<
  TTexts extends readonly string[] | undefined = undefined,
  TCoins extends readonly (string | number)[] | undefined = undefined,
  TContentHash extends boolean | undefined = undefined,
  TAbi extends boolean | undefined = undefined,
> = PartialBy<GetRecordsParameters<TTexts, TCoins, TContentHash, TAbi>, 'name'>

type UseRecordsReturnType<
  TTexts extends readonly string[] | undefined,
  TCoins extends readonly (string | number)[] | undefined,
  TContentHash extends boolean | undefined,
  TAbi extends boolean | undefined,
> =
  | GetRecordsReturnType<TTexts, TCoins, TContentHash, TAbi>
  | {
      coins: [NonNullable<GetAddressRecordReturnType>]
      contentHash?: never
      texts?: never
      abi?: never
      resolverAddress?: never
    }
  | null

type UseRecordsConfig<
  TTexts extends readonly string[] | undefined = undefined,
  TCoins extends readonly (string | number)[] | undefined = undefined,
  TContentHash extends boolean | undefined = undefined,
  TAbi extends boolean | undefined = undefined,
> = QueryConfig<UseRecordsReturnType<TTexts, TCoins, TContentHash, TAbi>, Error> & {
  keepPreviousData?: boolean
}

type UseRecordQueryKey<
  TTexts extends readonly string[] | undefined = undefined,
  TCoins extends readonly (string | number)[] | undefined = undefined,
  TContentHash extends boolean | undefined = undefined,
  TAbi extends boolean | undefined = undefined,
> = CreateQueryKey<
  UseRecordsParameters<TTexts, TCoins, TContentHash, TAbi>,
  'getRecords',
  'standard'
>

type NonFunctionGuard<T> = T extends Function ? never : T

export const getRecordsQueryFn =
  (config: ConfigWithEns) =>
  async <
    TTexts extends readonly string[] | undefined = undefined,
    TCoins extends readonly (string | number)[] | undefined = undefined,
    TContentHash extends boolean | undefined = undefined,
    TAbi extends boolean | undefined = undefined,
  >({
    queryKey: [{ name, ...params }, chainId],
  }: QueryFunctionContext<UseRecordQueryKey<TTexts, TCoins, TContentHash, TAbi>>): Promise<
    UseRecordsReturnType<TTexts, TCoins, TContentHash, TAbi>
  > => {
    if (!name) throw new Error('name is required')

    const client = config.getClient({ chainId })
    const res = await getRecords(client, {
      name,
      ...params,
    })
    if (!res) return null
    return res as GetRecordsReturnType<TTexts, TCoins, TContentHash, TAbi>
  }

export const matchGetRecordsQueryKeyWithInternalParams =
  <
    TTexts extends readonly string[] | undefined,
    TCoins extends readonly (string | number)[] | undefined,
    TContentHash extends boolean | undefined,
    TAbi extends boolean | undefined,
  >(
    internalParams: QueryKeyToInternalParams<UseRecordQueryKey<TTexts, TCoins, TContentHash, TAbi>>,
  ) =>
  <
    TQueryFnData = unknown,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >({
    queryKey: matchKey,
  }: Query<TQueryFnData, TError, TData, TQueryKey>) => {
    const {
      functionName,
      functionParams: { resolver, gatewayUrls },
    } = internalParams
    if (
      !matchQueryKeyMeta(
        { internalParams, matchFunctionName: functionName, matchParameters: ['name'] },
        matchKey,
      )
    )
      return false
    if (!matchExactOrNullParamItem(matchKey[0], { key: 'resolver', original: resolver }))
      return false
    if (
      !matchExactOrNullParamItem(matchKey[0], {
        key: 'gatewayUrls',
        original: gatewayUrls,
      })
    )
      return false
    return true
  }

const getRecordsPlaceholderData = <
  TTexts extends readonly string[] | undefined = undefined,
  TCoins extends readonly (string | number)[] | undefined = undefined,
  TContentHash extends boolean | undefined = undefined,
  TAbi extends boolean | undefined = undefined,
>({
  queryKey,
  queryClient,
  keepPreviousData,
}: {
  queryKey: UseRecordQueryKey<TTexts, TCoins, TContentHash, TAbi>
  queryClient: QueryClient
  keepPreviousData?: boolean
}):
  | PlaceholderDataFunction<
      NonFunctionGuard<UseRecordsReturnType<TTexts, TCoins, TContentHash, TAbi>>,
      Error,
      NonFunctionGuard<UseRecordsReturnType<TTexts, TCoins, TContentHash, TAbi>>,
      UseRecordQueryKey<TTexts, TCoins, TContentHash, TAbi>
    >
  | undefined => {
  if (!keepPreviousData) return undefined

  const internalParams = queryKeyToInternalParams(queryKey)

  if (!internalParams.functionParams.name) return undefined

  const matchGetRecordsQueryKey = matchGetRecordsQueryKeyWithInternalParams(internalParams)

  return (previousData, previousQuery) => {
    if (previousData && previousQuery) {
      if (matchGetRecordsQueryKey(previousQuery)) return previousData
    }

    const recordsQueries = queryClient.getQueriesData<
      GetRecordsReturnType<TTexts, TCoins, TContentHash, TAbi>
    >({
      predicate: matchGetRecordsQueryKey,
    })
    const match = recordsQueries.find((x) => x[1])
    if (match)
      return match[1] as NonFunctionGuard<GetRecordsReturnType<TTexts, TCoins, TContentHash, TAbi>>

    const addressRecordsQueries = queryClient.getQueriesData<GetAddressRecordReturnType>({
      predicate: ({ queryKey: matchKey }) => {
        if (
          !matchQueryKeyMeta(
            { internalParams, matchFunctionName: 'getAddressRecord', matchParameters: ['name'] },
            matchKey,
          )
        )
          return false
        if ('coin' in matchKey[0]) return false
        return true
      },
    })

    const matchAddress = addressRecordsQueries.find((x) => x[1])
    if (!matchAddress) return undefined

    return {
      coins: [matchAddress[1]],
    } as unknown as NonFunctionGuard<GetRecordsReturnType<TTexts, TCoins, TContentHash, TAbi>>
  }
}

export const useRecords = <
  const TTexts extends readonly string[] | undefined = undefined,
  const TCoins extends readonly (string | number)[] | undefined = undefined,
  const TContentHash extends boolean | undefined = undefined,
  const TAbi extends boolean | undefined = undefined,
>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  keepPreviousData,
  // params
  ...params
}: UseRecordsParameters<TTexts, TCoins, TContentHash, TAbi> &
  UseRecordsConfig<TTexts, TCoins, TContentHash, TAbi>) => {
  const queryClient = useQueryClient()

  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getRecords',
    queryDependencyType: 'standard',
    queryFn: getRecordsQueryFn,
  })

  const placeholderData = getRecordsPlaceholderData({
    queryClient,
    queryKey: initialOptions.queryKey,
    keepPreviousData,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.name,
    gcTime,
    staleTime,
    refetchOnMount: 'always',
  })

  const query = useQuery({
    ...preparedOptions,
    placeholderData,
  })

  return {
    ...query,
    refetchIfEnabled: preparedOptions.enabled ? query.refetch : () => {},
    isCachedData: getIsCachedData(query),
  }
}

export const usePrefetchRecords = <
  const TTexts extends readonly string[] | undefined = undefined,
  const TCoins extends readonly (string | number)[] | undefined = undefined,
  const TContentHash extends boolean | undefined = undefined,
  const TAbi extends boolean | undefined = undefined,
>(
  params: UseRecordsParameters<TTexts, TCoins, TContentHash, TAbi>,
) => {
  const initialOptions = useQueryOptions({
    params,
    functionName: 'getRecords',
    queryDependencyType: 'standard',
    queryFn: getRecordsQueryFn,
  })
  return usePrefetchQuery(initialOptions)
}
