import type { TFunction } from 'react-i18next'
import type { Address } from 'viem'

import { setPrimaryName } from '@ensdomains/ensjs/wallet'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = {
  name: string
  address: Address
}

const displayItems = (
  { address, name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'info',
    value: t(`transaction.info.setPrimaryName`),
  },
  {
    label: 'address',
    value: address,
    type: 'address',
  },
]

const transaction = async ({ connectorClient, data }: TransactionFunctionParameters<Data>) => {
  return setPrimaryName.makeFunctionData(connectorClient, { name: data.name })
}

export default { displayItems, transaction } satisfies Transaction<Data>
