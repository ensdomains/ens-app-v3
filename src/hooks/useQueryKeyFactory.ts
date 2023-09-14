import { useAccount } from 'wagmi'

import { CreateQueryKey } from '@app/types'

import { useChainId } from './chain/useChainId'

export function useQueryKeyFactory<TParams extends {}, TFunctionName extends string>({
  params,
  scopeKey,
  functionName,
  isGraphQuery,
}: {
  params: TParams
  scopeKey?: string
  functionName: TFunctionName
  isGraphQuery: false
}): CreateQueryKey<TParams, TFunctionName, false>
export function useQueryKeyFactory<TParams extends {}, TFunctionName extends string>({
  params,
  scopeKey,
  functionName,
  isGraphQuery,
}: {
  params: TParams
  scopeKey?: string
  functionName: TFunctionName
  isGraphQuery: true
}): CreateQueryKey<TParams, TFunctionName, true>
export function useQueryKeyFactory<TParams extends {}, TFunctionName extends string>({
  params,
  scopeKey,
  functionName,
  isGraphQuery,
}: {
  params: TParams
  scopeKey?: string
  functionName: TFunctionName
  isGraphQuery: boolean
}): CreateQueryKey<TParams, TFunctionName, boolean> {
  const chainId = useChainId()
  const { address } = useAccount()

  if (isGraphQuery) {
    return [params, chainId, address ?? undefined, scopeKey, functionName, 'graph'] as const
  } else {
    return [params, chainId, address ?? undefined, scopeKey, functionName] as const
  }
}
