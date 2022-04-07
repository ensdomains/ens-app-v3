import { ethers } from 'ethers'
import { ENSArgs } from '..'
import { hexEncodeName } from '../utils/hexEncodedName'

const raw = async ({ contracts }: ENSArgs<'contracts'>, address: string) => {
  const universalResolver = await contracts?.getUniversalResolver()!
  const reverseNode = address.toLowerCase().substring(2) + '.addr.reverse'
  return {
    to: universalResolver.address,
    data: universalResolver.interface.encodeFunctionData('reverse', [
      hexEncodeName(reverseNode),
    ]),
  }
}

const decode = async (
  { contracts }: ENSArgs<'contracts'>,
  data: string,
  address: string,
) => {
  if (data === null) return null
  const universalResolver = await contracts?.getUniversalResolver()!
  try {
    const result = universalResolver.interface.decodeFunctionResult(
      'reverse',
      data,
    )
    const decoded = ethers.utils.defaultAbiCoder.decode(
      ['bytes', 'address'],
      result['1'],
    )
    const [addr] = ethers.utils.defaultAbiCoder.decode(['address'], decoded[0])
    return {
      name: result['0'],
      match: addr.toLowerCase() === address.toLowerCase(),
    }
  } catch {
    return { name: null, match: false }
  }
}

export default {
  raw,
  decode,
}
