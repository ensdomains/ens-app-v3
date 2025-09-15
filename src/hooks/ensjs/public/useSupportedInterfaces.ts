import { QueryFunctionContext } from '@tanstack/react-query'
import { Hex } from 'viem'

import {
  getSupportedInterfaces,
  GetSupportedInterfacesParameters,
  GetSupportedInterfacesReturnType,
} from '@ensdomains/ensjs/public'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

type UseSupportedInterfacesParameters<TInterfaces extends readonly Hex[]> = PartialBy<
  GetSupportedInterfacesParameters<TInterfaces>,
  'address'
>

type UseSupportedInterfacesReturnType<TInterfaces extends readonly Hex[]> =
  GetSupportedInterfacesReturnType<TInterfaces>

type QueryKey<TInterfaces extends readonly Hex[]> = CreateQueryKey<
  UseSupportedInterfacesParameters<TInterfaces>,
  'getSupportedInterfaces',
  'standard'
>

type UseSupportedInterfacesConfig<TInterfaces extends readonly Hex[]> = QueryConfig<
  UseSupportedInterfacesReturnType<TInterfaces>,
  Error,
  QueryKey<TInterfaces>
>

export const getSupportedInterfacesQueryFn =
  (config: ConfigWithEns) =>
  async <TInterfaces extends readonly Hex[]>({
    queryKey: [{ address, ...params }, chainId],
  }: QueryFunctionContext<QueryKey<TInterfaces>>) => {
    if (!address) throw new Error('address is required')

    const client = config.getClient({ chainId })

    return getSupportedInterfaces(client, { address, ...params })
  }

export const useSupportedInterfaces = <const TInterfaces extends readonly Hex[]>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: UseSupportedInterfacesParameters<TInterfaces> & UseSupportedInterfacesConfig<TInterfaces>) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getSupportedInterfaces',
    queryDependencyType: 'standard',
    queryFn: getSupportedInterfacesQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.address && params.interfaces.length > 0,
    gcTime,
    staleTime,
  })

  const query = useQuery(preparedOptions)

  return {
    ...query,
    refetchIfEnabled: preparedOptions.enabled ? query.refetch : () => {},
    isCachedData: getIsCachedData(query),
  }
}
