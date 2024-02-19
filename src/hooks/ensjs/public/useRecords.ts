import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { Config, useConfig } from 'wagmi'

import { getRecords, GetRecordsParameters, GetRecordsReturnType } from '@ensdomains/ensjs/public'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UseRecordsParameters = PartialBy<GetRecordsParameters, 'name'>
type UseRecordsConfig = QueryConfig<GetRecordsReturnType | null, Error>
type QueryKey = CreateQueryKey<UseRecordsParameters, 'getRecords', 'standard'>

export const getRecordsQueryFn =
  (config: Config) =>
  async ({ queryKey: [{ name, ...params }, chainId] }: QueryFunctionContext<QueryKey>) => {
    if (!name) throw new Error('name is required')

    const publicClient = config.getClient({ chainId }) as PublicClientWithChain
    const res = await getRecords(publicClient, {
      name,
      ...params,
    })
    if (!res) return null
    return res
  }

export const useRecords = ({
  gcTime,
  enabled = true,
  staleTime,
  scopeKey,
  ...params
}: UseRecordsParameters & UseRecordsConfig) => {
  const config = useConfig()
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getRecords',
    queryDependencyType: 'standard',
  })

  const query = useQuery({
    queryKey,
    queryFn: getRecordsQueryFn(config),
    gcTime,
    staleTime,
    enabled: enabled && !!params.name,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
