import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { Address, namehash } from 'viem'
import { useQuery } from 'wagmi'

import { getChainContractAddress, registryResolverSnippet } from '@ensdomains/ensjs/contracts'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PublicClientWithChain, QueryConfig } from '@app/types'

const publicResolverNameSnippet = [
  {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32',
      },
    ],
    name: 'name',
    outputs: [
      {
        name: 'ret',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]

type UseReverseRegistryNameParameters = {
  address: Address
}

type UseReverseRegistryNameReturnType = string

type UseReverseRegistryNameConfig = QueryConfig<UseReverseRegistryNameReturnType, Error>

type QueryKey<TParams extends UseReverseRegistryNameParameters> = CreateQueryKey<
  TParams,
  'getReverseRegistryName',
  'standard'
>

export const getReverseRegistryNameQueryFn = async <
  TParams extends UseReverseRegistryNameParameters,
>({
  queryKey: [{ address }, chainId, _address],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!address) throw new Error('address is required')

  try {
    const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

    const reverseRegistryHash = namehash(`${address.toLowerCase().slice(2)}.addr.reverse`)

    const resolverAddress = await publicClient.readContract({
      address: getChainContractAddress({ client: publicClient, contract: 'ensRegistry' }),
      functionName: 'resolver',
      abi: registryResolverSnippet,
      args: [reverseRegistryHash],
    })

    const name = await publicClient.readContract({
      address: resolverAddress,
      abi: publicResolverNameSnippet,
      functionName: 'name',
      args: [reverseRegistryHash],
    })

    return name as string
  } catch (e) {
    return ''
  }
}

export const useReverseRegistryName = <TParams extends UseReverseRegistryNameParameters>({
  address,
  enabled,
}: TParams & UseReverseRegistryNameConfig) => {
  const _enabled = enabled ?? true

  const queryKey = useQueryKeyFactory({
    params: { address },
    functionName: 'getReverseRegistryName',
    queryDependencyType: 'standard',
  })

  return useQuery(queryKey, getReverseRegistryNameQueryFn, {
    enabled: _enabled && !!address,
    retryOnMount: true,
  })
}
