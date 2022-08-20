import { PublicENS, TransactionDisplayItem, Transaction } from '@app/types'
import type { JsonRpcSigner } from '@ethersproject/providers'

type Data = {
  name: string
  address: string
}

const displayItems = ({ address, name }: Data): TransactionDisplayItem<'name' | 'address'>[] => [
  {
    label: 'action',
    value: `transaction.description.setPrimaryName`,
  },
  {
    label: 'info',
    value: `transaction.info.setPrimaryName`,
  },
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'address',
    value: address,
    type: 'address',
  },
]

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) =>
  ens.setName.populateTransaction(data.name, { signer })

const exports = { displayItems, transaction } as Transaction<Data>

export default exports
