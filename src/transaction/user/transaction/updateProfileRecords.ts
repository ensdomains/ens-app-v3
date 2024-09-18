import type { TFunction } from 'i18next'
import { Address } from 'viem'

import { setRecords } from '@ensdomains/ensjs/wallet'

import {
  getProfileRecordsDiff,
  profileRecordsToRecordOptions,
  profileRecordsToRecordOptionsWithDeleteAbiArray,
} from '@app/components/pages/profile/[name]/registration/steps/Profile/profileRecordUtils'
import { ProfileRecord } from '@app/constants/profileRecordOptions'
import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { recordOptionsToToupleList } from '@app/utils/records'

type Data = {
  name: string
  resolverAddress: Address
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
        value: t('transaction.description.updateProfile'),
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

const transaction = async ({
  client,
  connectorClient,
  data,
}: TransactionFunctionParameters<Data>) => {
  const { name, resolverAddress, records, previousRecords = [], clearRecords } = data
  const submitRecords = getProfileRecordsDiff(records, previousRecords)
  const recordOptions = await profileRecordsToRecordOptionsWithDeleteAbiArray(client, {
    name,
    profileRecords: submitRecords,
    clearRecords,
  })
  return setRecords.makeFunctionData(connectorClient, {
    name,
    resolverAddress,
    ...recordOptions,
  })
}
export default {
  displayItems,
  transaction,
  backToInput: true,
} satisfies Transaction<Data>
