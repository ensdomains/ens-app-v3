import { encodeFunctionData, type Hex } from 'viem'
import { publicResolverSetTextSnippet } from '../../contracts/publicResolver.js'

export type EncodeSetTextParameters = {
  namehash: Hex
  key: string
  value: string | null
}

export type EncodeSetTextReturnType = Hex

export const encodeSetText = ({
  namehash,
  key,
  value,
}: EncodeSetTextParameters): EncodeSetTextReturnType => {
  return encodeFunctionData({
    abi: publicResolverSetTextSnippet,
    functionName: 'setText',
    args: [namehash, key, value ?? ''],
  })
}
