import type { TFunction } from 'react-i18next'

import { GetDnsImportDataReturnType, importDnsName } from '@ensdomains/ensjs/dns'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { Address } from 'viem'

type Data = {
  name: string
  address: Address | undefined
  dnsImportData: GetDnsImportDataReturnType
}

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
    value: t('general.importDNSSECName', { ns: 'dnssec' }),
  },
]

const transaction = ({ walletClient, data }: TransactionFunctionParameters<Data>) => 
  importDnsName.makeFunctionData(walletClient, data)

export default {
  displayItems,
  transaction,
} satisfies Transaction<Data>
