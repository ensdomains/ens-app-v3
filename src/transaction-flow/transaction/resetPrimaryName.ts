import type { TFunction } from 'react-i18next'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { setPrimaryName } from '@ensdomains/ensjs/wallet'
import { Address } from 'viem'

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

const transaction = async ({ walletClient }: TransactionFunctionParameters<Data>) =>
  setPrimaryName.makeFunctionData(walletClient, { name: '' })

export default { displayItems, transaction } satisfies Transaction<Data>
