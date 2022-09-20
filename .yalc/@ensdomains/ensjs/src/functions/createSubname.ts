import { BigNumber, ethers } from 'ethers'
import { ENSArgs } from '..'
import { FuseOptions } from '../@types/FuseOptions'
import generateFuseInput from '../utils/generateFuseInput'
import { namehash } from '../utils/normalise'
import { Expiry, makeExpiry } from '../utils/wrapperExpiry'

type BaseArgs = {
  owner: string
  resolverAddress?: string
  contract: 'registry' | 'nameWrapper'
}

type NameWrapperArgs = {
  contract: 'nameWrapper'
  fuses?: FuseOptions
  expiry?: Expiry
} & BaseArgs

type Args = BaseArgs | NameWrapperArgs

export default async function (
  {
    contracts,
    signer,
    getExpiry,
  }: ENSArgs<'contracts' | 'signer' | 'getExpiry'>,
  name: string,
  { owner, resolverAddress, contract, ...wrapperArgs }: Args,
) {
  const labels = name.split('.')

  if (labels.length === 1) {
    throw new Error('Subnames in ENS.js can only be created for 2LDs, not TLDs')
  }

  if ('fuses' in wrapperArgs && contract === 'registry') {
    throw new Error('Fuses can only be set on a wrapped name')
  }

  if (!resolverAddress) {
    resolverAddress = (await contracts?.getPublicResolver())!.address
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
        owner,
        resolverAddress,
        0,
      )
    }
    case 'nameWrapper': {
      const nameWrapper = (await contracts!.getNameWrapper()!).connect(signer)
      const expiry: BigNumber = await makeExpiry(
        { getExpiry },
        name,
        'expiry' in wrapperArgs ? wrapperArgs.expiry : undefined,
      )

      const generatedFuses =
        'fuses' in wrapperArgs && wrapperArgs.fuses
          ? generateFuseInput(wrapperArgs.fuses)
          : '0'

      return nameWrapper.populateTransaction.setSubnodeRecord(
        parentNodehash,
        label,
        owner,
        resolverAddress,
        0,
        generatedFuses,
        expiry,
      )
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`)
    }
  }
}
