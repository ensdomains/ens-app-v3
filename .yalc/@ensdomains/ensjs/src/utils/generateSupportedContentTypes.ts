import type { EncodeAbiParameters } from './encoders/encodeAbi.js'

type AbiEncodeAs = EncodeAbiParameters['encodeAs']

const abiEncodeMap: { [key in AbiEncodeAs]: bigint } = {
  json: 1n,
  zlib: 2n,
  cbor: 4n,
  uri: 8n,
} as const

export const generateSupportedContentTypes = (
  encodeAsItemOrList: AbiEncodeAs | AbiEncodeAs[],
): bigint => {
  const encodeAsList = Array.isArray(encodeAsItemOrList)
    ? encodeAsItemOrList
    : [encodeAsItemOrList]
  return encodeAsList.reduce<bigint>((result, encodeAs) => {
    const contentType = abiEncodeMap[encodeAs]
    if (contentType) result |= contentType
    return result
  }, 0n)
}
