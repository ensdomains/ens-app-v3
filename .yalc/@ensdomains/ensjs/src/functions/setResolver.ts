import { ENSArgs } from '..'
import { namehash } from '../utils/normalise'

export default async function (
  { contracts, signer }: ENSArgs<'contracts' | 'signer'>,
  name: string,
  {
    contract,
    resolver,
  }: {
    contract: 'registry' | 'nameWrapper'
    resolver?: string
  },
) {
  if (!resolver) {
    resolver = (await contracts!.getPublicResolver()!).address
  }

  switch (contract) {
    case 'registry': {
      const registry = (await contracts?.getRegistry())!.connect(signer)
      return registry.populateTransaction.setResolver(namehash(name), resolver)
    }
    case 'nameWrapper': {
      const nameWrapper = (await contracts?.getNameWrapper())!.connect(signer)
      return nameWrapper.populateTransaction.setResolver(
        namehash(name),
        resolver,
      )
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`)
    }
  }
}
