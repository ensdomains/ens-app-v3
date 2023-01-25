import { ENSArgs } from '../index'
import { CombinedFuseInput, encodeFuses } from '../utils/fuses'
import { labelhash } from '../utils/labels'
import { namehash } from '../utils/normalise'

export async function setChildFuses(
  { contracts, signer }: ENSArgs<'contracts' | 'signer'>,
  name: string,
  {
    fuses,
    expiry = 0,
  }: {
    fuses: Partial<CombinedFuseInput> | number
    expiry?: number
  },
) {
  const encodedFuses = encodeFuses(fuses)

  const labels = name.split('.')
  const labelHash = labelhash(labels.shift()!)
  const parentNode = namehash(labels.join('.'))

  const nameWrapper = (await contracts!.getNameWrapper()!).connect(signer)

  return nameWrapper.populateTransaction.setChildFuses(
    parentNode,
    labelHash,
    encodedFuses,
    expiry,
  )
}

export default async function (
  { contracts, signer }: ENSArgs<'contracts' | 'signer'>,
  name: string,
  props: CombinedFuseInput['child'],
) {
  const encodedFuses = encodeFuses(props, 'child')

  const nameWrapper = (await contracts!.getNameWrapper()!).connect(signer)
  const hash = namehash(name)

  return nameWrapper.populateTransaction.setFuses(hash, encodedFuses)
}
