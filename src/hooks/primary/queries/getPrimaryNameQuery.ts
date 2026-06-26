import { readContract } from '@wagmi/core'
import { Address, getChainContractAddress } from 'viem'

import { universalResolverReverseSnippet } from '@ensdomains/ensjs/contracts'
import { getAddressRecord } from '@ensdomains/ensjs/public'
import { normalise } from '@ensdomains/ensjs/utils'

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

      const [name, resolvedAddress] = result
      const normalizedName = normalise(name)
      if (normalizedName !== name) return null

      const addressRecord = await getAddressRecord(client, {
        name: normalizedName,
        coin: getCoderByCoinTypeWithTestnetSupport(coinType).name,
      })
      if (!addressRecord?.value || addressRecord.value.toLowerCase() !== address.toLowerCase()) {
        return null
      }

      if (resolvedAddress?.toLowerCase && resolvedAddress.toLowerCase() !== address.toLowerCase()) {
        return null
      }

      return {
        name,
        address,
        coinType,
        coinName: getCoderByCoinTypeWithTestnetSupport(coinType).name,
      }
    } catch (error) {
      return null
    }
  }
