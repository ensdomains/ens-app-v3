import type { TFunction } from 'react-i18next'
import { Address, encodeFunctionData } from 'viem'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'

import { getSnrcAddresses } from '@app/constants/chains'
import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = { parent: string }

const displayItems = (
  { parent }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: parent,
    type: 'name',
  },
  {
    label: 'action',
    value: t('transaction.description.approveSubnameRegistrar'),
  },
  {
    label: 'info',
    value: t('transaction.info.approveSubnameRegistrar'),
  },
]

const registrySetApprovalForAllSnippet = [
  {
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

// Grants the SubnameRegistrar a registry-wide operator approval so it can create
// subnodes on the caller's behalf. The registrar is immutable and its only
// registry write is `setSubnodeOwner(parent, labelhash, parentOwner)` gated on
// `owner(parent) == msg.sender`, so this approval is safe (see docs/security.md L1).
const transaction = async ({ client }: TransactionFunctionParameters<Data>) => {
  const subnameRegistrar = getSnrcAddresses(client.chain.id).SubnameRegistrar as Address
  return {
    to: getChainContractAddress({ client, contract: 'ensRegistry' }),
    data: encodeFunctionData({
      abi: registrySetApprovalForAllSnippet,
      functionName: 'setApprovalForAll',
      args: [subnameRegistrar, true],
    }),
  }
}

export default { displayItems, transaction } satisfies Transaction<Data>
