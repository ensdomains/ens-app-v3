import type { TFunction } from 'react-i18next'
import { Address, encodeFunctionData } from 'viem'

import {
  getChainContractAddress,
  registrySetApprovalForAllSnippet,
} from '@ensdomains/ensjs/contracts'

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
    value: t('transaction.description.approveNameWrapper'),
  },
  {
    label: 'info',
    value: t('transaction.info.approveNameWrapper'),
  },
]

const transaction = async ({ client }: TransactionFunctionParameters<Data>) => {
  return {
    to: getChainContractAddress({
      client,
      contract: 'ensNameWrapper',
    }),
    data: encodeFunctionData({
      abi: registrySetApprovalForAllSnippet,
      functionName: 'setApprovalForAll',
      args: [
        getChainContractAddress({
          client,
          contract: 'contract-address-will-go-here',
        }),
        true,
      ],
    }),
  }
}

export default { displayItems, transaction } satisfies Transaction<Data>
