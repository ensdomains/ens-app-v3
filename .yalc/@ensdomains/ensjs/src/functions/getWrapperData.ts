import { BigNumber } from '@ethersproject/bignumber'
import { ENSArgs } from '../index'
import { MAX_DATE_INT } from '../utils/consts'
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

    let expiryDate: Date | undefined

    if (expiry.gt(0)) {
      const msBigNumber = expiry.mul(1000)
      if (msBigNumber.gte(MAX_DATE_INT)) {
        expiryDate = new Date(MAX_DATE_INT)
      } else {
        expiryDate = new Date(msBigNumber.toNumber())
      }
    }

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
