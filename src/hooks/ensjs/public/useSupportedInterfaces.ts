import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { Hex } from 'viem'

import {
  getSupportedInterfaces,
  GetSupportedInterfacesParameters,
  GetSupportedInterfacesReturnType,
} from '@ensdomains/ensjs/public'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UseSupportedInterfacesParameters<TInterfaces extends readonly Hex[] = readonly Hex[]> =
  PartialBy<GetSupportedInterfacesParameters<TInterfaces>, 'address'>

type UseSupportedInterfacesReturnType<TInterfaces extends readonly Hex[]> =
  GetSupportedInterfacesReturnType<TInterfaces>

type UseSupportedInterfacesConfig<TParams extends UseSupportedInterfacesParameters> = QueryConfig<
  UseSupportedInterfacesReturnType<TParams['interfaces']>,
  Error
>

type QueryKey<TParams extends UseSupportedInterfacesParameters> = CreateQueryKey<
  TParams,
  'getSupportedInterfaces',
  'standard'
>

export const getSupportedInterfacesQueryFn = async <
  TParams extends UseSupportedInterfacesParameters,
>({
  queryKey: [{ address, ...params }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!address) throw new Error('address is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  return getSupportedInterfaces(publicClient, { address, ...params })
}

export const useSupportedInterfaces = <
  const TInterfaces extends readonly Hex[],
  TParams extends
    UseSupportedInterfacesParameters<TInterfaces> = UseSupportedInterfacesParameters<TInterfaces>,
>({
  // config
  gcTime,
  enabled = true,
  staleTime,
  scopeKey,

  // params
  ...params
}: TParams & UseSupportedInterfacesConfig<TParams>) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getSupportedInterfaces',
    queryDependencyType: 'standard',
  })

  const query = useQuery({
    queryKey,
    queryFn: getSupportedInterfacesQueryFn,
    gcTime,
    staleTime,
    enabled: enabled && !!params.address && params.interfaces.length > 0,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
