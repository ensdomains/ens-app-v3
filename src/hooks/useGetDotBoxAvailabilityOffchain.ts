import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { Address } from 'viem'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'

const BOX_SEARCH_ENDPOINT = 'https://dotbox-worker.ens-cf.workers.dev/search'

type UseDotBoxAvailabilityParameters = {
  name: string
}

type UseDotBoxAvailabilityReturnType = {
  succes: boolean
  data: {
    available: boolean
    domain: string
    href: string
    // eslint-disable-next-line @typescript-eslint/naming-convention
    is_premium: boolean
    status: 'AVAILABLE' | 'UNAVAILABLE' | 'LIVE'
  }
}

type UseDotBoxAvailabilityConfig = QueryConfig<UseDotBoxAvailabilityReturnType, Error>

type QueryKey<TParams extends UseDotBoxAvailabilityParameters> = CreateQueryKey<
  TParams,
  'getDotBoxAvailability',
  'standard'
>

/* eslint-disable @typescript-eslint/no-unused-vars */
export const getAvailabilityQueryFn =
  (_config: ConfigWithEns) =>
  /* eslint-enable @typescript-eslint/no-unused-vars */
  async <TParams extends UseDotBoxAvailabilityParameters>({
    queryKey: [{ name }],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    const response = await fetch(`${BOX_SEARCH_ENDPOINT}?domain=${name}`)
    return response.json()
  }

export const useGetDotBoxAvailabilityOffChain = <TParams extends UseDotBoxAvailabilityParameters>({
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  ...params
}: TParams & UseDotBoxAvailabilityConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getDotBoxAvailability',
    queryDependencyType: 'standard',
    queryFn: getAvailabilityQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.name,
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
