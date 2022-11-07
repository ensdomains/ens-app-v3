import type { JsonRpcSigner } from '@ethersproject/providers'
import { TFunction } from 'i18next'

import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'

import { recordOptionsToToupleList } from '../../utils/records'

type Data = {
  name: string
  resolver: string
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

const transaction = (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  return ens.setRecords.populateTransaction(data.name, {
    records: data.records,
    resolverAddress: data.resolver,
    signer,
  })
}
export default {
  displayItems,
  transaction,
} as Transaction<Data>
