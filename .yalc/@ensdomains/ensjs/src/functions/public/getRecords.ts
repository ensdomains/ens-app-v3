import {
  BaseError,
  decodeAbiParameters,
  decodeFunctionResult,
  encodeFunctionData,
  hexToBigInt,
  toHex,
  type Address,
  type Hex,
} from 'viem'
import type { ClientWithEns } from '../../contracts/consts.js'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import { multicallSnippet } from '../../contracts/multicall.js'
import {
  universalResolverResolveSnippet,
  universalResolverResolveWithGatewaysSnippet,
} from '../../contracts/universalResolver.js'
import type {
  DecodedAddr,
  DecodedText,
  Prettify,
  SimpleTransactionRequest,
  TransactionRequestWithPassthrough,
} from '../../types.js'
import { checkSafeUniversalResolverData } from '../../utils/checkSafeUniversalResolverData.js'
import { EMPTY_ADDRESS } from '../../utils/consts.js'
import { generateFunction } from '../../utils/generateFunction.js'
import { packetToBytes } from '../../utils/hexEncodedName.js'
import _getAbi, { type InternalGetAbiReturnType } from './_getAbi.js'
import _getAddr from './_getAddr.js'
import _getContentHash, {
  type InternalGetContentHashReturnType,
} from './_getContentHash.js'
import _getText from './_getText.js'
import multicallWrapper from './multicallWrapper.js'

export type GetRecordsParameters<
  TTexts extends readonly string[] | undefined = readonly string[],
  TCoins extends readonly (string | number)[] | undefined = readonly (
    | string
    | number
  )[],
  TContentHash extends boolean | undefined = true,
  TAbi extends boolean | undefined = true,
> = {
  /** Name to get records for */
  name: string
  /** Text record key array */
  texts?: TTexts
  /** Coin record id/symbol array */
  coins?: TCoins
  /** If true, will fetch content hash */
  contentHash?: TContentHash
  /** If true, will fetch ABI */
  abi?: TAbi
  /** Optional specific resolver address, for fallback or for all results */
  resolver?: {
    /** Resolver address */
    address: Address
    /** If true, will only use resolver if main fetch fails */
    fallbackOnly?: boolean
  }
  /** Batch gateway URLs to use for resolving CCIP-read requests. */
  gatewayUrls?: string[]
}

type WithContentHashResult = {
  /** Retrieved content hash record for name */
  contentHash: InternalGetContentHashReturnType
}

type WithAbiResult = {
  /** Retrieved ABI record for name */
  abi: InternalGetAbiReturnType
}

type WithTextsResult = {
  /** Retrieved text records for name */
  texts: DecodedText[]
}

type WithCoinsResult = {
  /** Retrieved coins for name */
  coins: DecodedAddr[]
}

export type GetRecordsReturnType<
  TTexts extends readonly string[] | undefined = readonly string[],
  TCoins extends readonly (string | number)[] | undefined = readonly (
    | string
    | number
  )[],
  TContentHash extends boolean | undefined = true,
  TAbi extends boolean | undefined = true,
> = Prettify<
  (TContentHash extends true ? WithContentHashResult : {}) &
    (TAbi extends true ? WithAbiResult : {}) &
    (TTexts extends readonly string[] ? WithTextsResult : {}) &
    (TCoins extends readonly (string | number)[] ? WithCoinsResult : {}) & {
      /** Resolver address used for fetch */
      resolverAddress: Address
    }
>

type CallObj =
  | {
      key: string
      call: SimpleTransactionRequest
      type: 'text'
    }
  | {
      key: string | number
      call: SimpleTransactionRequest
      type: 'coin'
    }
  | {
      key: 'contentHash'
      call: SimpleTransactionRequest
      type: 'contentHash'
    }
  | {
      key: 'abi'
      call: SimpleTransactionRequest
      type: 'abi'
    }

type EncodeReturnType = Required<
  TransactionRequestWithPassthrough<{
    calls: (CallObj | null)[]
    address?: Address
    args?: any
  }>
>

const createCalls = (
  client: ClientWithEns,
  {
    name,
    texts,
    coins,
    abi,
    contentHash,
  }: Pick<
    GetRecordsParameters,
    'name' | 'texts' | 'coins' | 'abi' | 'contentHash'
  >,
) => [
  ...(texts ?? []).map(
    (text) =>
      ({
        key: text,
        call: _getText.encode(client, { name, key: text }),
        type: 'text',
      } as const),
  ),
  ...(coins ?? []).map(
    (coin) =>
      ({
        key: coin,
        call: _getAddr.encode(client, { name, coin }),
        type: 'coin',
      } as const),
  ),
  ...(contentHash
    ? ([
        {
          key: 'contentHash',
          call: _getContentHash.encode(client, { name }),
          type: 'contentHash',
        },
      ] as const)
    : []),
  ...(abi
    ? ([
        { key: 'abi', call: _getAbi.encode(client, { name }), type: 'abi' },
      ] as const)
    : []),
]

