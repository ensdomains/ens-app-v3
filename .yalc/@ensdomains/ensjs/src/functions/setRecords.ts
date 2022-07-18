import { ENSArgs } from '..'
import { namehash } from '../utils/normalise'
import { generateRecordCallArray, RecordOptions } from '../utils/recordHelpers'

export default async function (
  {
    contracts,
    provider,
    getResolver,
    signer,
  }: ENSArgs<'contracts' | 'provider' | 'getResolver' | 'signer'>,
  name: string,
  {
    records,
    resolverAddress,
  }: {
    records: RecordOptions
    resolverAddress?: string
  },
) {
  if (!name.includes('.')) {
    throw new Error('Input is not an ENS name')
  }

  let resolverToUse: string
  if (resolverAddress) {
    resolverToUse = resolverAddress
  } else {
    resolverToUse = await getResolver(name)
  }

  if (!resolverToUse) {
    throw new Error('No resolver found for input address')
  }

  const resolver = (
    await contracts?.getPublicResolver(provider, resolverToUse)
  )?.connect(signer)!
  const hash = namehash(name)

  const calls: string[] = generateRecordCallArray(hash, records, resolver!)

  return resolver.populateTransaction.multicall(calls)
}
