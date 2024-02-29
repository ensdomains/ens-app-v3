import type { TFunction } from 'react-i18next'
import type { Address } from 'viem'

import { transferName } from '@ensdomains/ensjs/wallet'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type RegistrarData = {
  contract: 'registrar'
  reclaim?: boolean
}

type OtherData = {
  contract: 'registry' | 'nameWrapper'
  reclaim?: never
}

export type Data = {
  name: string
  newOwnerAddress: Address
  contract: 'registry' | 'registrar' | 'nameWrapper'
  sendType: 'sendManager' | 'sendOwner'
  reclaim?: boolean
} & (RegistrarData | OtherData)

const displayItems = (
  { name, sendType, newOwnerAddress }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'action',
    value: t(`name.${sendType}`),
  },
  {
    label: 'to',
    type: 'address',
    value: newOwnerAddress,
  },
]

const transaction = ({ connectorClient, data }: TransactionFunctionParameters<Data>) => {
  return transferName.makeFunctionData(
    connectorClient,
    data.contract === 'registrar'
      ? data
      : {
          ...data,
          asParent: false,
        },
  )
}

export default {
  displayItems,
  transaction,
  backToInput: true,
} satisfies Transaction<Data>
