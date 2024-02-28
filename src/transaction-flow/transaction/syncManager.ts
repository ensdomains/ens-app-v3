import type { TFunction } from 'react-i18next'
import { Address } from 'viem'

import { GetDnsImportDataReturnType, importDnsName } from '@ensdomains/ensjs/dns'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = {
  name: string
  address: Address
  dnsImportData: GetDnsImportDataReturnType
}

const displayItems = (
  { name, address }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'action',
    value: t('transaction.description.syncManager'),
  },
  {
    label: 'address',
    value: address,
    type: 'address',
  },
]

const transaction = ({ connectorClient, data }: TransactionFunctionParameters<Data>) => {
  return importDnsName.makeFunctionData(connectorClient, data)
}

export default {
  displayItems,
  transaction,
} satisfies Transaction<Data>
