import type { TFunction } from 'react-i18next'
import { Address } from 'viem'

import { setResolver } from '@ensdomains/ensjs/wallet'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { getReverseNode } from '@app/utils/reverse'

type Data = {
  address: Address
}

const displayItems = (
  { address }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'address',
    value: address,
    type: 'address',
  },
  {
    label: 'action',
    value: t(`transaction.description.resetPrimaryName`),
  },
]

const transaction = async ({ connectorClient, data }: TransactionFunctionParameters<Data>) => {
  return setResolver.makeFunctionData(connectorClient, {
    name: getReverseNode(data.address),
    contract: 'registry',
    resolverAddress: '0x0000000000000000000000000000000000000000',
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
