import type { Address } from 'viem'
import { useAccount } from 'wagmi'

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

export function useQueryKeyFactory<TParams extends {}, TFunctionName extends string>(
  params: QueryKeyConfig<TParams, TFunctionName, 'independent'>,
): CreateQueryKey<TParams, TFunctionName, 'independent'>
export function useQueryKeyFactory<TParams extends {}, TFunctionName extends string>(
  params: QueryKeyConfig<TParams, TFunctionName, 'graph'>,
): CreateQueryKey<TParams, TFunctionName, 'graph'>
export function useQueryKeyFactory<TParams extends {}, TFunctionName extends string>(
  params: QueryKeyConfig<TParams, TFunctionName, 'standard'>,
): CreateQueryKey<TParams, TFunctionName, 'standard'>
export function useQueryKeyFactory<TParams extends {}, TFunctionName extends string>({
  params,
  scopeKey,
  functionName,
  queryDependencyType,
}: QueryKeyConfig<TParams, TFunctionName, QueryDependencyType>): CreateQueryKey<
  TParams,
  TFunctionName,
  QueryDependencyType
> {
  const chainId = useChainId()
  const { address } = useAccount()

  if (queryDependencyType === 'independent')
    return createQueryKey({ params, scopeKey, functionName, queryDependencyType })
  if (queryDependencyType === 'graph')
    return createQueryKey({
      chainId,
      address,
      params,
      scopeKey,
      functionName,
      queryDependencyType,
    })

  return createQueryKey({
    chainId,
    address,
    params,
    scopeKey,
    functionName,
    queryDependencyType,
  })
}
