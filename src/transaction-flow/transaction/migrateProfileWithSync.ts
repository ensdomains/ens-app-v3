import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import type { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import { Profile, PublicENS, RecordItem, Transaction, TransactionDisplayItem } from '@app/types'
import { recordItemToKeyValue } from '@app/utils/editor'
import { recordOptionsToToupleList } from '@app/utils/records'

type Data = {
  name: string
  records?: RecordOptions
}

const displayItems = ({ name, records }: Data, t: TFunction): TransactionDisplayItem[] => {
  const recordsList = recordOptionsToToupleList(records)

  const actionItem =
    recordsList.length > 0
      ? {
          label: 'action',
          value: t('transaction.description.migrateProfileWithSync'),
        }
      : {
          label: 'action',
          value: t('transaction.description.migrateProfile'),
        }

  /* eslint-disable no-nested-ternary */
  const recordsItem =
    recordsList.length > 3
      ? ({
          label: 'update',
          value: t('transaction.itemValue.records', { count: recordsList.length }),
        } as TransactionDisplayItem)
      : recordsList.length > 0
      ? ({
          label: 'update',
          value: recordsList,
          type: 'records',
        } as TransactionDisplayItem)
      : {
          label: 'info',
          value: t(`transaction.info.migrateProfile`),
        }
  /* eslint-enable no-nested-ternary */

  return [
    {
      label: 'name',
      value: name,
      type: 'name',
    },
    actionItem,
    recordsItem,
  ]
}

// Returns the an array of record items where deleted records have value set to empty string.
export const syncRecords = (
  before?: RecordItem[],
  after?: RecordItem[],
  overwrites?: { key: string; value: string }[],
) => {
  const beforeArr = before ? before.map(recordItemToKeyValue) : []
  const beforeHash =
    beforeArr.reduce<{ [key: string]: string }>((hash, item) => {
      const key = item.key as string
      const value = item.value as string
      const newHash = { ...hash, [key]: value }
      return newHash
    }, {}) || {}

  return Object.values(
    [
      ...beforeArr.map(({ key }) => ({ key, value: '' })),
      ...(after ? after.map(recordItemToKeyValue) : []),
      ...(overwrites || []),
    ].reduce<{
      [key: string]: { key: string; value: string }
    }>((acc, text) => {
      const key = text.key as string
      const value = text.value as string
      if (beforeHash[key] === value) {
        delete acc[key]
      } else {
        acc[key] = { key, value }
      }
      return acc
    }, {}),
  )
}

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  // dynamic import for large dependency
  const contentHashToString = await import('../../utils/contenthash').then(
    (m) => m.contentHashToString,
  )

  const profile = await ens.getProfile(data.name)
  if (!profile) throw new Error('No profile found')
  if (!profile.records) throw new Error('No records found')
  const resolverAddress = (await ens.contracts!.getPublicResolver()!).address

  let resolverProfile: Profile | undefined
  if (profile.resolverAddress !== resolverAddress) {
    resolverProfile = await ens.getProfile(data.name, {
      resolverAddress,
    })
  }

  const contentHash = data.records?.contentHash
    ? contentHashToString(data.records.contentHash)
    : contentHashToString(profile.records.contentHash)

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

  return ens.setRecords.populateTransaction(data.name, {
    records: migratableProfile,
    resolverAddress,
    signer,
  })
}

export default { displayItems, transaction } as Transaction<Data>
