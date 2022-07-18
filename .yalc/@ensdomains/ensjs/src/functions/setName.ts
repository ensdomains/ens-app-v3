import { ENSArgs } from '..'

export default async function (
  { contracts, signer }: ENSArgs<'contracts' | 'signer'>,
  name: string,
  {
    address,
    resolver,
  }: {
    address?: string
    resolver?: string
  } = {},
) {
  const signerAddress = await signer.getAddress()

  const reverseRegistrar = (await contracts?.getReverseRegistrar())?.connect(
    signer,
  )!

  if (address) {
    const publicResolver = await contracts?.getPublicResolver()!

    return reverseRegistrar.populateTransaction.setNameForAddr(
      address,
      signerAddress,
      resolver || publicResolver.address,
      name,
    )
  }

  return reverseRegistrar.populateTransaction.setName(name)
}
