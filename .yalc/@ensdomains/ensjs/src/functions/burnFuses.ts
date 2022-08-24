import { ENSArgs } from '..'
import { namehash } from '../utils/normalise'
import { fuseEnum } from '../utils/fuses'

export default async function (
  { contracts, signer }: ENSArgs<'contracts' | 'signer'>,
  name: string,
  {
    fusesToBurn,
  }: {
    fusesToBurn: Partial<keyof typeof fuseEnum>[] 
  },
) {
  const nameWrapper = (await contracts?.getNameWrapper()!).connect(signer)
  const hash = namehash(name)

  const encodedFuses = fusesToBurn.reduce((previousValue: number, currentValue): number => {
    return previousValue + fuseEnum[currentValue]
  }, 0)

  return nameWrapper.populateTransaction.setFuses(hash, encodedFuses)
}
