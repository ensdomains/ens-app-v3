import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import {
  getDecodedName,
  GetDecodedNameParameters,
  GetDecodedNameReturnType,
} from '@ensdomains/ensjs/subgraph'
import { checkIsDecrypted } from '@ensdomains/ensjs/utils'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UseDecodedNameParameters = PartialBy<GetDecodedNameParameters, 'name'>

type UseDecodedNameReturnType = GetDecodedNameReturnType

type UseDecodedNameConfig = QueryConfig<UseDecodedNameReturnType, Error>

type QueryKey<TParams extends UseDecodedNameParameters> = CreateQueryKey<
  TParams,
  'getDecodedName',
  'graph'
>

export const getDecodedNameQueryFn = async <TParams extends UseDecodedNameParameters>({
  queryKey: [{ name, ...params }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  return getDecodedName(publicClient, { name, ...params })
}

export const useDecodedName = <TParams extends UseDecodedNameParameters>({
  // config
  cacheTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
  onError,
  onSettled,
  onSuccess,
  // params
  ...params
}: TParams & UseDecodedNameConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getDecodedName',
    queryDependencyType: 'graph',
  })

  const nameIsEncrypted = useMemo(
    () => (params.name ? !checkIsDecrypted(params.name) : false),
    [params.name],
  )

  const query = useQuery(queryKey, getDecodedNameQueryFn, {
    cacheTime,
    enabled: enabled && !!params.name && nameIsEncrypted,
    staleTime,
    onError,
    onSettled,
    onSuccess,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
