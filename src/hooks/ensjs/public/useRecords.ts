import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { useAccount, useQuery } from 'wagmi'

import { GetRecordsParameters, GetRecordsReturnType, getRecords } from '@ensdomains/ensjs/public'

import { useChainId } from '@app/hooks/chain/useChainId'
import {
  BaseQueryKeyParameters,
  CreateQueryKey,
  PartialBy,
  PublicClientWithChain,
  QueryConfig,
} from '@app/types'

type UseRecordsParameters = PartialBy<GetRecordsParameters, 'name'>

type UseRecordsConfig<TParams extends UseRecordsParameters> = QueryConfig<
  GetRecordsReturnType<{
    name: string
    records: TParams['records']
    resolver: TParams['resolver']
  }>,
  Error
>

type QueryKeyParameters<TParams extends UseRecordsParameters> = BaseQueryKeyParameters &
  Pick<UseRecordsConfig<TParams>, 'scopeKey'> & { params: TParams }
type QueryKey<TParams extends UseRecordsParameters> = CreateQueryKey<TParams, 'getRecords'>

const queryKey = <TParams extends UseRecordsParameters>({
  chainId,
  address,
  scopeKey,
  params,
}: QueryKeyParameters<TParams>): QueryKey<TParams> => {
  return [params, chainId, address, scopeKey, 'getRecords']
}

export const getRecordsQueryFn = async <TParams extends UseRecordsParameters>({
  queryKey: [{ name, ...params }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  const res = await getRecords(publicClient, { name, ...params })

  if (!res) return null

  return res
}

export const useRecords = <TParams extends UseRecordsParameters>({
  // config
  cacheTime,
  enabled = true,
  staleTime,
  scopeKey,
  onError,
  onSettled,
  onSuccess,
  // params
  ...params
}: TParams & UseRecordsConfig<TParams>) => {
  const chainId = useChainId()
  const { address } = useAccount()

  const query = useQuery(queryKey({ chainId, address, scopeKey, params }), getRecordsQueryFn, {
    cacheTime,
    staleTime,
    enabled: enabled && !!params.name,
    onError,
    onSettled,
    onSuccess,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
