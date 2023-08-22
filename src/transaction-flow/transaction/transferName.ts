import type { TFunction } from 'react-i18next'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { transferName } from '@ensdomains/ensjs/wallet'
import type { Address } from 'viem'

type RegistrarData = {
  contract: 'registrar'
  reclaim?: boolean
}

type OtherData = {
  contract: 'registry' | 'nameWrapper'
  reclaim?: never
}

type Data = {
  name: string
  newOwnerAddress: Address
  contract: 'registry' | 'baseRegistrar' | 'nameWrapper'
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

const transaction = ({ walletClient, data }: TransactionFunctionParameters<Data>) => {
  return transferName.makeFunctionData(walletClient, {
    name: data.name,
    contract: data.contract,
    asParent: false,
    newOwnerAddress: data.newOwnerAddress,
    reclaim: data.reclaim,
  })
}

export default {
  displayItems,
  transaction,
  backToInput: true,
} satisfies Transaction<Data>
