import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import { ENSArgs } from '../index'
import { decodeFuses } from '../utils/fuses'
import { namehash } from '../utils/normalise'

const raw = async ({ contracts }: ENSArgs<'contracts'>, name: string) => {
  const nameWrapper = await contracts?.getNameWrapper()!
  return {
    to: nameWrapper.address,
    data: nameWrapper.interface.encodeFunctionData('getData', [namehash(name)]),
  }
}

const decode = async ({ contracts }: ENSArgs<'contracts'>, data: string) => {
  const nameWrapper = await contracts?.getNameWrapper()!
  try {
    const [owner, fuses, expiry] = nameWrapper.interface.decodeFunctionResult(
      'getData',
      data,
    ) as [string, number, BigNumber]

    const fuseObj = decodeFuses(fuses)

    const expiryDate =
      expiry.gt(0) && expiry.lt(BigNumber.from(2).pow(32))
        ? new Date(expiry.mul(1000).toString())
        : undefined

    return {
      ...fuseObj,
      expiryDate,
      rawFuses: fuses,
      owner,
    }
  } catch (e) {
    console.error('Error decoding wrapper data: ', e)
    return
  }
}

export default {
  raw,
  decode,
}
