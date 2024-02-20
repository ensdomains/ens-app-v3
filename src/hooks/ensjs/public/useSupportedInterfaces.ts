import { QueryFunctionContext, queryOptions, useQuery } from '@tanstack/react-query'
import { Hex } from 'viem'
import { Config } from 'wagmi'

import {
  getSupportedInterfaces,
  GetSupportedInterfacesParameters,
  GetSupportedInterfacesReturnType,
} from '@ensdomains/ensjs/public'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UseSupportedInterfacesParameters<TInterfaces extends readonly Hex[] = readonly Hex[]> =
  PartialBy<GetSupportedInterfacesParameters<TInterfaces>, 'address'>

type UseSupportedInterfacesReturnType<TInterfaces extends readonly Hex[]> =
  GetSupportedInterfacesReturnType<TInterfaces>

type UseSupportedInterfacesConfig<TInterfaces extends readonly Hex[]> = QueryConfig<
  UseSupportedInterfacesReturnType<TInterfaces>,
  Error
>

type QueryKey<TParams extends UseSupportedInterfacesParameters> = CreateQueryKey<
  TParams,
  'getSupportedInterfaces',
  'standard'
>

export const getSupportedInterfacesQueryFn =
  (config: Config) =>
  async <TParams extends UseSupportedInterfacesParameters>({
    queryKey: [{ address, ...params }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!address) throw new Error('address is required')

    const publicClient = config.getClient({ chainId }) as PublicClientWithChain

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
}: TParams & UseSupportedInterfacesConfig<TInterfaces>) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getSupportedInterfaces',
    queryDependencyType: 'standard',
    queryFn: getSupportedInterfacesQueryFn,
  })

  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
  })

  const query = useQuery({
    ...preparedOptions,
    enabled: enabled && !!params.address && params.interfaces.length > 0,
    gcTime,
    staleTime,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
