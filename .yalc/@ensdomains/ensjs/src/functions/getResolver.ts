import { ethers } from 'ethers'
import { ENSArgs } from '..'
import { hexEncodeName } from '../utils/hexEncodedName'

const raw = async ({ contracts }: ENSArgs<'contracts'>, name: string) => {
  const universalResolver = await contracts?.getUniversalResolver()!
  return {
    to: universalResolver.address,
    data: universalResolver.interface.encodeFunctionData(
      'findResolver(bytes)',
      [hexEncodeName(name)],
    ),
  }
}

const decode = async ({ contracts }: ENSArgs<'contracts'>, data: string) => {
  const universalResolver = await contracts?.getUniversalResolver()!
  const response = universalResolver.interface.decodeFunctionResult(
    'findResolver(bytes)',
    data,
  )

  if (
    !response ||
    !response[0] ||
    ethers.utils.hexStripZeros(response[0]) === '0x'
  ) {
    return null
  }
  return response[0]
}

export default { raw, decode }
