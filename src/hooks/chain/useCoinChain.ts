import { QueryFunctionContext } from '@tanstack/react-query'
import { Chain } from 'viem'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { CreateQueryKey, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

const COIN_FIND_CHAIN_ENDPOINT = 'https://cointype-worker.ens-cf.workers.dev'

type UseCoinChainParameters = {
  nameorid?: string | number
}

type UseCoinChainReturnType = {
  error: boolean
  data: Chain | undefined
}

type UseCoinChainConfig = QueryConfig<UseCoinChainReturnType, Error>

type QueryKey<TParams extends UseCoinChainParameters> = CreateQueryKey<
  TParams,
  'getCoinChain',
  'independent'
>

export const getCoinChainQueryFn = async <TParams extends UseCoinChainParameters>({
  queryKey: [{ nameorid }],
}: QueryFunctionContext<QueryKey<TParams>>): Promise<UseCoinChainReturnType> => {
  if (!nameorid) throw new Error('name or id is required')

  try {
    const response = await fetch(`${COIN_FIND_CHAIN_ENDPOINT}/${nameorid}`)
    const returnData = await response.json()
    return { error: !!returnData?.error, data: returnData }
  } catch {
    return { error: true, data: undefined }
  }
}

export const useCoinChain = <TParams extends UseCoinChainParameters>({
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  ...params
}: TParams & UseCoinChainConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getCoinChain',
    queryDependencyType: 'independent',
    queryFn: getCoinChainQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.nameorid,
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
