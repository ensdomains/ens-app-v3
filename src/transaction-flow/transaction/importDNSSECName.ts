import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'

type Data = {
  name: string
  address?: string
  proverResult: any
}

const displayItems = (
  { name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'dnsname',
    value: name,
    type: 'name',
  },
  {
    label: 'action',
    value: t('Import DNSSEC Name'),
  },
]

const transaction = (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const tx = ens.importDNSSECName.populateTransaction(data.name, {
    address: data.address,
    proverResult: data.proverResult,
    signer,
  })
  return tx
}

export default {
  displayItems,
  transaction,
} as Transaction<Data>
