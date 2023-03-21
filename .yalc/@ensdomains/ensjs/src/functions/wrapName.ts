import { defaultAbiCoder } from '@ethersproject/abi'
import { Signer } from '@ethersproject/abstract-signer'
import { keccak256 as solidityKeccak256 } from '@ethersproject/solidity'
import { ENSArgs } from '..'
import { CombinedFuseInput, encodeFuses } from '../utils/fuses'
import { hexEncodeName } from '../utils/hexEncodedName'
import { checkIsDotEth } from '../utils/validation'
import { Expiry, wrappedLabelLengthCheck } from '../utils/wrapper'

async function wrapETH(
  { contracts }: ENSArgs<'contracts'>,
  labels: string[],
  wrappedOwner: string,
  decodedFuses: number,
  resolverAddress: string,
  signer: Signer,
  address: string,
) {
  const nameWrapper = await contracts?.getNameWrapper()!
  const baseRegistrar = (await contracts!.getBaseRegistrar()!).connect(signer)

  const labelhash = solidityKeccak256(['string'], [labels[0]])

  const data = defaultAbiCoder.encode(
    ['string', 'address', 'uint16', 'address'],
    [labels[0], wrappedOwner, decodedFuses, resolverAddress],
  )

  return baseRegistrar.populateTransaction[
    'safeTransferFrom(address,address,uint256,bytes)'
  ](address, nameWrapper.address, labelhash, data)
}

async function wrapOther(
  { contracts }: ENSArgs<'contracts'>,
  name: string,
  wrappedOwner: string,
  resolverAddress: string,
  address: string,
  signer: Signer,
) {
  const nameWrapper = (await contracts!.getNameWrapper()!).connect(signer)
  const registry = await contracts?.getRegistry()!

  const hasApproval = await registry.isApprovedForAll(
    address,
    nameWrapper.address,
  )

  if (!hasApproval) {
    throw new Error(
      'NameWrapper must have approval to wrap a name from this address.',
    )
  }

  return nameWrapper.populateTransaction.wrap(
    hexEncodeName(name),
    wrappedOwner,
    resolverAddress,
  )
}

export default async function (
  { contracts, signer }: ENSArgs<'contracts' | 'signer'>,
  name: string,
  {
    wrappedOwner,
    fuseOptions,
    expiry,
    resolverAddress,
  }: {
    wrappedOwner: string
    fuseOptions?: Partial<CombinedFuseInput> | number
    expiry?: Expiry
    resolverAddress?: string
  },
) {
  const address = await signer.getAddress()

  let decodedFuses: number

  const publicResolver = await contracts?.getPublicResolver()!
  if (!resolverAddress) resolverAddress = publicResolver.address

  const labels = name.split('.')
  wrappedLabelLengthCheck(labels[0])

  if (checkIsDotEth(labels)) {
    switch (typeof fuseOptions) {
      case 'object': {
        decodedFuses = encodeFuses(fuseOptions)
        break
      }
      case 'number': {
        decodedFuses = fuseOptions
        break
      }
      case 'undefined': {
        decodedFuses = 0
        break
      }
      default: {
        throw new Error(`Invalid fuseOptions type: ${typeof fuseOptions}`)
      }
    }

    return wrapETH(
      { contracts },
      labels,
      wrappedOwner,
      decodedFuses,
      resolverAddress,
      signer,
      address,
    )
  }
  if (fuseOptions)
    throw new Error(
      'Fuses can not be initially set when wrapping a non .eth name',
    )
  if (expiry)
    throw new Error(
      'Expiry can not be initially set when wrapping a non .eth name',
    )
  return wrapOther(
    { contracts },
    name,
    wrappedOwner,
    resolverAddress,
    address,
    signer,
  )
}
