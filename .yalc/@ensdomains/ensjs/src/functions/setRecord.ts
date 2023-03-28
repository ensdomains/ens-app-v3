import { ENSArgs } from '..'
import { namehash } from '../utils/normalise'
import { generateSingleRecordCall, RecordInput } from '../utils/recordHelpers'

type BaseInput = {
  resolverAddress?: string
}

type ContentHashInput = {
  record: RecordInput<'contentHash'>
  type: 'contentHash'
}

type AddrOrTextInput = {
  record: RecordInput<'addr' | 'text'>
  type: 'addr' | 'text'
}

type ABIInput = {
  record: RecordInput<'abi'>
  type: 'abi'
}

export default async function (
  {
    contracts,
    provider,
    getResolver,
    signer,
  }: ENSArgs<'contracts' | 'provider' | 'getResolver' | 'signer'>,
  name: string,
  {
    record,
    type,
    resolverAddress,
  }: BaseInput & (ContentHashInput | AddrOrTextInput | ABIInput),
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

  const call = generateSingleRecordCall(hash, resolver, type)(record)

  return {
    to: resolver.address,
    data: call,
  }
}
