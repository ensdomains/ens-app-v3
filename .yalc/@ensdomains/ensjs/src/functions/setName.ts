import { ENSArgs } from '..'

export default async function (
  { contracts, provider }: ENSArgs<'contracts' | 'provider'>,
  name: string,
) {
  const address = await provider?.getSigner().getAddress()

  if (!address) {
    throw new Error('No signer found')
  }

  const reverseRegistrar = (await contracts?.getReverseRegistrar())?.connect(
    provider?.getSigner()!,
  )

  return reverseRegistrar?.setName(name)
}
