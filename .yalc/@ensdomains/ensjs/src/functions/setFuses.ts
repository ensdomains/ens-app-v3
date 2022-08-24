import { ENSArgs } from '..'
import { namehash } from '../utils/normalise'
import fuseEnum from '../utils/fuses'

export default async function (
  { contracts, signer }: ENSArgs<'contracts' | 'signer'>,
  name: string,
  { selectedFuses }: { selectedFuses: Array<keyof typeof fuseEnum> },
) {
  const fuseNumber = selectedFuses.reduce((previousValue: number, currentValue): number => {
    return previousValue + fuseEnum[currentValue]
  }, 0)
  const nameWrapper = (await contracts?.getNameWrapper())!.connect(signer)
  return nameWrapper.populateTransaction.setFuses(namehash(name), fuseNumber)
}
