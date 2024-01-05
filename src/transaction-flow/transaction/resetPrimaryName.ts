import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'

type Data = {
  address: string
}

const displayItems = (
  { address }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'address',
    value: address,
    type: 'address',
  },
  {
    label: 'action',
    value: t(`transaction.description.resetPrimaryName`),
  },
]

const transaction = async (signer: JsonRpcSigner, ens: PublicENS) =>
  ens.setName.populateTransaction('', { signer })

export default { displayItems, transaction } as Transaction<Data>
