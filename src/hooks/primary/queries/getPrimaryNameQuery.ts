import { readContract } from '@wagmi/core'
import { Address, getChainContractAddress } from 'viem'

import { universalResolverReverseSnippet } from '@ensdomains/ensjs/contracts'

import { ConfigWithEns } from '@app/types'
import { getCoderByCoinTypeWithTestnetSupport } from '@app/utils/records'

export type GetPrimaryNameQueryReturnType = {
  name: string
  address: Address
  coinType: number
  coinName: string
} | null

export const getPrimaryNameQuery =
  (config: ConfigWithEns) =>
  async ({
    address,
    coinType = 60,
  }: {
    address: Address
    coinType?: number
  }): Promise<GetPrimaryNameQueryReturnType> => {
    try {
      const client = config.getClient()
      const result = await readContract(config, {
        address: getChainContractAddress({ chain: client.chain, contract: 'ensUniversalResolver' }),
        abi: universalResolverReverseSnippet,
        functionName: 'reverse',
        args: [address, BigInt(coinType)],
      })
      return {
        name: result[0],
        address,
        coinType,
        coinName: getCoderByCoinTypeWithTestnetSupport(coinType).name,
      }
    } catch (error) {
      return null
    }
  }
