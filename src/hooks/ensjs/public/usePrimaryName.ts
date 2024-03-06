import { QueryFunctionContext, useQuery } from '@tanstack/react-query'

import { getName, GetNameParameters, GetNameReturnType } from '@ensdomains/ensjs/public'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { tryBeautify } from '@app/utils/beautify'
import { emptyAddress } from '@app/utils/constants'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'

type UsePrimaryNameParameters = PartialBy<GetNameParameters, 'address'> & {
  allowMismatch?: boolean
}

type UsePrimaryNameReturnType = (NonNullable<GetNameReturnType> & { beautifiedName: string }) | null

type UsePrimaryNameConfig = QueryConfig<UsePrimaryNameReturnType, Error>

type QueryKey<TParams extends UsePrimaryNameParameters> = CreateQueryKey<
  TParams,
  'getName',
  'standard'
>

export const getPrimaryNameQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UsePrimaryNameParameters>({
    queryKey: [{ address, ...params }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!address) throw new Error('address is required')

    const client = config.getClient({ chainId })

    const res = await getName(client, { address, ...params })

    if (!res || !res.name || (!res.match && !params.allowMismatch)) return null

    return {
      ...res,
      beautifiedName: tryBeautify(res.name),
    }
  }

export const usePrimaryName = <TParams extends UsePrimaryNameParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  allowMismatch = false,
  ...params
}: TParams & UsePrimaryNameConfig) => {
  const initialOptions = useQueryOptions({
    params: { ...params, allowMismatch },
    scopeKey,
    functionName: 'getName',
    queryDependencyType: 'standard',
    queryFn: getPrimaryNameQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.address && params.address !== emptyAddress,
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
