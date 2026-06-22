import { QueryFunctionContext } from '@tanstack/react-query'

import { ConfigWithEns, CreateQueryKey, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'
import { checkETH2LDFromName } from '@app/utils/utils'

import { useQueryOptions } from './useQueryOptions'

type UseRegistrationDataParameters = {
  name?: string | undefined | null
}

type UseRegistrationDataReturnType = {
  registrationDate: Date
  transactionHash: string
} | null

type UseRegistrationDataConfig = QueryConfig<UseRegistrationDataReturnType, Error>

type QueryKey<TParams extends UseRegistrationDataParameters> = CreateQueryKey<
  TParams,
  'getRegistrationData',
  'graph'
>

export const getRegistrationDataQueryFn =
  (_config: ConfigWithEns) =>
  async <TParams extends UseRegistrationDataParameters>({
    queryKey: [{ name }],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')
    // No subgraph: the original registration date + tx hash are subgraph-only
    // metadata (not recoverable on-chain), so report none.
    return null as UseRegistrationDataReturnType
  }

const useRegistrationData = <TParams extends UseRegistrationDataParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseRegistrationDataConfig) => {
  const initialOptions = useQueryOptions({
    params,
    functionName: 'getRegistrationData',
    queryDependencyType: 'graph',
    queryFn: getRegistrationDataQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.name && checkETH2LDFromName(params.name),
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

export default useRegistrationData
