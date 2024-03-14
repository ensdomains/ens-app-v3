import type { TFunction } from 'i18next'
import type { Address } from 'viem'

import { clearRecords } from '@ensdomains/ensjs/wallet'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = {
  name: string
  resolverAddress: Address
}

const displayItems = ({ name, resolverAddress }: Data, t: TFunction): TransactionDisplayItem[] => {
  return [
    {
      label: 'name',
      value: name,
      type: 'name',
    },
    {
      label: 'action',
      value: t('transaction.description.clearRecords'),
    },
    {
      label: 'resolver',
      type: 'address',
      value: resolverAddress,
    },
  ]
}

const transaction = ({ connectorClient, data }: TransactionFunctionParameters<Data>) => {
  return clearRecords.makeFunctionData(connectorClient, data)
}

export default {
  displayItems,
  transaction,
} satisfies Transaction<Data>
