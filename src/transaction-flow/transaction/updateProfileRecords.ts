import type { JsonRpcSigner } from '@ethersproject/providers'
import { TFunction } from 'i18next'

import {
  getProfileRecordsDiff,
  profileRecordsToRecordOptions,
} from '@app/components/pages/profile/[name]/registration/steps/Profile/profileRecordUtils'
import { ProfileRecord } from '@app/constants/profileRecordOptions'
import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'
import { recordOptionsToToupleList } from '@app/utils/records'

type Data = {
  name: string
  resolver: string
  records: ProfileRecord[]
  previousRecords?: ProfileRecord[]
  clearRecords: boolean
}

const displayItems = (
  { name, records, previousRecords = [], clearRecords }: Data,
  t: TFunction,
): TransactionDisplayItem[] => {
  const submitRecords = getProfileRecordsDiff(records, previousRecords)
  const recordOptions = profileRecordsToRecordOptions(submitRecords, clearRecords)

  const action = clearRecords
    ? {
        label: 'action',
        value: t('transaction.description.clearRecords'),
      }
    : {
        label: 'action',
        value: t('transaction.description.updateRecords'),
      }

  const recordsList = recordOptionsToToupleList(
    recordOptions,
    t('action.delete', { ns: 'common' }).toLocaleLowerCase(),
  )

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

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const { name, records, previousRecords = [], clearRecords } = data
  const submitRecords = getProfileRecordsDiff(records, previousRecords)
  const recordOptions = profileRecordsToRecordOptions(submitRecords, clearRecords)

  return ens.setRecords.populateTransaction(name, {
    records: recordOptions,
    resolverAddress: data.resolver,
    signer,
  })
}
export default {
  displayItems,
  transaction,
  backToInput: true,
} as Transaction<Data>
