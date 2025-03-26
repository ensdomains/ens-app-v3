import type { BaseError, Hex } from 'viem'
import type { ClientWithEns } from '../../contracts/consts.js'
import type {
  GenericPassthrough,
  Prettify,
  TransactionRequestWithPassthrough,
} from '../../types.js'
import {
  generateFunction,
  type GeneratedFunction,
} from '../../utils/generateFunction.js'
import _getContentHash, {
  type InternalGetContentHashParameters,
  type InternalGetContentHashReturnType,
} from './_getContentHash.js'
import universalWrapper from './universalWrapper.js'

export type GetContentHashRecordParameters = Prettify<
  InternalGetContentHashParameters & {
    /** Batch gateway URLs to use for resolving CCIP-read requests. */
    gatewayUrls?: string[]
  }
>

export type GetContentHashRecordReturnType =
  Prettify<InternalGetContentHashReturnType>

const encode = (
  client: ClientWithEns,
  { name, gatewayUrls }: Omit<GetContentHashRecordParameters, 'strict'>,
): TransactionRequestWithPassthrough => {
  const prData = _getContentHash.encode(client, { name })
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
  {
    strict,
    gatewayUrls,
  }: Pick<GetContentHashRecordParameters, 'strict' | 'gatewayUrls'>,
): Promise<GetContentHashRecordReturnType> => {
  const urData = await universalWrapper.decode(client, data, passthrough, {
    strict,
    gatewayUrls,
  })
  if (!urData) return null
  return _getContentHash.decode(client, urData.data, { strict })
}

type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>

/**
 * Gets the content hash record for a name
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetContentHashRecordParameters}
 * @returns Content hash object, or `null` if not found. {@link GetContentHashRecordReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getContentHashRecord } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getContentHashRecord(client, { name: 'ens.eth' })
 * // { protocolType: 'ipfs', decoded: 'k51qzi5uqu5djdczd6zw0grmo23j2vkj9uzvujencg15s5rlkq0ss4ivll8wqw' }
 */
const getContentHashRecord = generateFunction({ encode, decode }) as ((
  client: ClientWithEns,
  { name, strict, gatewayUrls }: GetContentHashRecordParameters,
) => Promise<GetContentHashRecordReturnType>) &
  BatchableFunctionObject

export default getContentHashRecord
