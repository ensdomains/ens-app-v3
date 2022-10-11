import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'

type Data = {
  parent: string
  label: string
  contract: 'nameWrapper' | 'registry'
}

const displayItems = (
  { parent, label }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'action',
    value: t(`transaction.description.createSubname`),
  },
  {
    label: 'info',
    value: t(`transaction.info.createSubname`),
  },
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

export default {
  displayItems,
  transaction,
} as Transaction<Data>
