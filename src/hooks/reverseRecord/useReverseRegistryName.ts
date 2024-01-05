import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import Client, { Address, labelhash, namehash } from 'viem'
import { useAccount, useContractRead, useQuery } from 'wagmi'

import {
  getChainContractAddress,
  publicResolverAbiSnippet,
  registryResolverSnippet,
} from '@ensdomains/ensjs/contracts'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PublicClientWithChain, QueryConfig } from '@app/types'

const pubblicResolverNameSnippet = [
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

type QueryKey<TParams extends UseReverseRegistryNameParameters> = CreateQueryKey<
  TParams,
  'getReverseRegistryName',
  'standard'
>

export const getReverseRegistryNameQueryFn = async <
  TParams extends UseReverseRegistryNameParameters,
>({
  queryKey: [{ address }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!address) throw new Error('address is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  const reverseRegistryHash = namehash(`${address.slice(2)}.addr.reverse`)

  const resolverAddress = await publicClient.readContract({
    address: getChainContractAddress({ client: publicClient, contract: 'ensRegistry' }),
    functionName: 'resolver',
    abi: registryResolverSnippet,
    args: [namehash('test123.eth')],
  })
  const name = await publicClient.readContract({
    address: resolverAddress,
    abi: pubblicResolverNameSnippet,
    functionName: 'name',
    args: [],
  })

  return name
}

type Options = {
  enabled?: boolean
}

export const useReverseRegistryName = ({ enabled }: Options = {}) => {
  const _enabled = enabled ?? true

  const account = useAccount()

  const queryKey = useQueryKeyFactory({
    params: { address: account?.address },
    functionName: 'getReverseRegistryName',
    queryDependencyType: 'standard',
  })

  return useQuery(queryKey, getReverseRegistryNameQueryFn, {
    enabled: _enabled && !!account?.address,
    retryOnMount: true,
  })
}
