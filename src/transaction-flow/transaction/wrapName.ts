import type { TFunction } from 'react-i18next'

import { wrapName } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = {
  name: string
}

const displayItems = (
  { name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'action',
    value: t(`transaction.description.wrapName`),
  },
  {
    label: 'info',
    value: t(`transaction.info.wrapName`),
  },
  {
    label: 'name',
    value: name,
    type: 'name',
  },
]

const transaction = async ({ walletClient, data }: TransactionFunctionParameters<Data>) => {
  return wrapName.makeFunctionData(walletClient, {
    name: data.name,
    newOwnerAddress: walletClient.account.address,
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
