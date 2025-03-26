import {
  BaseError,
  decodeFunctionResult,
  encodeFunctionData,
  labelhash,
  type Hex,
} from 'viem'
import { baseRegistrarAvailableSnippet } from '../../contracts/baseRegistrar.js'
import type { ClientWithEns } from '../../contracts/consts.js'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import { UnsupportedNameTypeError } from '../../errors/general.js'
import type { SimpleTransactionRequest } from '../../types.js'
import {
  generateFunction,
  type GeneratedFunction,
} from '../../utils/generateFunction.js'
import { getNameType } from '../../utils/getNameType.js'

export type GetAvailableParameters = {
  /** Name to check availability for, only compatible for eth 2ld */
  name: string
}

export type GetAvailableReturnType = boolean

const encode = (
  client: ClientWithEns,
  { name }: GetAvailableParameters,
): SimpleTransactionRequest => {
  const labels = name.split('.')
  const nameType = getNameType(name)
  if (nameType !== 'eth-2ld')
    throw new UnsupportedNameTypeError({
      nameType,
      supportedNameTypes: ['eth-2ld'],
      details: 'Currently only eth-2ld names can be checked for availability',
    })

  return {
    to: getChainContractAddress({
      client,
      contract: 'ensBaseRegistrarImplementation',
    }),
    data: encodeFunctionData({
      abi: baseRegistrarAvailableSnippet,
      functionName: 'available',
      args: [BigInt(labelhash(labels[0]))],
    }),
  }
}

const decode = async (
  _client: ClientWithEns,
  data: Hex | BaseError,
): Promise<GetAvailableReturnType> => {
  if (typeof data === 'object') throw data
  const result = decodeFunctionResult({
    abi: baseRegistrarAvailableSnippet,
    functionName: 'available',
    data,
  })
  return result
}

type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>

/**
 * Gets the availability of a name to register
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetAvailableParameters}
 * @returns Availability as boolean. {@link GetAvailableReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getAvailable } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getAvailable(client, { name: 'ens.eth' })
 * // false
 */
const getAvailable = generateFunction({ encode, decode }) as ((
  client: ClientWithEns,
  { name }: GetAvailableParameters,
) => Promise<GetAvailableReturnType>) &
  BatchableFunctionObject

export default getAvailable
