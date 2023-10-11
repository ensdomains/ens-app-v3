import type { JsonRpcSigner } from '@ethersproject/providers'
import { TFunction } from 'i18next'
import { P, match } from 'ts-pattern'

import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'
import { recordOptionsToToupleList } from '@app/utils/records'

type Data = {
  name: string
  records: RecordOptions
  resolver: string
}

const displayItems = ({ name, records }: Data, t: TFunction): TransactionDisplayItem[] => {
  const recordsList = recordOptionsToToupleList(records)
  const recordsItem = match(recordsList.length)
    .with(
      P.when((length) => length > 3),
      (length) => [
        {
          label: 'update',
          value: t('transaction.itemValue.records', { count: length }),
        } as TransactionDisplayItem,
      ],
    )
    .with(
      P.when((length) => length > 0),
      () => [
        {
          label: 'records',
          value: recordsList,
          type: 'records',
        } as TransactionDisplayItem,
      ],
    )
    .otherwise(() => [])
  return [
    {
      label: 'name',
      value: name,
      type: 'name',
    },
    {
      label: 'action',
      value: t('transaction.description.resetProfileWithRecords'),
    },
    ...recordsItem,
  ]
}

const transaction = (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  return ens.setRecords.populateTransaction(data.name, {
    records: {
      ...data.records,
      clearRecords: true,
    },
    resolverAddress: data.resolver,
    signer,
  })
}

export default {
  displayItems,
  transaction,
} as Transaction<Data>
