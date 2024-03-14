import type { TFunction } from 'react-i18next'
import { Address, encodeFunctionData } from 'viem'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'

import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = { address: Address }

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
    value: t('transaction.description.approveDnsRegistrar'),
  },
]

const publicResolverSetApprovalForAllSnippet = [
  {
    constant: false,
    inputs: [
      {
        name: 'operator',
        type: 'address',
      },
      {
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

const transaction = async ({ client }: TransactionFunctionParameters<Data>) => {
  return {
    to: getChainContractAddress({
      client,
      contract: 'ensPublicResolver',
    }),
    data: encodeFunctionData({
      abi: publicResolverSetApprovalForAllSnippet,
      functionName: 'setApprovalForAll',
      args: [
        getChainContractAddress({
          client,
          contract: 'ensDnsRegistrar',
        }),
        true,
      ],
    }),
  }
}

export default { displayItems, transaction } satisfies Transaction<Data>
