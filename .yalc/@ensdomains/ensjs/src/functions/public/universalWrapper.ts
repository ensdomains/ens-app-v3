import {
  BaseError,
  decodeFunctionResult,
  encodeFunctionData,
  labelhash,
  toBytes,
  toHex,
  type Address,
  type Hex,
} from 'viem'
import type { ClientWithEns } from '../../contracts/consts.js'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import {
  universalResolverResolveSnippet,
  universalResolverResolveWithGatewaysSnippet,
} from '../../contracts/universalResolver.js'
import type {
  GenericPassthrough,
  TransactionRequestWithPassthrough,
} from '../../types.js'
import { checkSafeUniversalResolverData } from '../../utils/checkSafeUniversalResolverData.js'
import { generateFunction } from '../../utils/generateFunction.js'
import { packetToBytes } from '../../utils/hexEncodedName.js'
import { encodeLabelhash } from '../../utils/labels.js'

export type UniversalWrapperParameters = {
  name: string
  data: Hex
  strict?: boolean
  gatewayUrls?: string[]
}

export type UniversalWrapperReturnType = {
  data: Hex
  resolver: Address
} | null

const encode = (
  client: ClientWithEns,
  { name, data, gatewayUrls }: Omit<UniversalWrapperParameters, 'strict'>,
): TransactionRequestWithPassthrough => {
  const nameWithSizedLabels = name
    .split('.')
    .map((label) => {
      const labelLength = toBytes(label).byteLength
      if (labelLength > 255) {
        return encodeLabelhash(labelhash(label))
      }
      return label
    })
    .join('.')
  const to = getChainContractAddress({
    client,
    contract: 'ensUniversalResolver',
  })
  const args = [toHex(packetToBytes(nameWithSizedLabels)), data] as const

  return {
    to,
    ...(gatewayUrls?.length
      ? {
          data: encodeFunctionData({
            abi: universalResolverResolveWithGatewaysSnippet,
            functionName: 'resolveWithGateways',
            args: [...args, gatewayUrls] as const,
          }),
          passthrough: {
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
            args,
            address: to,
          },
        }),
  }
}

const decode = async (
  _client: ClientWithEns,
  data: Hex | BaseError,
  passthrough: GenericPassthrough,
  {
    strict,
    gatewayUrls,
  }: Pick<UniversalWrapperParameters, 'strict' | 'gatewayUrls'>,
): Promise<UniversalWrapperReturnType> => {
  const isSafe = checkSafeUniversalResolverData(data, {
    strict,
    abi: gatewayUrls
      ? universalResolverResolveWithGatewaysSnippet
      : universalResolverResolveSnippet,
    args: passthrough.args,
    functionName: 'resolve',
    address: passthrough.address,
  })

  if (!isSafe) return null

  try {
    const result = decodeFunctionResult({
      abi: universalResolverResolveSnippet,
      functionName: 'resolve',
      data,
    })
    return { data: result[0], resolver: result[1] }
  } catch (error) {
    if (strict) throw error
    return null
  }
}

const universalWrapper = generateFunction({ encode, decode })

export default universalWrapper
