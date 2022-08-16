import { PublicENS, TransactionDisplayItem } from '@app/types'
import { RecordOptions } from '@ensdomains/ensjs/dist/cjs/utils/recordHelpers'
import type { JsonRpcSigner } from '@ethersproject/providers'

type Data = {
  name: string
  resolver: string
  records: RecordOptions
}

const displayItems = ({ name }: Data): TransactionDisplayItem[] => [
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
}