const encode = (
  client: ClientWithEns,
  {
    name,
    resolver,
    texts,
    coins,
    contentHash,
    abi,
    gatewayUrls,
  }: GetRecordsParameters,
): EncodeReturnType => {
  const calls = createCalls(client, {
    name,
    texts,
    coins,
    contentHash,
    abi,
  })

  if (resolver?.address && !resolver.fallbackOnly) {
    const encoded = multicallWrapper.encode(client, {
      transactions: calls.map((c) => ({
        to: resolver.address,
        data: c.call.data,
      })),
    })
    return {
      ...encoded,
      passthrough: { calls },
    }
  }

  const to = getChainContractAddress({
    client,
    contract: 'ensUniversalResolver',
  })
  const args = [
    toHex(packetToBytes(name)),
    encodeFunctionData({
      abi: multicallSnippet,
      args: [calls.map((c) => c.call.data)],
    }),
  ] as const

  return {
    to,
    ...(gatewayUrls
      ? {
          data: encodeFunctionData({
            abi: universalResolverResolveWithGatewaysSnippet,
            functionName: 'resolveWithGateways',
            args: [...args, gatewayUrls] as const,
          }),
          passthrough: {
            calls,
            args: [...args, gatewayUrls],
            address: to,
          },
        }
      : {
          data: encodeFunctionData({
            abi: universalResolverResolveSnippet,
            functionName: 'resolve',
            args,
          }),
          passthrough: {
            calls,
            args,
            address: to,
          },
        }),
  }
}

const createEmptyResult = <
  TTexts extends readonly string[] | undefined,
  TCoins extends readonly (string | number)[] | undefined,
  TContentHash extends boolean | undefined,
  TAbi extends boolean | undefined,
>({
  texts,
  coins,
  abi,
  contentHash,
}: Pick<
  GetRecordsParameters<TTexts, TCoins, TContentHash, TAbi>,
  'texts' | 'coins' | 'abi' | 'contentHash'
>) => ({
  ...(texts ? { texts: [] as DecodedText[] } : {}),
  ...(coins ? { coins: [] as DecodedAddr[] } : {}),
  ...(contentHash ? { contentHash: null } : {}),
  ...(abi ? { abi: null } : {}),
})

const decodeRecord = async (
  client: ClientWithEns,
  { item, call }: { item: Hex; call: CallObj },
) => {
  const { key, type } = call
  const baseItem = { key, type }
  if (type === 'contentHash') {
    try {
      const decodedFromAbi = decodeAbiParameters(
        [{ type: 'bytes' }] as const,
        item,
      )[0]
      if (decodedFromAbi === '0x' || hexToBigInt(decodedFromAbi) === 0n) {
        return { ...baseItem, value: null }
      }
    } catch {
      // ignore
    }
  }
  if (type === 'text') {
    const decodedFromAbi = await _getText.decode(client, item, {
      strict: false,
    })
    return { ...baseItem, value: decodedFromAbi }
  }
  if (type === 'coin') {
    const decodedFromAbi = await _getAddr.decode(client, item, {
      coin: key,
      strict: false,
    })
    return { ...baseItem, value: decodedFromAbi }
  }
  if (type === 'contentHash') {
    const decodedFromAbi = await _getContentHash.decode(client, item, {
      strict: false,
    })
    return { ...baseItem, value: decodedFromAbi }
  }
  // abi
  const decodedFromAbi = await _getAbi.decode(client, item, {
    strict: false,
  })
  return { ...baseItem, value: decodedFromAbi }
}

const createRecordResult = (
  prev: GetRecordsReturnType,
  curr: Awaited<ReturnType<typeof decodeRecord>>,
) => {
  if (curr.type === 'text' || curr.type === 'coin') {
    if (!curr.value) {
      return prev
    }
  }
  if (curr.type === 'text') {
    return {
      ...prev,
      texts: [
        ...(prev.texts || []),
        { key: curr.key, value: curr.value } as DecodedText,
      ],
    }
  }
  if (curr.type === 'coin') {
    return {
      ...prev,
      coins: [...(prev.coins || []), curr.value as DecodedAddr],
    }
  }
  if (curr.type === 'contentHash') {
    return {
      ...prev,
      contentHash: curr.value as InternalGetContentHashReturnType,
    }
  }
  // abi
  return { ...prev, abi: curr.value as InternalGetAbiReturnType }
}

