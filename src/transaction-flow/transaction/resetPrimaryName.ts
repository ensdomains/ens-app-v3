import type { TFunction } from 'react-i18next'
import { Address } from 'viem'

import { setPrimaryName } from '@ensdomains/ensjs/wallet'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = {
  address: Address
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

const transaction = async ({ connectorClient }: TransactionFunctionParameters<Data>) =>
  setPrimaryName.makeFunctionData(connectorClient, { name: '' })

export default { displayItems, transaction } satisfies Transaction<Data>
