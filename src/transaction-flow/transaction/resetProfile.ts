import type { JsonRpcSigner } from '@ethersproject/providers'
import { TFunction } from 'i18next'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'

type Data = {
  name: string
  resolver: string
}

const displayItems = ({ name, resolver }: Data, t: TFunction): TransactionDisplayItem[] => {
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
      value: resolver,
    },
  ]
}

const transaction = (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  return ens.setRecords.populateTransaction(data.name, {
    records: {
      clearRecords: true,
    },
    resolverAddress: data.resolver,
    signer,
  })
}

export default {
  displayItems,
  transaction,
} as Transaction<Data>
