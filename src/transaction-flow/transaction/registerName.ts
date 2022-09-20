import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { BaseRegistrationParams } from '@ensdomains/ensjs/utils/registerHelpers'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'
import { secondsToYears } from '@app/utils/utils'

type Data = BaseRegistrationParams & { name: string }

const displayItems = (
  { name, duration }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'action',
    value: t('transaction.description.registerName'),
  },
  {
    label: 'duration',
    value: t(secondsToYears(duration) > 1 ? 'unit.years_other' : 'unit.years_one', {
      count: secondsToYears(duration),
    }),
  },
]

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const price = await ens.getPrice(data.name, data.duration)
  const value = price!.base.add(price!.premium)

  return ens.registerName.populateTransaction(data.name, {
    signer,
    ...data,
    value,
  })
}

export default { displayItems, transaction } as Transaction<Data>
