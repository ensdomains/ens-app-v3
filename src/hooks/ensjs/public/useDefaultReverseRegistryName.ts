import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { Address, getChainContractAddress, parseAbi } from 'viem'
import { readContract } from 'viem/actions'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, QueryConfig } from '@app/types'
import { emptyAddress } from '@app/utils/constants'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'

const defaultReverseRegistrarAbi = parseAbi([
  'function nameForAddr(address addr) external view returns (string)',
])

type GetDefaultReverseRegistryNameParameters = {
  address?: Address
}

type GetDefaultReverseRegistryNameReturnType = string | null

type UseDefaultReverseRegistryNameParameters = GetDefaultReverseRegistryNameParameters

type UseDefaultReverseRegistryNameReturnType = GetDefaultReverseRegistryNameReturnType

type UseDefaultReverseRegistryNameConfig = QueryConfig<
  UseDefaultReverseRegistryNameReturnType,
  Error
>

type QueryKey<TParams extends UseDefaultReverseRegistryNameParameters> = CreateQueryKey<
  TParams,
  'getDefaultReverseRegistryName',
  'standard'
>

export const getDefaultReverseRegistryNameQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseDefaultReverseRegistryNameParameters>({
    queryKey: [{ address }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!address) throw new Error('address is required')

    const client = config.getClient({ chainId })

    try {
      const name = await readContract(client, {
        address: getChainContractAddress({
          chain: client.chain,
          contract: 'ensDefaultReverseRegistrar',
        }),
        abi: defaultReverseRegistrarAbi,
        functionName: 'nameForAddr',
        args: [address],
      })

      // Return null for empty strings
      return name || null
    } catch (error) {
      console.error('Failed to get default reverse registry name:', error)
      return null
    }
  }

export const useDefaultReverseRegistryName = <
  TParams extends UseDefaultReverseRegistryNameParameters,
>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseDefaultReverseRegistryNameConfig) => {
  const initialOptions = useQueryOptions({
    params: { ...params },
    scopeKey,
    functionName: 'getDefaultReverseRegistryName',
    queryDependencyType: 'standard',
    queryFn: getDefaultReverseRegistryNameQueryFn,
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
