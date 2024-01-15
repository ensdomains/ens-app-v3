import { QueryFunctionContext } from '@tanstack/react-query'
import { useQuery } from 'wagmi'

import {
  DnsDnssecVerificationFailedError,
  DnsInvalidAddressChecksumError,
  DnsInvalidTxtRecordError,
  DnsNoTxtRecordError,
  DnsResponseStatusError,
  UnsupportedNameTypeError,
} from '@ensdomains/ensjs'
import { getDnsOwner, GetDnsOwnerParameters, GetDnsOwnerReturnType } from '@ensdomains/ensjs/dns'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, QueryConfig } from '@app/types'

type UseDnsOwnerParameters = PartialBy<GetDnsOwnerParameters, 'name'>

type UseDnsOwnerReturnType = GetDnsOwnerReturnType

type UseDnsOwnerConfig = QueryConfig<
  UseDnsOwnerReturnType,
  | UnsupportedNameTypeError
  | DnsResponseStatusError
  | DnsDnssecVerificationFailedError
  | DnsNoTxtRecordError
  | DnsInvalidTxtRecordError
  | DnsInvalidAddressChecksumError
  | Error
>

type QueryKey<TParams extends UseDnsOwnerParameters> = CreateQueryKey<
  TParams,
  'getDnsOwner',
  'independent'
>

export const getDnsOwnerQueryFn = async <TParams extends UseDnsOwnerParameters>({
  queryKey: [{ name, ...params }],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  return getDnsOwner({ name, ...params })
}

export const useDnsOwner = <TParams extends UseDnsOwnerParameters>({
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
}: TParams & UseDnsOwnerConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getDnsOwner',
    queryDependencyType: 'independent',
  })

  const query = useQuery(queryKey, getDnsOwnerQueryFn, {
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
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
