import {
  BaseError,
  decodeFunctionResult,
  encodeFunctionData,
  type Hex,
} from 'viem'
import { bulkRenewalRentPriceSnippet } from '../../contracts/bulkRenewal.js'
import type { ClientWithEns } from '../../contracts/consts.js'
import { ethRegistrarControllerRentPriceSnippet } from '../../contracts/ethRegistrarController.js'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import { UnsupportedNameTypeError } from '../../errors/general.js'
import type { SimpleTransactionRequest } from '../../types.js'
import {
  generateFunction,
  type GeneratedFunction,
} from '../../utils/generateFunction.js'
import { getNameType } from '../../utils/getNameType.js'
import multicallWrapper from './multicallWrapper.js'

export type GetPriceParameters = {
  /** Name, or array of names, to get price for */
  nameOrNames: string | string[]
  /** Duration in seconds to get price for */
  duration: bigint | number
}

export type GetPriceReturnType = {
  /** Price base value */
  base: bigint
  /** Price premium */
  premium: bigint
}

const encode = (
  client: ClientWithEns,
  { nameOrNames, duration }: GetPriceParameters,
): SimpleTransactionRequest => {
  const names = (Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]).map(
    (name) => {
      const labels = name.split('.')
      const nameType = getNameType(name)
      if (nameType !== 'eth-2ld' && nameType !== 'tld')
        throw new UnsupportedNameTypeError({
          nameType,
          supportedNameTypes: ['eth-2ld', 'tld'],
          details: 'Currently only the price of eth-2ld names can be fetched',
        })
      return labels[0]
    },
  )

  if (names.length > 1) {
    const bulkRenewalAddress = getChainContractAddress({
      client,
      contract: 'ensBulkRenewal',
    })
    return multicallWrapper.encode(client, {
      transactions: [
        {
          to: bulkRenewalAddress,
          data: encodeFunctionData({
            abi: bulkRenewalRentPriceSnippet,
            functionName: 'rentPrice',
            args: [names, BigInt(duration)],
          }),
        },
        {
          to: bulkRenewalAddress,
          data: encodeFunctionData({
            abi: bulkRenewalRentPriceSnippet,
            functionName: 'rentPrice',
            args: [names, 0n],
          }),
        },
      ],
    })
  }
  return {
    to: getChainContractAddress({
      client,
      contract: 'ensEthRegistrarController',
    }),
    data: encodeFunctionData({
      abi: ethRegistrarControllerRentPriceSnippet,
      functionName: 'rentPrice',
      args: [names[0], BigInt(duration)],
    }),
  }
}

const decode = async (
  client: ClientWithEns,
  data: Hex | BaseError,
  { nameOrNames }: GetPriceParameters,
): Promise<GetPriceReturnType> => {
  if (typeof data === 'object') throw data
  const isBulkRenewal = Array.isArray(nameOrNames) && nameOrNames.length > 1
  if (isBulkRenewal) {
    const result = await multicallWrapper.decode(client, data, [])
    const price = decodeFunctionResult({
      abi: bulkRenewalRentPriceSnippet,
      functionName: 'rentPrice',
      data: result[0].returnData,
    })
    const premium = decodeFunctionResult({
      abi: bulkRenewalRentPriceSnippet,
      functionName: 'rentPrice',
      data: result[1].returnData,
    })
    const base = price - premium
    return { base, premium }
  }

  return decodeFunctionResult({
    abi: ethRegistrarControllerRentPriceSnippet,
    functionName: 'rentPrice',
    data,
  })
}

type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>

/**
 * Gets the price of a name, or array of names, for a given duration.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetPriceParameters}
 * @returns Price data object. {@link GetPriceReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getPrice } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getPrice(client, { nameOrNames: 'ens.eth', duration: 31536000 })
 * // { base: 352828971668930335n, premium: 0n }
 */
const getPrice = generateFunction({ encode, decode }) as ((
  client: ClientWithEns,
  { nameOrNames, duration }: GetPriceParameters,
) => Promise<GetPriceReturnType>) &
  BatchableFunctionObject

export default getPrice
