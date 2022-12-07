import { BigNumber } from 'ethers'
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
    const [owner, _fuses, expiry] = nameWrapper.interface.decodeFunctionResult(
      'getData',
      data,
    )

    const fuses = BigNumber.from(_fuses)
    const fuseObj = decodeFuses(fuses)

    const expiryDate = new Date(expiry * 1000)

    return {
      fuseObj,
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
