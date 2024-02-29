import type { Address } from 'viem'
import { useReadContract } from 'wagmi'

import { SupportedChain } from '@app/constants/chains'

import { useContractAddress } from './chain/useContractAddress'

type UseApprovedForAllParameters = {
  contract: keyof SupportedChain['contracts']
  address: Address
  operatorContract: keyof SupportedChain['contracts'] | 'ensDnsRegistrar'
  enabled?: boolean
}

const isApprovedForAllSnippet = [
  {
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const useApprovedForAll = ({
  contract,
  address,
  operatorContract,
  enabled = true,
}: UseApprovedForAllParameters) => {
  const contractAddress = useContractAddress({ contract })
  const operatorAddress = useContractAddress({
    contract: operatorContract,
  })
  return useReadContract({
    abi: isApprovedForAllSnippet,
    address: contractAddress,
    functionName: 'isApprovedForAll',
    args: [address, operatorAddress],
    query: {
      enabled: enabled && !!address && !!contractAddress && !!operatorAddress,
    },
  })
}
