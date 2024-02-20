import { QueryFunctionContext, queryOptions, useQuery } from '@tanstack/react-query'
import { Config } from 'wagmi'

import { getName, GetNameParameters, GetNameReturnType } from '@ensdomains/ensjs/public'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'
import { tryBeautify } from '@app/utils/beautify'
import { emptyAddress } from '@app/utils/constants'

type UsePrimaryNameParameters = PartialBy<GetNameParameters, 'address'> & {
  allowMismatch?: boolean
}

type UsePrimaryNameReturnType = (NonNullable<GetNameReturnType> & { beautifiedName: string }) | null

type UsePrimaryNameConfig = QueryConfig<UsePrimaryNameReturnType, Error>

type QueryKey<TParams extends UsePrimaryNameParameters> = CreateQueryKey<
  TParams,
  'getName',
  'standard'
>

export const getPrimaryNameQueryFn =
  (config: Config) =>
  async <TParams extends UsePrimaryNameParameters>({
    queryKey: [{ address, ...params }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!address) throw new Error('address is required')

    const publicClient = config.getClient({ chainId }) as PublicClientWithChain

    const res = await getName(publicClient, { address, ...params })

    if (!res || !res.name || (!res.match && !params.allowMismatch)) return null

    return {
      ...res,
      beautifiedName: tryBeautify(res.name),
    }
  }

export const usePrimaryName = <TParams extends UsePrimaryNameParameters>({
  // config
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,

  // params
  allowMismatch = false,
  ...params
}: TParams & UsePrimaryNameConfig) => {
  const initialOptions = useQueryOptions({
    params: { ...params, allowMismatch },
    scopeKey,
    functionName: 'getName',
    queryDependencyType: 'standard',
    queryFn: getPrimaryNameQueryFn,
  })

  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
  })

  const query = useQuery({
    ...preparedOptions,
    enabled: enabled && !!params.address && params.address !== emptyAddress,
    gcTime,
    staleTime,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
