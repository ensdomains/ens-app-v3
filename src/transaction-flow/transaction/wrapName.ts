import { PublicENS, TransactionDisplayItem, Transaction } from '@app/types'
import type { JsonRpcSigner } from '@ethersproject/providers'

type Data = {
  name: string
}

const displayItems = ({ name }: Data): TransactionDisplayItem<'name'>[] => [
  {
    label: 'action',
    value: `transaction.description.wrapName`,
  },
  {
    label: 'info',
    value: `transaction.info.wrapName`,
  },
  {
    label: 'name',
    value: name,
    type: 'name',
  },
]

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) =>
  ens.wrapName.populateTransaction(data.name, { wrappedOwner: await signer.getAddress(), signer })

const exports: Transaction<Data> = { displayItems, transaction }

export default exports
