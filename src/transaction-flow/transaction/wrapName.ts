import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'

type Data = {
  name: string
  owner?: string
}

const displayItems = (
  { name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'action',
    value: t(`transaction.description.wrapName`),
  },
  {
    label: 'info',
    value: t(`transaction.info.wrapName`),
  },
  {
    label: 'name',
    value: name,
    type: 'name',
  },
]

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const wrappedOwner = data.owner || (await signer.getAddress())
  return ens.wrapName.populateTransaction(data.name, {
    wrappedOwner,
    signer,
  })
}
export default { displayItems, transaction } as Transaction<Data>
