import type { TFunction } from 'react-i18next'
import type { JsonRpcSigner } from '@ethersproject/providers'
import type { NamedFusesToBurn } from '@ensdomains/ensjs'

import { PublicENS, TransactionDisplayItem, Transaction } from '@app/types'

type Data = {
  name: string
  permissions: string[]
  selectedFuses: NamedFusesToBurn
}

const displayItems = (
  { name, permissions }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem<'name' | 'list'>[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'action',
    value: t('transaction.description.burnFuses') as string,
  },
  {
    label: 'info',
    value: ['Permissions to be burned:', ...permissions],
    type: 'list',
  },
]

const transaction = (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const tx = ens.burnFuses.populateTransaction(data.name, {
    namedFusesToBurn: data.selectedFuses,
    signer,
  })
  return tx
}

export default {
  displayItems,
  transaction,
  backToInput: true,
} as Transaction<Data>
