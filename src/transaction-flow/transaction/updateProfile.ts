import type { TFunction } from 'i18next'
import type { Address } from 'viem'

import type { RecordOptions } from '@ensdomains/ensjs/utils'
import { setRecords } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { bustAvatarCache, bustHeaderCache } from '@app/utils/bustMetadataCache'

import { recordOptionsToToupleList, recordsWithCointypeCoins } from '../../utils/records'

type Data = {
  name: string
  resolverAddress: Address
  records: RecordOptions
}

const displayItems = ({ name, records }: Data, t: TFunction): TransactionDisplayItem[] => {
  const action = records.clearRecords
    ? {
        label: 'action',
        value: t('transaction.description.clearRecords'),
      }
    : {
        label: 'action',
        value: t('transaction.description.updateRecords'),
      }

  const recordsList = recordOptionsToToupleList(records)

  /* eslint-disable no-nested-ternary */
  const recordsItem =
    recordsList.length > 3
      ? [
          {
            label: 'update',
            value: t('transaction.itemValue.records', { count: recordsList.length }),
          } as TransactionDisplayItem,
        ]
      : recordsList.length > 0
      ? [
          {
            label: 'update',
            value: recordsList,
            type: 'records',
          } as TransactionDisplayItem,
        ]
      : []
  /* eslint-enable no-nested-ternary */

  return [
    {
      label: 'name',
      value: name,
      type: 'name',
    },
    action,
    ...recordsItem,
  ]
}

const transaction = ({ client, connectorClient, data }: TransactionFunctionParameters<Data>) => {
  const { name, records } = data

  // Check if avatar or header are being modified in texts array
  const hasAvatarChange = records.texts?.some((t) => t.key === 'avatar')
  const hasHeaderChange = records.texts?.some((t) => t.key === 'header')

  // Bust cache for modified media records
  if (hasAvatarChange) bustAvatarCache(name, client)
  if (hasHeaderChange) bustHeaderCache(name, client)

  return setRecords.makeFunctionData(connectorClient, {
    name: data.name,
    resolverAddress: data.resolverAddress,
    ...recordsWithCointypeCoins(data.records),
  })
}
export default {
  displayItems,
  transaction,
  backToInput: true,
} satisfies Transaction<Data>
