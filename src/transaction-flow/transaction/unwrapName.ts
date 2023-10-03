import type { TFunction } from 'react-i18next'

import { unwrapName } from '@ensdomains/ensjs/wallet'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { checkETH2LDFromName } from '@app/utils/utils'

type Data = {
  name: string
}

const displayItems = (
  { name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'action',
    value: t(`transaction.description.unwrapName`),
  },
  {
    label: 'name',
    value: name,
    type: 'name',
  },
]

const transaction = async ({ walletClient, data }: TransactionFunctionParameters<Data>) => {
  const { address } = walletClient.account

  if (checkETH2LDFromName(data.name))
    return unwrapName.makeFunctionData(walletClient, {
      name: data.name,
      newOwnerAddress: address,
      newRegistrantAddress: address,
    })
  return unwrapName.makeFunctionData(walletClient, {
    name: data.name,
    newOwnerAddress: address,
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
