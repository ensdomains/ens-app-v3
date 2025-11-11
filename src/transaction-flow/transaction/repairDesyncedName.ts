import type { TFunction } from 'react-i18next'
import type { Hex } from 'viem'

import renewNames from '@app/overrides/ensjs/renewNames'
import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = {
  name: string
  referrer?: Hex
  hasWrapped?: boolean
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
    referrer: data.referrer,
    hasWrapped: data.hasWrapped ?? false,
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
