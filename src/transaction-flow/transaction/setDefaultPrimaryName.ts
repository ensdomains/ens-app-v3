import type { TFunction } from 'react-i18next'
import type { Address } from 'viem'
import { encodeFunctionData } from 'viem'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = {
  name: string
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
  { address, name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'info',
    value: t(`transaction.info.setDefaultPrimaryName`),
  },
  {
    label: 'address',
    value: address,
    type: 'address',
  },
]

const transaction = async ({ client, data }: TransactionFunctionParameters<Data>) => {
  return {
    to: getChainContractAddress({
      client,
      contract: 'ensDefaultReverseRegistrar',
    }),
    data: encodeFunctionData({
      abi: defaultReverseRegistrarSetNameSnippet,
      functionName: 'setName',
      args: [data.name],
    }),
  }
}

export default { displayItems, transaction } satisfies Transaction<Data>
