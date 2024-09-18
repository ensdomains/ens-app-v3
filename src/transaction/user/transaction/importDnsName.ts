import type { TFunction } from 'react-i18next'

import { importDnsName, ImportDnsNameDataParameters } from '@ensdomains/ensjs/dns'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = Omit<ImportDnsNameDataParameters, 'address' | 'resolverAddress'>

const displayItems = (
  { name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'action',
    value: t('transaction.description.importDnsName'),
  },
]

const transaction = ({ connectorClient, data }: TransactionFunctionParameters<Data>) =>
  importDnsName.makeFunctionData(connectorClient, data)

export default {
  displayItems,
  transaction,
} satisfies Transaction<Data>
