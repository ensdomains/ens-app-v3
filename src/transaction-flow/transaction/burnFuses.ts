import type { TFunction } from 'react-i18next'

import { EncodeChildFusesInputObject } from '@ensdomains/ensjs/utils'
import { setFuses } from '@ensdomains/ensjs/wallet'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = {
  name: string
  permissions: string[]
  selectedFuses: NonNullable<EncodeChildFusesInputObject['named']>
}

const displayItems = (
  { name, permissions }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'action',
    value: t('transaction.description.burnFuses') as string,
  },
  {
    label: 'info',
    value: ['Permissions to be burned:', ...permissions],
    type: 'list',
  },
]

const transaction = ({ connectorClient, data }: TransactionFunctionParameters<Data>) => {
  return setFuses.makeFunctionData(connectorClient, {
    name: data.name,
    fuses: {
      named: data.selectedFuses,
    },
  })
}

export default {
  displayItems,
  transaction,
  backToInput: true,
} satisfies Transaction<Data>
