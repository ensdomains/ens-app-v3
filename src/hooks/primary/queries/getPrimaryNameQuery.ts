import { readContract } from '@wagmi/core'
import { Address, getChainContractAddress } from 'viem'

import { ConfigWithEns } from '@app/types'

const newUniversalResolverAbiReverseSnippet = [
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'encodedAddress',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'coinType',
        type: 'uint256',
      },
    ],
    name: 'reverse',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const getPrimaryNameQuery =
  (config: ConfigWithEns) =>
  ({ address, coinType = 60 }: { address: Address; coinType?: number }) => {
    const client = config.getClient()
    return readContract(config, {
      address: getChainContractAddress({
        chain: client.chain,
        contract: 'ensUniversalResolver',
      }),
      abi: newUniversalResolverAbiReverseSnippet,
      functionName: 'reverse',
      args: [address, BigInt(coinType)],
    })
  }
