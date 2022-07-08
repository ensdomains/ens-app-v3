import { ENSArgs } from '..'

export default async function (
  { contracts, provider }: ENSArgs<'contracts' | 'provider'>,
  name: string,
  address?: string,
  resolver?: string,
  options?: { addressOrIndex?: string | number },
) {
  const signerAddress = await provider
    ?.getSigner(options?.addressOrIndex)
    .getAddress()

  if (!signerAddress) {
    throw new Error('No signer found')
  }

  const reverseRegistrar = (await contracts?.getReverseRegistrar())?.connect(
    provider?.getSigner()!,
  )

  if (address) {
    const publicResolver = await contracts?.getPublicResolver()

    return reverseRegistrar?.setNameForAddr(
      address,
      signerAddress,
      resolver || publicResolver!.address,
      name,
    )
  }

  return reverseRegistrar?.setName(name)
}
