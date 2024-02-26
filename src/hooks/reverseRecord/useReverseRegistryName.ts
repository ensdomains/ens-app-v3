import { useMemo } from 'react'
import { Address, bytesToHex, decodeFunctionResult, encodeFunctionData, namehash } from 'viem'
import { useClient, useReadContract } from 'wagmi'

import {
  getChainContractAddress,
  universalResolverResolveSnippet,
} from '@ensdomains/ensjs/contracts'
import { packetToBytes } from '@ensdomains/ensjs/utils'

import { QueryConfig } from '@app/types'

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
] as const

type UseReverseRegistryNameParameters = {
  address: Address | undefined
}

type UseReverseRegistryNameReturnType = string

type UseReverseRegistryNameConfig = QueryConfig<UseReverseRegistryNameReturnType, Error>

const getContractArgs = (address: Address | undefined) => {
  if (!address) return
  const reverseNode = `${address.toLowerCase().slice(2)}.addr.reverse`
  return [
    bytesToHex(packetToBytes(reverseNode)),
    encodeFunctionData({
      abi: publicResolverNameSnippet,
      functionName: 'name',
      args: [namehash(reverseNode)],
    }),
  ] as const
}

export const useReverseRegistryName = <TParams extends UseReverseRegistryNameParameters>({
  address,
  enabled = true,
}: TParams & UseReverseRegistryNameConfig) => {
  const client = useClient()

  const args = useMemo(() => getContractArgs(address), [address])

  const query = useReadContract({
    abi: universalResolverResolveSnippet,
    address: getChainContractAddress({ client, contract: 'ensUniversalResolver' }),
    functionName: 'resolve',
    args,
    query: {
      enabled,
      retry: 0,
    },
  })

  const data = useMemo(
    () =>
      query.data
        ? decodeFunctionResult({ abi: publicResolverNameSnippet, data: query.data[0] })
        : undefined,
    [query.data],
  )

  return { ...query, data }
}
