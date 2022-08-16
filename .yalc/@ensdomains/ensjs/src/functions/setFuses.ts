import { ENSArgs } from '..'
import { namehash } from '../utils/normalise'

export default async function (
  { contracts, signer }: ENSArgs<'contracts' | 'signer'>,
  name: string,
  { fuses }: { fuses: number },
) {
  const nameWrapper = (await contracts?.getNameWrapper())!.connect(signer)
  return nameWrapper.populateTransaction.setFuses(namehash(name), fuses)
}
