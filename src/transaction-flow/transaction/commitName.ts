import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { BaseRegistrationParams } from '@ensdomains/ensjs/utils/registerHelpers'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'

type Data = BaseRegistrationParams & { name: string }

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
      value: t('transaction.description.commitName'),
    },
    {
      label: 'info',
      value: t('transaction.info.commitName'),
    },
  ]

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const { customData: _, ...tx } = await ens.commitName.populateTransaction(data.name, {
    signer,
    ...data,
  })
  return tx
}

export default { displayItems, transaction } as Transaction<Data>
