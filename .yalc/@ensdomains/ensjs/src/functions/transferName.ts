import { keccak256 as solidityKeccak256 } from '@ethersproject/solidity'
import { ENSArgs } from '..'
import { namehash } from '../utils/normalise'

export default async function (
  { contracts, signer }: ENSArgs<'contracts' | 'signer'>,
  name: string,
  {
    newOwner,
    contract,
    reclaim,
  }: {
    newOwner: string
    contract: 'registry' | 'nameWrapper' | 'baseRegistrar'
    reclaim?: boolean
  },
) {
  const address = await signer.getAddress()

  switch (contract) {
    case 'registry': {
      const registry = (await contracts?.getRegistry())!.connect(signer)
      return registry.populateTransaction.setOwner(namehash(name), newOwner)
    }
    case 'baseRegistrar': {
      const baseRegistrar = (await contracts?.getBaseRegistrar())!.connect(
        signer,
      )
      const labels = name.split('.')
      if (labels.length > 2 || labels[labels.length - 1] !== 'eth') {
        throw new Error('Invalid name for baseRegistrar')
      }
      const tokenId = solidityKeccak256(['string'], [labels[0]])

      // reclaim if sending manager on unwrapped name
      if (reclaim) {
        return baseRegistrar.populateTransaction.reclaim(tokenId, newOwner)
      }

      return baseRegistrar.populateTransaction[
        'safeTransferFrom(address,address,uint256)'
      ](address, newOwner, tokenId)
    }
    case 'nameWrapper': {
      const nameWrapper = (await contracts?.getNameWrapper())!.connect(signer)
      return nameWrapper.populateTransaction.safeTransferFrom(
        address,
        newOwner,
        namehash(name),
        1,
        '0x',
      )
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`)
    }
  }
}
