import type { Address } from 'viem'
import { useAccount, useChainId, useConfig } from 'wagmi'

import { SupportedChain } from '@app/constants/chains'
import { ConfigWithEns, CreateQueryKey, QueryDependencyType } from '@app/types'

/*
  Query types:
  - independent: Query that is not dependent on chain data, specifically chainId and address 
  - graph: Query that uses the graph 
  - standard: Query that depends on chain data directly 
*/

export type QueryKeyConfig<
  TParams extends {},
  TFunctionName extends string,
  TQueryDependencyType extends QueryDependencyType,
> = {
  params: TParams
  scopeKey?: string
  functionName: TFunctionName
  queryDependencyType: TQueryDependencyType
}

export function createQueryKey<TParams extends {}, TFunctionName extends string>(
  params: {
    chainId?: never
    address?: never
  } & QueryKeyConfig<TParams, TFunctionName, 'independent'>,
): CreateQueryKey<TParams, TFunctionName, 'independent'>
export function createQueryKey<TParams extends {}, TFunctionName extends string>(
  params: {
    chainId: SupportedChain['id']
    address: Address | undefined
  } & QueryKeyConfig<TParams, TFunctionName, 'graph'>,
): CreateQueryKey<TParams, TFunctionName, 'graph'>
export function createQueryKey<TParams extends {}, TFunctionName extends string>(
  params: {
    chainId: SupportedChain['id']
    address: Address | undefined
  } & QueryKeyConfig<TParams, TFunctionName, 'standard'>,
): CreateQueryKey<TParams, TFunctionName, 'standard'>
export function createQueryKey<TParams extends {}, TFunctionName extends string>({
  chainId,
  address,
  params,
  scopeKey,
  functionName,
  queryDependencyType,
}: {
  chainId?: SupportedChain['id']
  address?: Address | undefined
} & QueryKeyConfig<TParams, TFunctionName, QueryDependencyType>): CreateQueryKey<
  TParams,
  TFunctionName,
  QueryDependencyType
> {
  if (queryDependencyType === 'independent')
    return [params, undefined, undefined, scopeKey, functionName] as const satisfies CreateQueryKey<
      TParams,
      TFunctionName,
      'independent'
    >
  if (queryDependencyType === 'graph')
    return [
      params,
      chainId!,
      address,
      scopeKey,
      functionName,
      'graph',
    ] as const satisfies CreateQueryKey<TParams, TFunctionName, 'graph'>
  return [params, chainId!, address, scopeKey, functionName] as const satisfies CreateQueryKey<
    TParams,
    TFunctionName,
    'standard'
  >
}

// ensure that keyOnly is set to true if queryFn is not provided
type RequireKeyOnlyAssert<TQueryFn> = [TQueryFn] extends [undefined] ? { keyOnly: true } : {}
type GetConfig<T> = T extends (config: infer F) => unknown ? F : never

export function useQueryOptions<
  TParams extends {},
  TFunctionName extends string,
  TQueryFn extends unknown | undefined = undefined,
>(
  params: QueryKeyConfig<TParams, TFunctionName, 'independent'> & {
    queryFn?: TQueryFn
  } & RequireKeyOnlyAssert<TQueryFn>,
): {
  queryKey: CreateQueryKey<TParams, TFunctionName, 'independent'>
  queryFn: TQueryFn
}
export function useQueryOptions<
  TParams extends {},
  TFunctionName extends string,
  TQueryFn = undefined,
  TConfig extends GetConfig<TQueryFn> = GetConfig<TQueryFn>,
  TIsEnsConfig extends TConfig extends { _isEns: true } ? true : false = TConfig extends {
    _isEns: true
  }
    ? true
    : false,
>(
  params: QueryKeyConfig<TParams, TFunctionName, 'graph'> & {
    queryFn?: TQueryFn
  } & RequireKeyOnlyAssert<TQueryFn>,
): {
  queryKey: CreateQueryKey<TParams, TFunctionName, 'graph'>
  queryFn: TIsEnsConfig extends true
    ? TQueryFn extends (config: ConfigWithEns) => infer F
      ? F
      : never
    : 'Ensure config param is ConfigWithEns'
}

export function useQueryOptions<
  TParams extends {},
  TFunctionName extends string,
  TQueryFn = undefined,
  TConfig extends GetConfig<TQueryFn> = GetConfig<TQueryFn>,
  TIsEnsConfig extends TConfig extends { _isEns: true } ? true : false = TConfig extends {
    _isEns: true
  }
    ? true
    : false,
>(
  params: QueryKeyConfig<TParams, TFunctionName, 'standard'> & {
    queryFn?: TQueryFn
  } & RequireKeyOnlyAssert<TQueryFn>,
): {
  queryKey: CreateQueryKey<TParams, TFunctionName, 'standard'>
  queryFn: TIsEnsConfig extends true
    ? TQueryFn extends (config: ConfigWithEns) => infer F
      ? F
      : never
    : 'Ensure config param is ConfigWithEns'
}

export function useQueryOptions<
  TParams extends {},
  TFunctionName extends string,
  TQueryFn extends (config: ConfigWithEns) => unknown,
>({
  params,
  scopeKey,
  functionName,
  queryDependencyType,
  queryFn,
}: QueryKeyConfig<TParams, TFunctionName, QueryDependencyType> & { queryFn?: TQueryFn }) {
  const chainId = useChainId()
  const { address } = useAccount()
  const config = useConfig()

  if (queryDependencyType === 'independent')
    return {
      queryKey: createQueryKey({ params, scopeKey, functionName, queryDependencyType }),
      // independent queries should never require config passthrough, since they don't use chain data
      queryFn,
    }

  const queryFnWithConfig = queryFn ? queryFn(config) : undefined
  if (queryDependencyType === 'graph')
    return {
      queryKey: createQueryKey({
        chainId,
        address,
        params,
        scopeKey,
        functionName,
        queryDependencyType,
      }),
      queryFn: queryFnWithConfig,
    }

  return {
    queryKey: createQueryKey({
      chainId,
      address,
      params,
      scopeKey,
      functionName,
      queryDependencyType,
    }),
    queryFn: queryFnWithConfig,
  }
}
