import type { JsonRpcSigner } from '@ethersproject/providers'

import { PublicENS, TransactionDisplayItem } from '@app/types'

type Data = {
  parent: string
  label: string
  contract: 'nameWrapper' | 'registry'
}

const displayItems = ({ parent, label }: Data): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: parent,
    type: 'name',
  },
  {
    label: 'subname',
    value: `${label}.${parent}`,
    type: 'name',
  },
]

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) =>
  ens.createSubname.populateTransaction(`${data.label}.${data.parent}`, {
    signer,
    owner: await signer.getAddress(),
    contract: data.contract,
  })

export default { displayItems, transaction }
