import type { TFunction } from 'i18next'
import type { Address } from 'viem'

import { clearRecords } from '@ensdomains/ensjs/wallet'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { bustMediaCache } from '@app/utils/metadataCache'

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

const transaction = ({ client, connectorClient, data }: TransactionFunctionParameters<Data>) => {
  const { name } = data

  // Bust cache for both avatar and header (resetting clears all records)
  bustMediaCache(name, client)

  return clearRecords.makeFunctionData(connectorClient, data)
}

export default {
  displayItems,
  transaction,
} satisfies Transaction<Data>
