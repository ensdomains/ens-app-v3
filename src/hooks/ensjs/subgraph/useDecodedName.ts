import { QueryFunctionContext } from '@tanstack/react-query'
import { useMemo } from 'react'

import type { GetDecodedNameParameters, GetDecodedNameReturnType } from '@ensdomains/ensjs/subgraph'
import { checkIsDecrypted } from '@ensdomains/ensjs/utils'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

type UseDecodedNameParameters = PartialBy<GetDecodedNameParameters, 'name'>

type UseDecodedNameReturnType = GetDecodedNameReturnType

type UseDecodedNameConfig = QueryConfig<UseDecodedNameReturnType, Error>

type QueryKey<TParams extends UseDecodedNameParameters> = CreateQueryKey<
  TParams,
  'getDecodedName',
  'graph'
>

export const getDecodedNameQueryFn =
  (_config: ConfigWithEns) =>
  async <TParams extends UseDecodedNameParameters>({
    queryKey: [{ name }],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')
    // No subgraph: SNRC labels are known on-chain (BaseRegistrar/SubnameRegistrar
    // labelOf), and the name passed here is already decoded, so return it as-is
    // (a plain decoded name string).
    return name as GetDecodedNameReturnType
  }

export const useDecodedName = <TParams extends UseDecodedNameParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseDecodedNameConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getDecodedName',
    queryDependencyType: 'graph',
    queryFn: getDecodedNameQueryFn,
  })

  const nameIsEncrypted = useMemo(
    () => (params.name ? !checkIsDecrypted(params.name) : false),
    [params.name],
  )

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.name && nameIsEncrypted,
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
