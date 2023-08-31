import type { Address } from 'viem'
import { useContractRead } from 'wagmi'

import { useContractAddress } from './chain/useContractAddress'

type UseWrapperApprovedForAllParameters = {
  address: Address
  isSubname?: boolean
  canBeWrapped?: boolean
  enabled?: boolean
}

const registryIsApprovedForAllSnippet = [
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

export const useWrapperApprovedForAll = ({
  address,
  isSubname,
  canBeWrapped,
  enabled = true,
}: UseWrapperApprovedForAllParameters) => {
  const registryAddress = useContractAddress({ contract: 'ensRegistry' })
  const nameWrapperAddress = useContractAddress({ contract: 'ensNameWrapper' })
  return useContractRead({
    abi: registryIsApprovedForAllSnippet,
    address: registryAddress,
    functionName: 'isApprovedForAll',
    args: [address, nameWrapperAddress],
    enabled: enabled && !!address && !!nameWrapperAddress && isSubname && canBeWrapped,
  })
}
