import { encodeFunctionData, type Hex } from 'viem'
import { publicResolverSetContenthashSnippet } from '../../contracts/publicResolver.js'
import { encodeContentHash } from '../contentHash.js'

export type EncodeSetContentHashParameters = {
  namehash: Hex
  contentHash: string | null
}

export type EncodeSetContentHashReturnType = Hex

export const encodeSetContentHash = ({
  namehash,
  contentHash,
}: EncodeSetContentHashParameters): EncodeSetContentHashReturnType => {
  let encodedHash: Hex = '0x'
  if (contentHash) {
    encodedHash = encodeContentHash(contentHash)
  }
  return encodeFunctionData({
    abi: publicResolverSetContenthashSnippet,
    functionName: 'setContenthash',
    args: [namehash, encodedHash],
  })
}
