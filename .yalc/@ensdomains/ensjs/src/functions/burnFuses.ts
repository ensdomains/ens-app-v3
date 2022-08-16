import { ENSArgs } from '..'
import { FuseOptions } from '../@types/FuseOptions'
import generateFuseInput from '../utils/generateFuseInput'
import { namehash } from '../utils/normalise'

export default async function (
  { contracts, signer }: ENSArgs<'contracts' | 'signer'>,
  name: string,
  {
    fusesToBurn,
  }: {
    fusesToBurn: FuseOptions
  },
) {
  const nameWrapper = (await contracts?.getNameWrapper()!).connect(signer)
  const hash = namehash(name)

  const encodedFuses = generateFuseInput(fusesToBurn)

  return nameWrapper.populateTransaction.setFuses(hash, encodedFuses)
}
