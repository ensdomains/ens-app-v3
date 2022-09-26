import { ethers } from 'ethers'
import { ENSArgs } from '..'
import { namehash } from '../utils/normalise'

type Args = {
  contract: 'registry' | 'nameWrapper'
}

export default async function (
  { contracts, signer }: ENSArgs<'contracts' | 'signer' | 'getExpiry'>,
  name: string,
  { contract }: Args,
) {
  const labels = name.split('.')

  if (labels.length !== 3) {
    throw new Error('ENS.js currently only supports deleting 2LDs, not TLDs')
  }

  if (labels[2] !== 'eth') {
    throw new Error('ENS.js currently only supports deleting .eth 2LDs')
  }

  const label = labels.shift() as string
  const labelhash = ethers.utils.solidityKeccak256(['string'], [label])
  const parentNodehash = namehash(labels.join('.'))

  switch (contract) {
    case 'registry': {
      const registry = (await contracts!.getRegistry()!).connect(signer)

      return registry.populateTransaction.setSubnodeRecord(
        parentNodehash,
        labelhash,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        0,
      )
    }
    case 'nameWrapper': {
      const nameWrapper = (await contracts!.getNameWrapper()!).connect(signer)

      return nameWrapper.populateTransaction.setSubnodeRecord(
        parentNodehash,
        label,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        0,
        0,
        0,
      )
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`)
    }
  }
}
