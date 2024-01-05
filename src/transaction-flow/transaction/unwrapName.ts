import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'
import { checkETH2LDFromName } from '@app/utils/utils'

type Data = {
  name: string
}

const displayItems = (
  { name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'action',
    value: t(`transaction.description.unwrapName`),
  },
  {
    label: 'name',
    value: name,
    type: 'name',
  },
]

// Returns a populated transaction
const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const address = await signer.getAddress()

  return ens.unwrapName.populateTransaction(data.name, {
    newController: address,
    newRegistrant: checkETH2LDFromName(data.name) ? address : undefined,
    signer,
  })
}

export default { displayItems, transaction } as Transaction<Data>
