import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { useQuery } from 'wagmi'

import {
  DnsDnssecVerificationFailedError,
  DnsInvalidTxtRecordError,
  DnsNoTxtRecordError,
  DnsResponseStatusError,
  UnsupportedNameTypeError,
} from '@ensdomains/ensjs'
import {
  getDnsOffchainData,
  GetDnsOffchainDataParameters,
  GetDnsOffchainDataReturnType,
} from '@ensdomains/ensjs/dns'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UseDnsOffchainDataParameters = PartialBy<GetDnsOffchainDataParameters, 'name'>

type UseDnsOffchainDataReturnType = GetDnsOffchainDataReturnType

export type UseDnsOffchainDataError =
  | UnsupportedNameTypeError
  | DnsResponseStatusError
  | DnsDnssecVerificationFailedError
  | DnsNoTxtRecordError
  | DnsInvalidTxtRecordError
  | Error

type UseDnsOffchainDataConfig = QueryConfig<UseDnsOffchainDataReturnType, UseDnsOffchainDataError>

type QueryKey<TParams extends UseDnsOffchainDataParameters> = CreateQueryKey<
  TParams,
  'getDnsOffchainData',
  'standard'
>

export const getDnsOffchainDataQueryFn = async <TParams extends UseDnsOffchainDataParameters>({
  queryKey: [{ name, ...params }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  return getDnsOffchainData(publicClient, { name, ...params })
}

export const useDnsOffchainData = <TParams extends UseDnsOffchainDataParameters>({
  // config
  cacheTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
  onError,
  onSettled,
  onSuccess,
  // params
  ...params
}: TParams & UseDnsOffchainDataConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getDnsOffchainData',
    queryDependencyType: 'standard',
  })

  const query = useQuery(queryKey, getDnsOffchainDataQueryFn, {
    cacheTime,
    enabled:
      enabled &&
      !!params.name &&
      !params.name?.endsWith('.eth') &&
      params.name !== 'eth' &&
      params.name !== '[root]',
    staleTime,
    onError,
    onSettled,
    onSuccess,
    retry: 2,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
