import type { JsonRpcSigner } from '@ethersproject/providers'
import { PublicENS } from '../types'

type Data = {
  name: string
}

const displayItems = ({ name }: Data) => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
]

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) =>
  ens.wrapName.populateTransaction(data.name, { wrappedOwner: await signer.getAddress(), signer })

export default { displayItems, transaction }
