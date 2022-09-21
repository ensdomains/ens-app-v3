import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'

type Data = {
  name: string
  contract: 'nameWrapper' | 'registry'
}

const displayItems = (
  { name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'action',
    value: t(`transaction.description.deleteSubname`),
  },
  {
    label: 'info',
    value: t(`transaction.info.deleteSubname`),
  },
  {
    label: 'name',
    value: name,
    type: 'name',
  },
]

const helper = (_: Data, t: TFunction<'translation', undefined>) => {
  return {
    type: 'error',
    children: t('transaction.deleteSubname.helper', { ns: 'transactionFlow' }),
  }
}

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) =>
  ens.deleteSubname.populateTransaction(data.name, {
    signer,
    contract: data.contract,
  })

export default {
  displayItems,
  transaction,
  helper,
} as Transaction<Data>
