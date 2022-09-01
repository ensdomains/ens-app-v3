import type { JsonRpcSigner } from '@ethersproject/providers'

import { RecordOptions } from '@ensdomains/ensjs/dist/cjs/utils/recordHelpers'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'

type Data = {
  name: string
  resolver: string
  records: RecordOptions
}

const displayItems = ({ name }: Data): TransactionDisplayItem<'name'>[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
]

const transaction = (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  return ens.setRecords.populateTransaction(data.name, {
    records: data.records,
    resolverAddress: data.resolver,
    signer,
  })
}
export default {
  displayItems,
  transaction,
} as Transaction<Data>
