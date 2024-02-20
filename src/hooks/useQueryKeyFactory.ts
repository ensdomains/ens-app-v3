import type { Address } from 'viem'
import { Config, useAccount, useConfig } from 'wagmi'

import { CreateQueryKey, QueryDependencyType } from '@app/types'

import { useChainId } from './chain/useChainId'

type QueryKeyConfig<
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
    chainId: number
    address: Address | undefined
  } & QueryKeyConfig<TParams, TFunctionName, 'graph'>,
): CreateQueryKey<TParams, TFunctionName, 'graph'>
export function createQueryKey<TParams extends {}, TFunctionName extends string>(
  params: {
    chainId: number
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
  chainId?: number
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

export function useQueryOptions<
  TParams extends {},
  TFunctionName extends string,
  TQueryFn extends (config: Config) => unknown,
  TQueryInnerFn = TQueryFn extends (config: Config) => infer F ? F : never,
>(
  params: QueryKeyConfig<TParams, TFunctionName, 'independent'> & { queryFn: TQueryFn },
): {
  queryKey: CreateQueryKey<TParams, TFunctionName, 'independent'>
  queryFn: TQueryInnerFn
}
export function useQueryOptions<
  TParams extends {},
  TFunctionName extends string,
  TQueryFn extends (config: Config) => unknown,
  TQueryInnerFn = TQueryFn extends (config: Config) => infer F ? F : never,
>(
  params: QueryKeyConfig<TParams, TFunctionName, 'graph'> & { queryFn: TQueryFn },
): {
  queryKey: CreateQueryKey<TParams, TFunctionName, 'graph'>
  queryFn: TQueryInnerFn
}
export function useQueryOptions<
  TParams extends {},
  TFunctionName extends string,
  TQueryFn extends (config: Config) => unknown,
  TQueryInnerFn = TQueryFn extends (config: Config) => infer F ? F : never,
>(
  params: QueryKeyConfig<TParams, TFunctionName, 'standard'> & { queryFn: TQueryFn },
): {
  queryKey: CreateQueryKey<TParams, TFunctionName, 'standard'>
  queryFn: TQueryInnerFn
}
export function useQueryOptions<
  TParams extends {},
  TFunctionName extends string,
  TQueryFn extends (config: Config) => unknown,
>({
  params,
  scopeKey,
  functionName,
  queryDependencyType,
  queryFn,
}: QueryKeyConfig<TParams, TFunctionName, QueryDependencyType> & { queryFn: TQueryFn }) {
  const chainId = useChainId()
  const { address } = useAccount()
  const config = useConfig()

  const queryFnWithConfig = queryFn(config)

  if (queryDependencyType === 'independent')
    return {
      queryKey: createQueryKey({ params, scopeKey, functionName, queryDependencyType }),
      queryFn: queryFnWithConfig,
    }
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
