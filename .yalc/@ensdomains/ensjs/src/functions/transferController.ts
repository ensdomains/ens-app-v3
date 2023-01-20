import { keccak256 as solidityKeccak256 } from '@ethersproject/solidity'

import { ENSArgs } from '..'

export default async function (
  { contracts, signer }: ENSArgs<'contracts' | 'signer'>,
  name: string,
  {
    newOwner,
    isOwner,
  }: {
    newOwner: string
    isOwner: boolean
  },
) {
  const baseRegistrar = (await contracts?.getBaseRegistrar())!.connect(signer)
  const registry = (await contracts?.getRegistry())!.connect(signer)
  const labels = name.split('.')
  if (isOwner) {
    return registry.populateTransaction.setOwner(
      solidityKeccak256(['string'], [labels[0]]),
      newOwner,
    )
  }
  return baseRegistrar.populateTransaction.reclaim(
    solidityKeccak256(['string'], [labels[0]]),
    newOwner,
  )
}
