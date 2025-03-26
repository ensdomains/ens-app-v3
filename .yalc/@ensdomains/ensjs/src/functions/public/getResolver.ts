import {
  BaseError,
  decodeFunctionResult,
  encodeFunctionData,
  getContractError,
  toHex,
  type Address,
  type Hex,
} from 'viem'
import type { ClientWithEns } from '../../contracts/consts.js'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import { universalResolverFindResolverSnippet } from '../../contracts/universalResolver.js'
import type {
  GenericPassthrough,
  TransactionRequestWithPassthrough,
} from '../../types.js'
import { EMPTY_ADDRESS } from '../../utils/consts.js'
import {
  generateFunction,
  type GeneratedFunction,
} from '../../utils/generateFunction.js'
import { packetToBytes } from '../../utils/hexEncodedName.js'

export type GetResolverParameters = {
  /** Name to get resolver for */
  name: string
}

export type GetResolverReturnType = Address | null

const encode = (
  client: ClientWithEns,
  { name }: GetResolverParameters,
): TransactionRequestWithPassthrough => {
  const address = getChainContractAddress({
    client,
    contract: 'ensUniversalResolver',
  })
  const args = [toHex(packetToBytes(name))] as const
  return {
    to: address,
    data: encodeFunctionData({
      abi: universalResolverFindResolverSnippet,
      functionName: 'findResolver',
      args,
    }),
    passthrough: { address, args },
  }
}

const decode = async (
  _client: ClientWithEns,
  data: Hex | BaseError,
  passthrough: GenericPassthrough,
): Promise<GetResolverReturnType> => {
  if (typeof data === 'object')
    throw getContractError(data, {
      abi: universalResolverFindResolverSnippet,
      functionName: 'findResolver',
      args: passthrough.args,
      address: passthrough.address,
    }) as BaseError
  const response = decodeFunctionResult({
    abi: universalResolverFindResolverSnippet,
    functionName: 'findResolver',
    data,
  })

  if (response[0] === EMPTY_ADDRESS) return null

  return response[0]
}

type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>

/**
 * Gets the resolver address for a name.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetResolverParameters}
 * @returns Resolver address, or null if none is found. {@link GetResolverReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getResolver } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getResolver(client, { name: 'ens.eth' })
 * // 0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41
 */
const getResolver = generateFunction({ encode, decode }) as ((
  client: ClientWithEns,
  { name }: GetResolverParameters,
) => Promise<GetResolverReturnType>) &
  BatchableFunctionObject

export default getResolver
