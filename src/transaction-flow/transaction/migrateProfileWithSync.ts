import { Profile, PublicENS, RecordItem, TransactionDisplayItem } from '@app/types'
import { recordItemToKeyValue } from '@app/utils/editor'
import { RecordOptions } from '@ensdomains/ensjs/dist/cjs/utils/recordHelpers'
import type { JsonRpcSigner } from '@ethersproject/providers'
import { contentHashToString } from '../../utils/contenthash'

type Data = {
  name: string
  records?: RecordOptions
}

const displayItems = ({ name }: Data): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
]

export const syncRecords = (
  before?: RecordItem[],
  after?: RecordItem[],
  overwrites?: { key: string; value: string }[],
) => {
  return Object.values(
    [
      ...(before ? before.map(recordItemToKeyValue).map(({ key }) => ({ key, value: '' })) : []),
      ...(after ? after.map(recordItemToKeyValue) : []),
      ...(overwrites || []),
    ].reduce<{
      [key: string]: { key: string; value: string }
    }>((acc, text) => {
      const key = text.key as string
      const value = text.value as string
      acc[key] = { key, value }
      return acc
    }, {}),
  )
}

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const profile = await ens.getProfile(data.name)
  if (!profile) throw new Error('No profile found')
  if (!profile.records) throw new Error('No records found')
  const resolverAddress = (await ens.contracts!.getPublicResolver()!).address

  let resolverProfile: Profile | undefined
  if (profile.resolverAddress !== resolverAddress) {
    resolverProfile = await ens.getProfile(data.name, { resolverAddress })
  }

  console.log('resolverProfile', resolverProfile)

  const contentHash = (() => {
    if (data.records?.contentHash || data.records?.contentHash === '')
      return contentHashToString(data.records.contentHash)
    if (profile.records.contentHash || profile.records.contentHash === '')
      return contentHashToString(profile.records.contentHash)
    return undefined
  })()

  const texts = syncRecords(
    resolverProfile?.records?.texts,
    profile?.records?.texts,
    data.records?.texts,
  )
  const coinTypes = syncRecords(
    resolverProfile?.records?.coinTypes,
    profile?.records?.coinTypes,
    data.records?.coinTypes,
  )

  const migratableProfile = {
    contentHash,
    texts,
    coinTypes,
  }

  console.log(migratableProfile)

  return ens.setRecords.populateTransaction(data.name, {
    records: migratableProfile,
    resolverAddress,
    signer,
  })
}

export default { displayItems, transaction }
