import type { TFunction } from 'i18next'

import type { RecordOptions } from '@ensdomains/ensjs/utils'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

import { setRecords } from '@ensdomains/ensjs/wallet'
import type { Address } from 'viem'
import { recordOptionsToToupleList } from '../../utils/records'

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

const transaction = ({ walletClient, data }: TransactionFunctionParameters<Data>) => {
  return setRecords.makeFunctionData(walletClient, {
    name: data.name,
    resolverAddress: data.resolverAddress,
    ...data.records,
  })
}
export default {
  displayItems,
  transaction,
  backToInput: true,
} satisfies Transaction<Data>
