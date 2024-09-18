import type { TFunction } from 'react-i18next'
import type { Address } from 'viem'

import { transferName } from '@ensdomains/ensjs/wallet'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = {
  name: string
  newOwnerAddress: Address
  isOwner: boolean
}

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
    value: t('details.sendName.transferController', { ns: 'profile' }),
  },
]

const transaction = ({ connectorClient, data }: TransactionFunctionParameters<Data>) => {
  return transferName.makeFunctionData(connectorClient, {
    name: data.name,
    contract: 'registry',
    newOwnerAddress: data.newOwnerAddress,
    asParent: !data.isOwner,
  })
}

export default {
  displayItems,
  transaction,
  backToInput: true,
} satisfies Transaction<Data>
