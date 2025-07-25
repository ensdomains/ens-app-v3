import type { TFunction } from 'react-i18next'

import { renewNames } from '@ensdomains/ensjs/wallet'

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
    value: t(`transaction.description.repairDesyncedName`),
  },
  {
    label: 'info',
    value: t(`transaction.info.repairDesyncedName`),
  },
  {
    label: 'name',
    value: name,
    type: 'name',
  },
]

const transaction = async ({ connectorClient, data }: TransactionFunctionParameters<Data>) => {
  return renewNames.makeFunctionData(connectorClient, {
    nameOrNames: data.name,
    duration: 0,
    value: 0n,
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
