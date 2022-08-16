import { BigNumber } from 'ethers'
import { ENSArgs } from '..'
import { fuseEnum } from '../utils/fuses'
import { namehash } from '../utils/normalise'

const NameSafety = [
  'Safe',
  'RegistrantNotWrapped',
  'ControllerNotWrapped',
  'SubdomainReplacementAllowed',
  'Expired',
]

const raw = async ({ contracts }: ENSArgs<'contracts'>, name: string) => {
  const nameWrapper = await contracts?.getNameWrapper()!
  return {
    to: nameWrapper.address,
    data: nameWrapper.interface.encodeFunctionData('getData', [namehash(name)]),
  }
}

const decode = async (
  { contracts }: ENSArgs<'contracts'>,
  data: string,
  name: string,
) => {
  const nameWrapper = await contracts?.getNameWrapper()!
  try {
    const {
      owner,
      fuses: _fuses,
      expiry,
    } = nameWrapper.interface.decodeFunctionResult('getData', data)

    const fuses = BigNumber.from(_fuses)

    const fuseObj = Object.fromEntries(
      Object.keys(fuseEnum).map((fuse) => [
        fuse,
        fuses.and(fuseEnum[fuse as keyof typeof fuseEnum]).gt(0),
      ]),
    )

    if (fuses.eq(0)) {
      fuseObj.canDoEverything = true
    } else {
      fuseObj.canDoEverything = false
    }

    const expiryDate = new Date(expiry * 1000)

    return {
      fuseObj,
      expiryDate,
      rawFuses: fuses,
      owner,
    }
  } catch (e) {
    console.error('Error decoding fuses data: ', e)
    return
  }
}

export default {
  raw,
  decode,
}
