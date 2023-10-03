import type { TFunction } from 'react-i18next'
import type { Address } from 'viem'

import { transferName } from '@ensdomains/ensjs/wallet'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = {
  name: string
  contract: 'registry' | 'nameWrapper'
  newOwnerAddress: Address
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
    value: t('details.sendName.transferSubname', { ns: 'profile' }),
  },
]

const transaction = ({ walletClient, data }: TransactionFunctionParameters<Data>) => {
  return transferName.makeFunctionData(walletClient, {
    ...data,
    asParent: true,
  })
}

export default {
  displayItems,
  transaction,
  backToInput: true,
} satisfies Transaction<Data>
