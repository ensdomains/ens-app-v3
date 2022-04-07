import { ethers } from 'ethers'
import { ENSArgs } from '..'

export default async function (
  { contracts, provider }: ENSArgs<'contracts' | 'provider'>,
  name: string,
  contract: 'registry' | 'nameWrapper',
  options?: { addressOrIndex?: string | number },
) {
  const signer = provider?.getSigner(options?.addressOrIndex)

  if (!signer) {
    throw new Error('No signer found')
  }

  const labels = name.split('.')
  const label = labels.shift()
  const labelhash = ethers.utils.solidityKeccak256(['string'], [label])
  const parentNodehash = ethers.utils.namehash(labels.join('.'))

  switch (contract) {
    case 'registry': {
      const registry = (await contracts?.getRegistry()!).connect(signer)

      return registry.setSubnodeOwner(
        parentNodehash,
        labelhash,
        '0x0000000000000000000000000000000000000000',
      )
    }
    case 'nameWrapper': {
      const nameWrapper = (await contracts?.getNameWrapper()!).connect(signer)

      return nameWrapper.setSubnodeOwner(
        parentNodehash,
        labelhash,
        '0x0000000000000000000000000000000000000000',
      )
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`)
    }
  }
}
