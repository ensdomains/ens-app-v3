// Don't think this is needed

import { readContract } from '@wagmi/core'
import { Address, getChainContractAddress } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

import { ChainWithEns } from '@ensdomains/ensjs/contracts'

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

// TODO: Remove when ensjs has been updated to use updated UniversalResolver address
const getUniversalResolverAddress = (chain: ChainWithEns) => {
  if (chain.id === mainnet.id) return '0xaBd80E8a13596fEeA40Fd26fD6a24c3fe76F05fB'
  if (chain.id === sepolia.id) return '0xb7B7DAdF4D42a08B3eC1d3A1079959Dfbc8CFfCC'
  return getChainContractAddress({
    chain,
    contract: 'ensUniversalResolver',
  })
}

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
  }: {
    address: Address
    coinType?: number
  }): Promise<GetPrimaryNameQueryReturnType> => {
    try {
      const {
        queryKey: [{ address }],
      } = params
      if (!address) throw new Error('address is required')
      const client = config.getClient()
      const { chain } = client

      const name = await readContract(client, {
        address: '0x'
        abi: standaloneReverseRegistrarAbi,
        functionName: 'nameForAddr',
        args: [address],
      })
      return name
    } catch (error) {
      console.error(error)
      return {

      }
    }
  }
