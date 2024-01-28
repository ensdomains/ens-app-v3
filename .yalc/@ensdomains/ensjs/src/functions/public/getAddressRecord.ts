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
import _getAddr, {
  type InternalGetAddrParameters,
  type InternalGetAddrReturnType,
} from './_getAddr.js'
import universalWrapper from './universalWrapper.js'

export type GetAddressRecordParameters = Prettify<
  InternalGetAddrParameters & {
    /** Batch gateway URLs to use for resolving CCIP-read requests. */
    gatewayUrls?: string[]
  }
>

export type GetAddressRecordReturnType = Prettify<InternalGetAddrReturnType>

const encode = (
  client: ClientWithEns,
  {
    name,
    coin,
    gatewayUrls,
  }: Omit<GetAddressRecordParameters, 'strict' | 'bypassFormat'>,
): SimpleTransactionRequest => {
  const prData = _getAddr.encode(client, { name, coin })
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
  { coin, strict }: Pick<GetAddressRecordParameters, 'coin' | 'strict'>,
): Promise<GetAddressRecordReturnType> => {
  const urData = await universalWrapper.decode(client, data, passthrough, {
    strict,
  })
  if (!urData) return null
  return _getAddr.decode(client, urData.data, { coin, strict })
}

type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>

/**
 * Gets an address record for a name and specified coin
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetAddressRecordParameters}
 * @returns Coin value object, or `null` if not found. {@link GetAddressRecordReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getAddressRecord } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getAddressRecord(client, { name: 'ens.eth', coin: 'ETH' })
 * // { id: 60, name: 'ETH , value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7' }
 */
const getAddressRecord = generateFunction({ encode, decode }) as ((
  client: ClientWithEns,
  { name, coin, bypassFormat, strict }: GetAddressRecordParameters,
) => Promise<GetAddressRecordReturnType>) &
  BatchableFunctionObject

export default getAddressRecord