const decode = async <
  const TTexts extends readonly string[] | undefined = readonly string[],
  const TCoins extends readonly (string | number)[] | undefined = readonly (
    | string
    | number
  )[],
  const TContentHash extends boolean | undefined = undefined,
  const TAbi extends boolean | undefined = undefined,
>(
  client: ClientWithEns,
  data: Hex | BaseError,
  passthrough: EncodeReturnType['passthrough'],
  {
    resolver,
    texts,
    coins,
    contentHash,
    abi,
    gatewayUrls,
  }: GetRecordsParameters<TTexts, TCoins, TContentHash, TAbi>,
): Promise<GetRecordsReturnType<TTexts, TCoins, TContentHash, TAbi>> => {
  const { calls } = passthrough
  let recordData: (Hex | null)[] = []
  let resolverAddress: Address

  const emptyResult = createEmptyResult({ texts, coins, contentHash, abi })

  if (resolver?.address && !resolver.fallbackOnly) {
    const result = await multicallWrapper.decode(
      client,
      data,
      passthrough.calls.filter((c) => c).map((c) => c!.call),
    )
    resolverAddress = resolver.address
    recordData = result.map((r) => r.returnData)
  } else {
    const isSafe = checkSafeUniversalResolverData(data, {
      strict: false,
      abi: gatewayUrls
        ? universalResolverResolveWithGatewaysSnippet
        : universalResolverResolveSnippet,
      args: passthrough.args,
      functionName: 'resolve',
      address: passthrough.address,
    })

    if (!isSafe)
      return {
        ...emptyResult,
        resolverAddress: EMPTY_ADDRESS,
      } as GetRecordsReturnType<TTexts, TCoins, TContentHash, TAbi>

    const result = decodeFunctionResult({
      abi: universalResolverResolveSnippet,
      functionName: 'resolve',
      data,
    })
    ;[, resolverAddress] = result
    recordData = decodeFunctionResult({
      abi: multicallSnippet,
      data: result[0],
    }).map((r) => {
      if (r === '0x') return null
      return (r.length - 2) % 32 === 0 ? r : null
    })
  }

  const filteredCalls = calls.filter((x) => x) as CallObj[]
  const filteredRecordData = recordData.filter((x) => x) as Hex[]

  const decodedRecords = await Promise.all(
    filteredRecordData.map(async (item, i) =>
      decodeRecord(client, { item, call: filteredCalls[i] }),
    ),
  )

  const records = decodedRecords.reduce(createRecordResult, {
    ...emptyResult,
    resolverAddress,
  } as GetRecordsReturnType)

  return records as GetRecordsReturnType<TTexts, TCoins, TContentHash, TAbi>
}

type EncoderFunction = typeof encode
type DecoderFunction = typeof decode<any>

type BatchableFunctionObject = {
  encode: EncoderFunction
  decode: DecoderFunction
  batch: <
    const TTexts extends readonly string[] | undefined = undefined,
    const TCoins extends readonly (string | number)[] | undefined = undefined,
    const TContentHash extends boolean | undefined = undefined,
    const TAbi extends boolean | undefined = undefined,
  >(
    args: GetRecordsParameters<TTexts, TCoins, TContentHash, TAbi>,
  ) => {
    args: [GetRecordsParameters<TTexts, TCoins, TContentHash, TAbi>]
    encode: EncoderFunction
    decode: typeof decode<TTexts, TCoins, TContentHash, TAbi>
  }
}

/**
 * Gets arbitrary records for a name
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetRecordsParameters}
 * @returns Records data object. {@link GetRecordsReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getRecords } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getRecords(client, {
 *   name: 'ens.eth',
 *   texts: ['com.twitter', 'com.github'],
 *   coins: ['ETH'],
 *   contentHash: true,
 * })
 * // { texts: [{ key: 'com.twitter', value: 'ensdomains' }, { key: 'com.github', value: 'ensdomains' }], coins: [{ id: 60, name: 'ETH', value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7' }], contentHash: { protocolType: 'ipns', decoded: 'k51qzi5uqu5djdczd6zw0grmo23j2vkj9uzvujencg15s5rlkq0ss4ivll8wqw' } }
 */
const getRecords = generateFunction({ encode, decode }) as (<
  const TTexts extends readonly string[] | undefined = undefined,
  const TCoins extends readonly (string | number)[] | undefined = undefined,
  const TContentHash extends boolean | undefined = undefined,
  const TAbi extends boolean | undefined = undefined,
>(
  client: ClientWithEns,
  {
    name,
    texts,
    coins,
    contentHash,
    abi,
    resolver,
    gatewayUrls,
  }: GetRecordsParameters<TTexts, TCoins, TContentHash, TAbi>,
) => Promise<GetRecordsReturnType<TTexts, TCoins, TContentHash, TAbi>>) &
  BatchableFunctionObject

export default getRecords
