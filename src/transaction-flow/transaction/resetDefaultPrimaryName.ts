import type { TFunction } from 'react-i18next'
import { Address, encodeFunctionData } from 'viem'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = {
  address: Address
}

const defaultReverseRegistrarSetNameSnippet = [
  {
    inputs: [
      {
        name: 'name',
        type: 'string',
      },
    ],
    name: 'setName',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

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
    value: t(`transaction.description.resetDefaultPrimaryName`),
  },
]

const transaction = async ({ client }: TransactionFunctionParameters<Data>) => {
  return {
    to: getChainContractAddress({
      client,
      contract: 'ensDefaultReverseRegistrar',
    }),
    data: encodeFunctionData({
      abi: defaultReverseRegistrarSetNameSnippet,
      functionName: 'setName',
      args: [''],
    }),
  }
}

export default { displayItems, transaction } satisfies Transaction<Data>
