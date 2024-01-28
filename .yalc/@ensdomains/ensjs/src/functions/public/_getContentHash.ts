import { decodeFunctionResult, encodeFunctionData, type Hex } from 'viem'
import type { ClientWithEns } from '../../contracts/consts.js'
import { publicResolverContenthashSnippet } from '../../contracts/publicResolver.js'
import type { Prettify, SimpleTransactionRequest } from '../../types.js'
import { EMPTY_ADDRESS } from '../../utils/consts.js'
import {
  decodeContentHash,
  type DecodedContentHash,
} from '../../utils/contentHash.js'
import { generateFunction } from '../../utils/generateFunction.js'
import { namehash } from '../../utils/normalise.js'

export type InternalGetContentHashParameters = {
  /** Name to get content hash record for */
  name: string
  /** Whether or not to throw decoding errors */
  strict?: boolean
}

export type InternalGetContentHashReturnType =
  Prettify<DecodedContentHash | null>

const encode = (
  _client: ClientWithEns,
  { name }: Omit<InternalGetContentHashParameters, 'strict'>,
): SimpleTransactionRequest => {
  return {
    to: EMPTY_ADDRESS,
    data: encodeFunctionData({
      abi: publicResolverContenthashSnippet,
      functionName: 'contenthash',
      args: [namehash(name)],
    }),
  }
}

const decode = async (
  _client: ClientWithEns,
  data: Hex,
  { strict }: Pick<InternalGetContentHashParameters, 'strict'>,
): Promise<InternalGetContentHashReturnType> => {
  if (data === '0x') return null

  try {
    const response = decodeFunctionResult({
      abi: publicResolverContenthashSnippet,
      functionName: 'contenthash',
      data,
    })

    return decodeContentHash(response)
  } catch (error) {
    if (strict) throw error
    return null
  }
}

const _getContentHash = generateFunction({ encode, decode })

export default _getContentHash
