import { PublicENS, TransactionDisplayItem } from '@app/types'
import type { JsonRpcSigner } from '@ethersproject/providers'

type Data = {
  name: string
  address: string
}

const displayItems = ({ name, address }: Data): TransactionDisplayItem[] => [
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

export default { displayItems, transaction }
