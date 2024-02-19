import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { Config, useConfig } from 'wagmi'

import { getName, GetNameParameters, GetNameReturnType } from '@ensdomains/ensjs/public'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'
import { tryBeautify } from '@app/utils/beautify'
import { emptyAddress } from '@app/utils/constants'

type UsePrimaryNameParameters = PartialBy<GetNameParameters, 'address'> & {
  allowMismatch?: boolean
}

type UsePrimaryNameReturnType = (NonNullable<GetNameReturnType> & { beautifiedName: string }) | null

type UsePrimaryNameConfig = QueryConfig<UsePrimaryNameReturnType, Error>

export type UsePrimaryNameQueryKey<TParams extends UsePrimaryNameParameters> = CreateQueryKey<
  TParams,
  'getName',
  'standard'
>

export const getPrimaryNameQueryFn =
  (config: Config) =>
  async <TParams extends UsePrimaryNameParameters>({
    queryKey: [{ address, ...params }, chainId],
  }: QueryFunctionContext<UsePrimaryNameQueryKey<TParams>>) => {
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
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
  allowMismatch = false,
  ...params
}: TParams & UsePrimaryNameConfig) => {
  const queryKey = useQueryKeyFactory({
    params: { ...params, allowMismatch },
    scopeKey,
    functionName: 'getName',
    queryDependencyType: 'standard',
  })

  const config = useConfig()

  const query = useQuery({
    queryKey,
    queryFn: getPrimaryNameQueryFn(config),
    gcTime,
    enabled: enabled && !!params.address && params.address !== emptyAddress,
    staleTime,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
