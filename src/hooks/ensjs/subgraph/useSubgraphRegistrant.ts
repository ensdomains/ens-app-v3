import { QueryFunctionContext, queryOptions } from '@tanstack/react-query'
import { Address, labelhash, parseAbi } from 'viem'
import { readContract } from 'viem/actions'

import type {
  GetSubgraphRegistrantParameters,
  GetSubgraphRegistrantReturnType,
} from '@ensdomains/ensjs/subgraph'

import { getSnrcAddresses } from '@app/constants/chains'
import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { useQuery } from '@app/utils/query/useQuery'

export type UseSubgraphRegistrantParameters = PartialBy<GetSubgraphRegistrantParameters, 'name'>

export type UseSubgraphRegistrantReturnType = GetSubgraphRegistrantReturnType

export type UseSubgraphRegistrantConfig = QueryConfig<UseSubgraphRegistrantReturnType, Error>

type QueryKey<TParams extends UseSubgraphRegistrantParameters> = CreateQueryKey<
  TParams,
  'getSubgraphRegistrant',
  'graph'
>

const ownerOfAbi = parseAbi(['function ownerOf(uint256) view returns (address)'])

export const getSubgraphRegistrantQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseSubgraphRegistrantParameters>({
    queryKey: [{ name }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')
    // No subgraph: only 2LDs have a registrant — the BaseRegistrar token owner.
    const labels = name.split('.')
    if (labels.length !== 2) return undefined as unknown as GetSubgraphRegistrantReturnType
    const registrar = getSnrcAddresses(chainId).BaseRegistrarImplementation as Address | undefined
    if (!registrar) return undefined as unknown as GetSubgraphRegistrantReturnType
    const client = config.getClient({ chainId })
    try {
      const registrant = (await readContract(client, {
        address: registrar,
        abi: ownerOfAbi,
        functionName: 'ownerOf',
        args: [BigInt(labelhash(labels[0]))],
      })) as Address
      return registrant as unknown as GetSubgraphRegistrantReturnType
    } catch {
      return undefined as unknown as GetSubgraphRegistrantReturnType
    }
  }

export const useSubgraphRegistrant = <TParams extends UseSubgraphRegistrantParameters>({
  // config
  gcTime = 1_000 * 60 * 60 * 24,
  enabled = true,
  staleTime,
  scopeKey,

  // params
  ...params
}: TParams & UseSubgraphRegistrantConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getSubgraphRegistrant',
    queryDependencyType: 'graph',
    queryFn: getSubgraphRegistrantQueryFn,
  })

  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
  })

  const query = useQuery({
    ...preparedOptions,
    gcTime,
    enabled: enabled && !!params.name,
    staleTime,
  })

  return {
    ...query,
    isCachedData: getIsCachedData(query),
  }
}
