import { QueryFunctionContext } from '@tanstack/react-query'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { CreateQueryKey, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

const BOX_SEARCH_ENDPOINT = 'https://dotbox-worker.ens-cf.workers.dev/search'

type UseDotBoxAvailabilityOffchainParameters = {
  name?: string
}

type UseDotBoxAvailabilityOffchainReturnType = {
  success: boolean
  data: {
    available: boolean
    domain: string
    href: string
    // eslint-disable-next-line @typescript-eslint/naming-convention
    is_premium: boolean
    status: 'AVAILABLE' | 'UNAVAILABLE' | 'LIVE'
  }
}

type UseDotBoxAvailabilityOffchainConfig = QueryConfig<
  UseDotBoxAvailabilityOffchainReturnType,
  Error
>

type QueryKey<TParams extends UseDotBoxAvailabilityOffchainParameters> = CreateQueryKey<
  TParams,
  'getDotBoxAvailabilityOffchain',
  'independent'
>

export const getDotBoxAvailabilityOffchainQueryFn = async <
  TParams extends UseDotBoxAvailabilityOffchainParameters,
>({
  queryKey: [{ name }],
}: QueryFunctionContext<QueryKey<TParams>>): Promise<UseDotBoxAvailabilityOffchainReturnType> => {
  if (!name) throw new Error('name is required')

  const response = await fetch(`${BOX_SEARCH_ENDPOINT}?domain=${name}`)
  return response.json()
}

export const useDotBoxAvailabilityOffchain = <
  TParams extends UseDotBoxAvailabilityOffchainParameters,
>({
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  ...params
}: TParams & UseDotBoxAvailabilityOffchainConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getDotBoxAvailabilityOffchain',
    queryDependencyType: 'independent',
    queryFn: getDotBoxAvailabilityOffchainQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.name && params.name.endsWith('.box'),
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
