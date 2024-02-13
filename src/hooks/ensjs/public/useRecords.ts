import { QueryFunctionContext, useQuery , useQuery } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'

import { getRecords, GetRecordsParameters, GetRecordsReturnType } from '@ensdomains/ensjs/public'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UseRecordsParameters<
  TTexts extends readonly string[] = readonly [string, ...string[]],
  TCoins extends readonly (string | number)[] = readonly [string | number, ...(string | number)[]],
  TContentHash extends boolean = true,
  TAbi extends boolean = true,
> = PartialBy<GetRecordsParameters<TTexts, TCoins, TContentHash, TAbi>, 'name'>

type UseRecordsConfig<
  TTexts extends readonly string[] = readonly [string, ...string[]],
  TCoins extends readonly (string | number)[] = readonly [string | number, ...(string | number)[]],
  TContentHash extends boolean = true,
  TAbi extends boolean = true,
> = QueryConfig<GetRecordsReturnType<TTexts, TCoins, TContentHash, TAbi> | null, Error>

type QueryKey<
  TTexts extends readonly string[] = readonly [string, ...string[]],
  TCoins extends readonly (string | number)[] = readonly [string | number, ...(string | number)[]],
  TContentHash extends boolean = true,
  TAbi extends boolean = true,
> = CreateQueryKey<
  UseRecordsParameters<TTexts, TCoins, TContentHash, TAbi>,
  'getRecords',
  'standard'
>

export const getRecordsQueryFn = async <
  TTexts extends readonly string[] = readonly [string, ...string[]],
  TCoins extends readonly (string | number)[] = readonly [string | number, ...(string | number)[]],
  TContentHash extends boolean = true,
  TAbi extends boolean = true,
>({
  queryKey: [{ name, ...params }, chainId],
}: QueryFunctionContext<QueryKey<TTexts, TCoins, TContentHash, TAbi>>) => {
  if (!name) throw new Error('name is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })
  const res = await getRecords(publicClient, {
    name,
    ...params,
  })
  if (!res) return null
  return res
}

export const useRecords = <
  const TTexts extends readonly string[] = readonly [string, ...string[]],
  const TCoins extends readonly (string | number)[] = readonly [
    string | number,
    ...(string | number)[],
  ],
  const TContentHash extends boolean = true,
  const TAbi extends boolean = true,
>({
  // config
  gcTime,
  enabled = true,
  staleTime,
  scopeKey,
 
  // params
  ...params
}: UseRecordsParameters<TTexts, TCoins, TContentHash, TAbi> &
  UseRecordsConfig<TTexts, TCoins, TContentHash, TAbi>) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getRecords',
    queryDependencyType: 'standard',
  })

  const query = useQuery(queryKey, getRecordsQueryFn, {
    gcTime,
    staleTime,
    enabled: enabled && !!params.name,

  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
