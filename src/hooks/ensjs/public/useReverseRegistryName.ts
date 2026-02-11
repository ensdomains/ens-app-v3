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

type UseRevereRegistrynameParameters = GetReverseRegistryNameParameters

type UseRevereRegistrynameReturnType = GetReverseRegistryNameReturnType

type UseRevereRegistrynameConfig = QueryConfig<UseRevereRegistrynameReturnType, Error>

type QueryKey<TParams extends UseRevereRegistrynameParameters> = CreateQueryKey<
  TParams,
  'getReverseRegistryName',
  'standard'
>

export const getReverseRegistryNameQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseRevereRegistrynameParameters>({
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
    if (!reverseResolver) return null

    try {
      const reverseResolverName = await readContract(client, {
        address: reverseResolver,
        abi: parseAbi(['function name(bytes32 node) public view returns (string)']),
        functionName: 'name',
        args: [getReverseNodeHash(address, { ns: 'addr' })],
      })
      return reverseResolverName
    } catch (error) {
      console.error('error', error)
      return null
    }
  }

export const useReverseRegistryName = <TParams extends UseRevereRegistrynameParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseRevereRegistrynameConfig) => {
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
