import { QueryFunctionContext } from '@tanstack/react-query'
import { Hex, isHex } from 'viem'

import { getAddressRecord } from '@ensdomains/ensjs/public'
import { EMPTY_BYTES32 } from '@ensdomains/ensjs/utils'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, QueryConfig } from '@app/types'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'
import { getReferrerHex } from '@app/utils/referrer'

type UseResolvedReferrerParameters = {
  referrer?: string
}

type UseResolvedReferrerReturnType = Hex | undefined

type UseResolvedReferrerConfig = QueryConfig<UseResolvedReferrerReturnType, Error>

type UseResolvedReferrerQueryKey<
  TParams extends UseResolvedReferrerParameters = UseResolvedReferrerParameters,
> = CreateQueryKey<TParams, 'resolveReferrer', 'standard'>

const resolveReferrerQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseResolvedReferrerParameters>({
    queryKey: [{ referrer }, chainId],
  }: QueryFunctionContext<UseResolvedReferrerQueryKey<TParams>>) => {
    if (!referrer) return EMPTY_BYTES32

    if (isHex(referrer)) {
      return getReferrerHex(referrer)
    }

    const client = config.getClient({ chainId })
    const addressRecord = await getAddressRecord(client, { name: referrer })
    return addressRecord?.value ? getReferrerHex(addressRecord.value) : EMPTY_BYTES32
  }

export const useResolvedReferrer = <TParams extends UseResolvedReferrerParameters>({
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  ...params
}: TParams & UseResolvedReferrerConfig): {
  data: UseResolvedReferrerReturnType
  isLoading: boolean
  isError: boolean
  error: Error | null
} => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'resolveReferrer',
    queryDependencyType: 'standard',
    queryFn: resolveReferrerQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.referrer,
    gcTime,
    staleTime,
  })

  const query = useQuery(preparedOptions)

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}
