import { QueryFunctionContext, useQuery } from '@tanstack/react-query'

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

export type UseDnsOwnerError =
  | UnsupportedNameTypeError
  | DnsResponseStatusError
  | DnsDnssecVerificationFailedError
  | DnsNoTxtRecordError
  | DnsInvalidTxtRecordError
  | DnsInvalidAddressChecksumError
  | Error

type UseDnsOwnerConfig = QueryConfig<UseDnsOwnerReturnType, UseDnsOwnerError>

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
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,

  // params
  ...params
}: TParams & UseDnsOwnerConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getDnsOwner',
    queryDependencyType: 'independent',
  })

  const query = useQuery({
    queryKey,
    queryFn: getDnsOwnerQueryFn,
    gcTime,
    enabled:
      enabled &&
      !!params.name &&
      !params.name?.endsWith('.eth') &&
      params.name !== 'eth' &&
      params.name !== '[root]',
    staleTime,

  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
