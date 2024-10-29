import { TFunction } from 'react-i18next'
import { Address } from 'viem/accounts'
import { encodeFunctionData } from 'viem/utils'

import {
  getChainContractAddress,
  registrySetApprovalForAllSnippet,
} from '@ensdomains/ensjs/contracts'

import { migrationHelperContract } from '@app/migration/migrationHelper'
import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

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
    value: t('transaction.description.approveEthRegistrar'),
  },
  {
    label: 'info',
    value: t('transaction.info.approveEthRegistrar'),
  },
]

const transaction = async ({ client }: TransactionFunctionParameters<Data>) => {
  return {
    to: getChainContractAddress({
      client,
      contract: 'ensBaseRegistrarImplementation',
    }),
    data: encodeFunctionData({
      abi: registrySetApprovalForAllSnippet,
      functionName: 'setApprovalForAll',
      args: [migrationHelperContract[client.chain.id], true],
    }),
  }
}

export default { displayItems, transaction } satisfies Transaction<Data>
