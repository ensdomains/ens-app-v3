import type { JsonRpcSigner } from '@ethersproject/providers'

import { PublicENS, TransactionDisplayItem } from '@app/types'

type Data = {
  name: string
  address: string
}

const displayItems = ({ address, name }: Data): TransactionDisplayItem[] => [
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

export default { displayItems, transaction }
