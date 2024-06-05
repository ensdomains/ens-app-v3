import { QueryFunctionContext } from '@tanstack/react-query'

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

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

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

export const getDnsOffchainDataQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseDnsOffchainDataParameters>({
    queryKey: [{ name, ...params }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')

    const client = config.getClient({ chainId })

    return getDnsOffchainData(client, { name, ...params })
  }

export const useDnsOffchainData = <TParams extends UseDnsOffchainDataParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseDnsOffchainDataConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getDnsOffchainData',
    queryDependencyType: 'standard',
    queryFn: getDnsOffchainDataQueryFn,
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
