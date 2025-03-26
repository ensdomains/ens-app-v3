import { bytesToHex, encodeFunctionData, type Address, type Hex } from 'viem'
import { publicResolverSetAddrSnippet } from '../../contracts/publicResolver.js'
import { getCoderFromCoin } from '../normaliseCoinId.js'

export type EncodeSetAddrParameters = {
  namehash: Hex
  coin: string | number
  value: Address | string | null
}

export type EncodeSetAddrReturnType = Hex

export const encodeSetAddr = ({
  namehash,
  coin,
  value,
}: EncodeSetAddrParameters): EncodeSetAddrReturnType => {
  const coder = getCoderFromCoin(coin)
  const inputCoinType = coder.coinType
  let encodedAddress: Hex | Uint8Array = value ? coder.decode(value) : '0x'
  if (inputCoinType === 60 && encodedAddress === '0x')
    encodedAddress = coder.decode('0x0000000000000000000000000000000000000000')
  if (typeof encodedAddress !== 'string') {
    encodedAddress = bytesToHex(encodedAddress)
  }

  return encodeFunctionData({
    abi: publicResolverSetAddrSnippet,
    functionName: 'setAddr',
    args: [namehash, BigInt(inputCoinType), encodedAddress],
  })
}
