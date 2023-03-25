import { keccak256 as solidityKeccak256 } from '@ethersproject/solidity'
import { ENSArgs } from '..'
import { namehash } from '../utils/normalise'
import { expiryToBigNumber, Expiry } from '../utils/wrapper'

type BaseArgs = {
  owner: string
  resolverAddress?: string
  contract: 'registry' | 'nameWrapper'
}

type NameWrapperArgs = {
  contract: 'nameWrapper'
  expiry?: Expiry
} & BaseArgs

type Args = BaseArgs | NameWrapperArgs

export default async function (
  { contracts, signer }: ENSArgs<'contracts' | 'signer'>,
  name: string,
  { contract, owner, resolverAddress, ...wrapperArgs }: Args,
) {
  const labels = name.split('.')
  const label = labels.shift() as string
  const labelhash = solidityKeccak256(['string'], [label])
  const parentNodehash = namehash(labels.join('.'))

  switch (contract) {
    case 'registry': {
      const registry = (await contracts!.getRegistry()!).connect(signer)

      return registry.populateTransaction.setSubnodeOwner(
        parentNodehash,
        labelhash,
        owner,
      )
    }
    case 'nameWrapper': {
      const nameWrapper = (await contracts!.getNameWrapper()!).connect(signer)
      const expiry = expiryToBigNumber(
        (wrapperArgs as NameWrapperArgs).expiry,
        0,
      )

      return nameWrapper.populateTransaction.setSubnodeOwner(
        parentNodehash,
        label,
        owner,
        '0',
        expiry,
      )
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`)
    }
  }
}
