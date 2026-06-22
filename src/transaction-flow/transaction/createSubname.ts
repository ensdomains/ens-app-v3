import type { TFunction } from 'react-i18next'
import { Address, encodeFunctionData, namehash } from 'viem'

import { getSnrcAddresses } from '@app/constants/chains'
import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = {
  parent: string
  label: string
}

const displayItems = (
  { parent, label }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: parent,
    type: 'name',
  },
  {
    label: 'action',
    value: t(`transaction.description.createSubname`),
  },
  {
    label: 'subname',
    value: `${label}.${parent}`,
    type: 'name',
  },
]

// SNRC subnames are plain registry subnodes created + indexed on-chain by the
// SubnameRegistrar (wrapper-free). It forces the subname owner to the parent
// owner (= msg.sender), so no owner argument is passed; the caller must have
// approved the registrar (see approveSubnameRegistrar).
const createSubnameSnippet = [
  {
    inputs: [
      { name: 'parentNode', type: 'bytes32' },
      { name: 'label', type: 'string' },
    ],
    name: 'createSubname',
    outputs: [{ name: 'node', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

const transaction = async ({ client, data }: TransactionFunctionParameters<Data>) => {
  const subnameRegistrar = getSnrcAddresses(client.chain.id).SubnameRegistrar as Address
  return {
    to: subnameRegistrar,
    data: encodeFunctionData({
      abi: createSubnameSnippet,
      functionName: 'createSubname',
      args: [namehash(data.parent), data.label],
    }),
  }
}

export default {
  displayItems,
  transaction,
} satisfies Transaction<Data>
