import {
  decodeFunctionResult,
  encodeFunctionData,
  hexToBytes,
  trim,
  type Hex,
} from 'viem'
import { namehash } from '../../utils/normalise.js'

import type { ClientWithEns } from '../../contracts/consts.js'
import {
  publicResolverMultiAddrSnippet,
  publicResolverSingleAddrSnippet,
} from '../../contracts/publicResolver.js'
import type {
  DecodedAddr,
  Prettify,
  SimpleTransactionRequest,
} from '../../types.js'
import { EMPTY_ADDRESS } from '../../utils/consts.js'
import { generateFunction } from '../../utils/generateFunction.js'
import { getCoderFromCoin } from '../../utils/normaliseCoinId.js'

export type InternalGetAddrParameters = {
  /** Name to get the address record for */
  name: string
  /** Coin to get the address record for, can be either symbol (string) or coinId (number) (default: `60`) */
  coin?: string | number
  /** Optionally return raw bytes value of address record (default: false) */
  bypassFormat?: boolean
  /** Whether or not to throw decoding errors */
  strict?: boolean
}

export type InternalGetAddrReturnType = Prettify<DecodedAddr | null>

const encode = (
  _client: ClientWithEns,
  { name, coin = 60, bypassFormat }: Omit<InternalGetAddrParameters, 'strict'>,
): SimpleTransactionRequest => {
  const coder = getCoderFromCoin(coin)
  if (coder.coinType === 60) {
    return {
      to: EMPTY_ADDRESS,
      data: encodeFunctionData({
        abi: publicResolverSingleAddrSnippet,
        functionName: 'addr',
        args: [namehash(name)],
      }),
    }
  }

  if (bypassFormat) {
    return {
      to: EMPTY_ADDRESS,
      data: encodeFunctionData({
        abi: publicResolverMultiAddrSnippet,
        functionName: 'addr',
        args: [namehash(name), BigInt(coin)],
      }),
    }
  }

  return {
    to: EMPTY_ADDRESS,
    data: encodeFunctionData({
      abi: publicResolverMultiAddrSnippet,
      functionName: 'addr',
      args: [namehash(name), BigInt(coder.coinType)],
    }),
  }
}

const decode = async (
  _client: ClientWithEns,
  data: Hex,
  { coin = 60, strict }: Pick<InternalGetAddrParameters, 'coin' | 'strict'>,
): Promise<InternalGetAddrReturnType> => {
  if (data === '0x') return null

  const coder = getCoderFromCoin(coin)
  let response: Hex

  try {
    if (coder.coinType === 60) {
      response = decodeFunctionResult({
        abi: publicResolverSingleAddrSnippet,
        functionName: 'addr',
        data,
      })
    } else {
      response = decodeFunctionResult({
        abi: publicResolverMultiAddrSnippet,
        functionName: 'addr',
        data,
      })
    }

    if (!response) return null

    const trimmed = trim(response)
    if (trimmed === '0x' || trimmed === '0x0' || trimmed === '0x00') {
      return null
    }

    const decodedAddr = coder.encode(hexToBytes(response))

    if (!decodedAddr) {
      return null
    }

    return { id: coder.coinType, name: coder.name, value: decodedAddr }
  } catch (error) {
    if (strict) throw error
    return null
  }
}

const _getAddr = generateFunction({ encode, decode })

export default _getAddr
