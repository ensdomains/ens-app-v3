import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import type { Address } from 'viem'
import { useQuery } from 'wagmi'

import { GetNameParameters, GetNameReturnType, getName } from '@ensdomains/ensjs/public'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PublicClientWithChain, QueryConfig } from '@app/types'
import { tryBeautify } from '@app/utils/beautify'

type UsePrimaryNameParameters = Omit<GetNameParameters, 'address'> & {
  address?: Address | null
  allowMismatch?: boolean
}

type UsePrimaryNameConfig = QueryConfig<GetNameReturnType, Error>

type QueryKey<TParams extends UsePrimaryNameParameters> = CreateQueryKey<TParams, 'getName', false>

export const getPrimaryNameQueryFn = async <TParams extends UsePrimaryNameParameters>({
  queryKey: [{ address, ...params }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!address) throw new Error('address is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  const res = await getName(publicClient, { address, ...params })

  if (!res || !res.name || (!res.match && !params.allowMismatch)) return null

  return {
    ...res,
    beautifiedName: tryBeautify(res.name),
  }
}

export const usePrimaryName = <TParams extends UsePrimaryNameParameters>({
  // config
  cacheTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
  onError,
  onSettled,
  onSuccess,
  // params
  allowMismatch = false,
  ...params
}: TParams & UsePrimaryNameConfig) => {
  const queryKey = useQueryKeyFactory({
    params: { ...params, allowMismatch },
    scopeKey,
    functionName: 'getName',
    isGraphQuery: false,
  })

  const query = useQuery(queryKey, getPrimaryNameQueryFn, {
    cacheTime,
    enabled: enabled && !!params.address,
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
