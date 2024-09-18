import type { TFunction } from 'react-i18next'

import { RegistrationParameters } from '@ensdomains/ensjs/utils'
import { commitName } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = RegistrationParameters & { name: string }

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

const transaction = async ({ connectorClient, data }: TransactionFunctionParameters<Data>) => {
  return commitName.makeFunctionData(connectorClient, data)
}

export default { displayItems, transaction } satisfies Transaction<Data>
