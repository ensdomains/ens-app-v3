import type { BaseError, Hex } from 'viem'
import type { ClientWithEns } from '../../contracts/consts.js'
import type {
  GenericPassthrough,
  Prettify,
  SimpleTransactionRequest,
} from '../../types.js'
import {
  generateFunction,
  type GeneratedFunction,
} from '../../utils/generateFunction.js'
import _getAbi, {
  type InternalGetAbiParameters,
  type InternalGetAbiReturnType,
} from './_getAbi.js'
import universalWrapper from './universalWrapper.js'

export type GetAbiRecordParameters = Prettify<
  InternalGetAbiParameters & {
    /** Batch gateway URLs to use for resolving CCIP-read requests. */
    gatewayUrls?: string[]
  }
>

export type GetAbiRecordReturnType = Prettify<InternalGetAbiReturnType>

const encode = (
  client: ClientWithEns,
  {
    name,
    supportedContentTypes,
    gatewayUrls,
  }: Omit<GetAbiRecordParameters, 'strict'>,
): SimpleTransactionRequest => {
  const prData = _getAbi.encode(client, { name, supportedContentTypes })
  return universalWrapper.encode(client, {
    name,
    data: prData.data,
    gatewayUrls,
  })
}

const decode = async (
  client: ClientWithEns,
  data: Hex | BaseError,
  passthrough: GenericPassthrough,
  { strict }: Pick<GetAbiRecordParameters, 'strict'>,
): Promise<GetAbiRecordReturnType> => {
  const urData = await universalWrapper.decode(client, data, passthrough, {
    strict,
  })
  if (!urData) return null
  return _getAbi.decode(client, urData.data, { strict })
}

type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>

/**
 * Gets the ABI record for a name
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetAbiRecordParameters}
 * @returns ABI record for the name, or `null` if not found. {@link GetAbiRecordReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getAbiRecord } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getAbiRecord(client, { name: 'ens.eth' })
 * // TODO: real example
 */
const getAbiRecord = generateFunction({ encode, decode }) as ((
  client: ClientWithEns,
  { name, strict }: GetAbiRecordParameters,
) => Promise<GetAbiRecordReturnType>) &
  BatchableFunctionObject

export default getAbiRecord
