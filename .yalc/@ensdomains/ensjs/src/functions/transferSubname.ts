import { ethers } from 'ethers'
import { ENSArgs } from '..'
import { namehash } from '../utils/normalise'

export default async function (
  { contracts, signer }: ENSArgs<'contracts' | 'signer'>,
  name: string,
  {
    contract,
    address,
  }: {
    contract: 'registry' | 'nameWrapper'
    address: string
  },
) {
  const labels = name.split('.')
  const label = labels.shift() as string
  const labelhash = ethers.utils.solidityKeccak256(['string'], [label])
  const parentNodehash = namehash(labels.join('.'))

  switch (contract) {
    case 'registry': {
      const registry = (await contracts?.getRegistry()!).connect(signer)

      return registry.populateTransaction.setSubnodeOwner(
        parentNodehash,
        labelhash,
        address,
      )
    }
    case 'nameWrapper': {
      const nameWrapper = (await contracts?.getNameWrapper()!).connect(signer)

      return nameWrapper.populateTransaction.setSubnodeOwner(
        parentNodehash,
        label,
        address,
        '0',
      )
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`)
    }
  }
}
