import { ENSArgs } from '..'
import { FuseProps, validateFuses } from '../utils/fuses'
import { namehash } from '../utils/normalise'

export default async function (
  { contracts, signer }: ENSArgs<'contracts' | 'signer'>,
  name: string,
  props: FuseProps,
) {
  const encodedFuses = validateFuses(props)

  const nameWrapper = (await contracts!.getNameWrapper()!).connect(signer)
  const hash = namehash(name)

  return nameWrapper.populateTransaction.setFuses(hash, encodedFuses)
}
