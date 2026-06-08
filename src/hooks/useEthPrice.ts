import { useQuery } from '@tanstack/react-query'
import { Address, decodeAbiParameters, encodeFunctionData } from 'viem'
import { useChainId, usePublicClient } from 'wagmi'

import { getSnrcAddresses } from '@app/constants/chains'

import { useAddressRecord } from './ensjs/public/useAddressRecord'

const ORACLE_ENS = 'eth-usd.data.eth'

const latestAnswerCalldata = encodeFunctionData({
  abi: [
    {
      inputs: [],
      name: 'latestAnswer',
      outputs: [{ name: '', type: 'int256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ],
  functionName: 'latestAnswer',
})

export const useEthPrice = () => {
  const chainId = useChainId()
  const snrcOracle = (getSnrcAddresses(chainId) as { DummyOracle?: Address }).DummyOracle

  const { data: address_ } = useAddressRecord({
    name: ORACLE_ENS,
  })

  const address = snrcOracle || (address_?.value as Address) || undefined
  const client = usePublicClient({ chainId })

  // Use eth_call directly via client.request() so we sidestep the wagmi
  // public client's `batch.multicall` aggregation. The Chainlink read kept
  // getting silently dropped when bundled into a Multicall3 aggregate3 with
  // sibling reads that revert.
  const query = useQuery({
    queryKey: ['useEthPrice', chainId, address],
    enabled: !!address && !!client,
    staleTime: 60_000,
    refetchInterval: 300_000,
    queryFn: async () => {
      const raw = await client!.request({
        method: 'eth_call',
        params: [{ to: address!, data: latestAnswerCalldata }, 'latest'],
      })
      const [value] = decodeAbiParameters([{ type: 'int256' }], raw as `0x${string}`)
      return value
    },
  })

  return query
}
