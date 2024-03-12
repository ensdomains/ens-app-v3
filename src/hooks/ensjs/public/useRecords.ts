import {
  PlaceholderDataFunction,
  Query,
  QueryClient,
  QueryFunctionContext,
  QueryKey,
  useQuery,
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
import { stringify } from '@app/utils/query/persist'

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

const matchingMetaParam = <TKey extends string, TData, TParams extends object>({
  key,
  original,
  params: params_,
}: {
  key: TKey
  original: TData
  params: TParams
}) => {
  const params = params_ as object & Record<TKey, unknown>
  if (original) {
    if (!(key in params) || !params[key]) return false
    if (stringify(original) !== stringify(params[key])) return false
  } else if (key in params && params[key]) return false
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

  const [{ name, resolver, gatewayUrls }, chainId, address, scopeKey, functionName] = queryKey

  if (!name) return undefined

  const matchingBasicMeta = <TFunctionName extends string>(
    matchFunctionName: TFunctionName,
    matchKey: QueryKey,
  ): matchKey is CreateQueryKey<object & { name: string }, TFunctionName, 'standard'> => {
    if (matchKey[4] !== matchFunctionName) return false
    if (matchKey[1] !== chainId) return false
    if (matchKey[2] !== address) return false
    if (matchKey[3] !== scopeKey) return false
    if (typeof matchKey[0] !== 'object' || !matchKey[0]) return false
    if (!('name' in matchKey[0]) || matchKey[0].name !== name) return false
    return true
  }

  const matchingGetRecordsQuery = <
    TQueryFnData = unknown,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >({
    queryKey: matchKey,
  }: Query<TQueryFnData, TError, TData, TQueryKey>) => {
    if (!matchingBasicMeta(functionName, matchKey)) return false
    if (!matchingMetaParam({ key: 'resolver', original: resolver, params: matchKey[0] }))
      return false
    if (!matchingMetaParam({ key: 'gatewayUrls', original: gatewayUrls, params: matchKey[0] }))
      return false
    return true
  }

  return (previousData, previousQuery) => {
    if (previousData && previousQuery) {
      if (matchingGetRecordsQuery(previousQuery)) return previousData
    }

    const recordsQueries = queryClient.getQueriesData<
      GetRecordsReturnType<TTexts, TCoins, TContentHash, TAbi>
    >({
      predicate: matchingGetRecordsQuery,
    })
    const match = recordsQueries.find((x) => x[1])
    if (match)
      return match[1] as NonFunctionGuard<GetRecordsReturnType<TTexts, TCoins, TContentHash, TAbi>>

    const addressRecordsQueries = queryClient.getQueriesData<GetAddressRecordReturnType>({
      predicate: ({ queryKey: matchKey }) => {
        if (!matchingBasicMeta('getAddressRecord', matchKey)) return false
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
