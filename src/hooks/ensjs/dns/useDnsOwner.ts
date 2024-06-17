import { QueryFunctionContext } from '@tanstack/react-query'

import {
  DnsDnssecVerificationFailedError,
  DnsInvalidAddressChecksumError,
  DnsInvalidTxtRecordError,
  DnsNoTxtRecordError,
  DnsResponseStatusError,
  UnsupportedNameTypeError,
} from '@ensdomains/ensjs'
import { getDnsOwner, GetDnsOwnerParameters, GetDnsOwnerReturnType } from '@ensdomains/ensjs/dns'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

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

export type GetDnsOwnerQueryKey<TParams extends UseDnsOwnerParameters> = CreateQueryKey<
  TParams,
  'getDnsOwner',
  'independent'
>

export const getDnsOwnerQueryFn = async <TParams extends UseDnsOwnerParameters>({
  queryKey: [{ name, ...params }],
}: QueryFunctionContext<GetDnsOwnerQueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  return getDnsOwner({ name, ...params })
}

export const useDnsOwner = <TParams extends UseDnsOwnerParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseDnsOwnerConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getDnsOwner',
    queryDependencyType: 'independent',
    queryFn: getDnsOwnerQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled:
      enabled &&
      !!params.name &&
      !params.name?.endsWith('.eth') &&
      params.name !== 'eth' &&
      params.name !== '[root]',
    gcTime,
    retry: 2,
    staleTime,
  })

  const query = useQuery(preparedOptions)

  return {
    ...query,
    refetchIfEnabled: preparedOptions.enabled ? query.refetch : () => {},
    isCachedData: getIsCachedData(query),
  }
}
