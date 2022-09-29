import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'

type Data = {
  name: string
  newOwner: string
}

const displayItems = (
  { name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'action',
    value: 'Transfer controller' as string,
  },
]

const transaction = (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const tx = ens.transferController.populateTransaction(data.name, {
    newOwner: data.newOwner,
    signer,
  })
  return tx
}

export default {
  displayItems,
  transaction,
  backToInput: true,
} as Transaction<Data>
