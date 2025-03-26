import {
  decodeFunctionResult,
  encodeFunctionData,
  hexToBytes,
  hexToString,
  type Hex,
} from 'viem'
import type { ClientWithEns } from '../../contracts/consts.js'
import { publicResolverAbiSnippet } from '../../contracts/publicResolver.js'
import type {
  DecodedAbi,
  Prettify,
  SimpleTransactionRequest,
} from '../../types.js'
import { EMPTY_ADDRESS } from '../../utils/consts.js'
import { generateFunction } from '../../utils/generateFunction.js'
import { namehash } from '../../utils/normalise.js'

export type InternalGetAbiParameters = {
  /** Name to get ABI record for */
  name: string
  /** Supported content types as bitwise
   * ID 1: JSON
   * ID 2: zlib compressed JSON
   * ID 4: CBOR
   * ID 8: URI
   */
  supportedContentTypes?: bigint
  /** Whether or not to throw decoding errors */
  strict?: boolean
}

export type InternalGetAbiReturnType = Prettify<DecodedAbi | null>

const encode = (
  _client: ClientWithEns,
  {
    name,
    supportedContentTypes = 0xfn,
  }: Omit<InternalGetAbiParameters, 'strict'>,
): SimpleTransactionRequest => {
  return {
    to: EMPTY_ADDRESS,
    data: encodeFunctionData({
      abi: publicResolverAbiSnippet,
      functionName: 'ABI',
      args: [namehash(name), supportedContentTypes],
    }),
  }
}

const decode = async (
  _client: ClientWithEns,
  data: Hex,
  { strict }: Pick<InternalGetAbiParameters, 'strict'>,
): Promise<InternalGetAbiReturnType> => {
  if (data === '0x') return null

  try {
    const [bigintContentType, encodedAbiData] = decodeFunctionResult({
      abi: publicResolverAbiSnippet,
      functionName: 'ABI',
      data,
    })

    if (!bigintContentType || !encodedAbiData) {
      return null
    }

    const contentType = Number(bigintContentType)
    if (!contentType) {
      return null
    }

    let abiData: string | object
    let decoded = false
    switch (contentType) {
      // JSON
      case 1:
        abiData = JSON.parse(hexToString(encodedAbiData))
        decoded = true
        break
      // zlib compressed JSON
      case 2: {
        const { inflate } = await import('pako/dist/pako_inflate.min.js')
        abiData = JSON.parse(
          inflate(hexToBytes(encodedAbiData), { to: 'string' }),
        )
        decoded = true
        break
      }
      // CBOR
      case 4: {
        const { cborDecode } = await import('@ensdomains/address-encoder/utils')
        abiData = await cborDecode(hexToBytes(encodedAbiData).buffer)
        decoded = true
        break
      }
      // URI
      case 8:
        abiData = hexToString(encodedAbiData)
        decoded = true
        break
      default:
        try {
          abiData = hexToString(encodedAbiData)
          decoded = true
        } catch {
          abiData = encodedAbiData
        }
    }

    return {
      contentType,
      decoded,
      abi: abiData,
    }
  } catch (error) {
    if (strict) throw error
    return null
  }
}

const _getAbi = generateFunction({ encode, decode })

export default _getAbi
