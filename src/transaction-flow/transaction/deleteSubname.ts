import type { TFunction } from 'react-i18next'
import { Address, encodeFunctionData, namehash } from 'viem'

import { getSnrcAddresses } from '@app/constants/chains'
import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = {
  name: string
  contract: 'nameWrapper' | 'registry'
  method?: 'setSubnodeOwner' | 'setRecord'
}

const displayItems = (
  { name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'subname',
    value: name,
    type: 'subname',
  },
  {
    label: 'action',
    value: t(`transaction.description.deleteSubname`),
  },
  {
    label: 'info',
    value: [t('action.delete'), name],
    type: 'list',
  },
]

// SNRC: subnames are owned by the SubnameRegistrar (soulbound to the 2LD NFT),
// so deletion goes through it (gated on the 2LD holder), not a raw registry
// write. The `contract`/`method` fields in Data are legacy and ignored.
const deleteSubnameSnippet = [
  {
    inputs: [
      { name: 'parentNode', type: 'bytes32' },
      { name: 'label', type: 'string' },
    ],
    name: 'deleteSubname',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

const transaction = async ({ client, data }: TransactionFunctionParameters<Data>) => {
  const subnameRegistrar = getSnrcAddresses(client.chain.id).SubnameRegistrar as Address
  const labels = data.name.split('.')
  const label = labels[0]
  const parent = labels.slice(1).join('.')
  return {
    to: subnameRegistrar,
    data: encodeFunctionData({
      abi: deleteSubnameSnippet,
      functionName: 'deleteSubname',
      args: [namehash(parent), label],
    }),
  }
}

export default {
  displayItems,
  transaction,
} satisfies Transaction<Data>
