import { TFunction } from 'i18next'
import { match, P } from 'ts-pattern'
import type { Address } from 'viem'

import { RecordOptions } from '@ensdomains/ensjs/utils'
import { setRecords } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { recordOptionsToToupleList } from '@app/utils/records'

type Data = {
  name: string
  resolverAddress: Address
  records: RecordOptions
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

const transaction = ({ connectorClient, data }: TransactionFunctionParameters<Data>) => {
  return setRecords.makeFunctionData(connectorClient, {
    name: data.name,
    ...data.records,
    clearRecords: true,
    resolverAddress: data.resolverAddress,
  })
}

export default {
  displayItems,
  transaction,
} as Transaction<Data>
