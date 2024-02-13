import { QueryFunctionContext, useQuery , useQuery } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { useMemo } from 'react'

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
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
 
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
    gcTime,
    enabled: enabled && !!params.name && nameIsEncrypted,
    staleTime,

  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
