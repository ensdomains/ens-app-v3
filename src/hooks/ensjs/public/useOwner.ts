import { QueryFunctionContext, queryOptions, useQuery } from '@tanstack/react-query'
import { Config } from 'wagmi'

import { getOwner, GetOwnerParameters, GetOwnerReturnType } from '@ensdomains/ensjs/public'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type OwnerContract = 'nameWrapper' | 'registry' | 'registrar'

type UseOwnerParameters<TContract extends OwnerContract | undefined = OwnerContract | undefined> =
  PartialBy<GetOwnerParameters<TContract>, 'name'>

type UseOwnerReturnType<TContract extends OwnerContract | undefined = undefined> =
  GetOwnerReturnType<TContract>

type UseOwnerConfig<TContract extends OwnerContract | undefined = OwnerContract | undefined> =
  QueryConfig<UseOwnerReturnType<TContract>, Error>

export type UseOwnerQueryKey<TContract extends OwnerContract | undefined = undefined> =
  CreateQueryKey<UseOwnerParameters<TContract>, 'getOwner', 'standard'>

export const getOwnerQueryFn =
  (config: Config) =>
  async <TContract extends OwnerContract | undefined = undefined>({
    queryKey: [{ name, ...params }, chainId],
  }: QueryFunctionContext<UseOwnerQueryKey<TContract>>) => {
    if (!name) throw new Error('name is required')

    const publicClient = config.getClient({ chainId }) as PublicClientWithChain

    return getOwner(publicClient, { name, ...params })
  }

export const useOwner = <
  TContract extends OwnerContract | undefined = undefined,
  const TParams extends UseOwnerParameters<TContract> = UseOwnerParameters<TContract>,
>({
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
  ...params
}: TParams & UseOwnerConfig<TContract>) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getOwner',
    queryDependencyType: 'standard',
    queryFn: getOwnerQueryFn,
  })

  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
  })

  const query = useQuery({
    ...preparedOptions,
    gcTime,
    enabled: enabled && !!params.name,
    staleTime,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
