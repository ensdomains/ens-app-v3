import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { Address, getChainContractAddress, parseAbi } from 'viem'
import { readContract } from 'viem/actions'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, QueryConfig } from '@app/types'
import { emptyAddress } from '@app/utils/constants'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { getReverseNodeHash } from '@app/utils/reverse'

const ensRegistryResolverAbi = parseAbi([
  'function resolver(bytes32 node) external view returns (address)',
])

type GetReverseRegistryNameParameters = {
  address?: Address
}

type GetReverseRegistryNameReturnType = string | null

type UseReverseRegistryNameParameters = GetReverseRegistryNameParameters

type UseReverseRegistryNameReturnType = GetReverseRegistryNameReturnType

type QueryKey<TParams extends UseReverseRegistryNameParameters> = CreateQueryKey<
  TParams,
  'getReverseRegistryName',
  'standard'
>

type UseReverseRegistryNameConfig = QueryConfig<
  UseReverseRegistryNameReturnType,
  Error,
  QueryKey<UseReverseRegistryNameParameters>
>

export const getReverseRegistryNameQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseReverseRegistryNameParameters>({
    queryKey: [{ address }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!address) throw new Error('address is required')

    const client = config.getClient({ chainId })

    const reverseResolver = await readContract(client, {
      address: getChainContractAddress({
        chain: client.chain,
        contract: 'ensRegistry',
      }),
      abi: ensRegistryResolverAbi,
      functionName: 'resolver',
      args: [getReverseNodeHash(address, { ns: 'addr' })],
    })
    console.log('reverseResolver', reverseResolver)
    if (!reverseResolver) return null

    try {
      const reverseResolverName = await readContract(client, {
        address: reverseResolver,
        abi: parseAbi(['function name(bytes32 node) public view returns (string)']),
        functionName: 'name',
        args: [getReverseNodeHash(address, { ns: 'addr' })],
      })
      console.log('reverseResolverName', reverseResolverName)
      return reverseResolverName
    } catch (error) {
      console.error('error', error)
      return null
    }
  }

export const useReverseRegistryName = <TParams extends UseReverseRegistryNameParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseReverseRegistryNameConfig) => {
  const initialOptions = useQueryOptions({
    params: { ...params },
    scopeKey,
    functionName: 'getReverseRegistryName',
    queryDependencyType: 'standard',
    queryFn: getReverseRegistryNameQueryFn,
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
