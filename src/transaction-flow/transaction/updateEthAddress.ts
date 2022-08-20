import { PublicENS, TransactionDisplayItem, Transaction } from '@app/types'
import type { JsonRpcSigner } from '@ethersproject/providers'

type Data = {
  name: string
  address: string
}

const displayItems = ({ name, address }: Data): TransactionDisplayItem<'name' | 'address'>[] => [
  {
    label: 'action',
    value: `transaction.description.updateEthAddress`,
  },
  {
    label: 'info',
    value: `transaction.info.updateEthAddress`,
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
  ens.setRecord.populateTransaction(data.name, {
    signer,
    record: { key: 'ETH', value: data.address },
    type: 'addr',
  })

const exports = { displayItems, transaction } as Transaction<Data>

export default exports
