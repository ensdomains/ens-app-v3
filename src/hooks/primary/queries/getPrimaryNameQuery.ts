import { readContract } from '@wagmi/core'
import { Address, getChainContractAddress } from 'viem'

import { ConfigWithEns } from '@app/types'
import { getCoderByCoinTypeWithTestnetSupport } from '@app/utils/records'

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

export type GetPrimaryNameQueryReturnType = {
  name: string
  address: Address
  coinType: number
  coinName: string
}

export const getPrimaryNameQuery =
  (config: ConfigWithEns) =>
  async ({
    address,
    coinType = 60,
  }: {
    address: Address
    coinType?: number
  }): Promise<GetPrimaryNameQueryReturnType> => {
    const client = config.getClient()
    const result = await readContract(config, {
      address: getChainContractAddress({ chain: client.chain, contract: 'ensUniversalResolver' }),
      abi: newUniversalResolverAbiReverseSnippet,
      functionName: 'reverse',
      args: [address, BigInt(coinType)],
    })

    return {
      name: result[0],
      address,
      coinType,
      coinName: getCoderByCoinTypeWithTestnetSupport(coinType).name,
    }
  }
