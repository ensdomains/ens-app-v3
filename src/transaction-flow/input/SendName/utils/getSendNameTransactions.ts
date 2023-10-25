import { Address } from 'viem'

import type { useAbilities } from '@app/hooks/abilities/useAbilities'
import { makeTransactionItem } from '@app/transaction-flow/transaction'

import type { SendNameForm } from '../SendName-flow'

export const getSendNameTransactions = ({
  name,
  recipient,
  transactions,
  abilities,
  isOwnerOrManager,
  resolverAddress,
}: {
  name: string
  recipient: SendNameForm['recipient']
  transactions: SendNameForm['transactions']
  abilities: ReturnType<typeof useAbilities>['data']
  isOwnerOrManager: boolean
  resolverAddress: Address
}) => {
  if (!recipient) return []

  const setEthRecordOnly = transactions.setEthRecord && !transactions.resetProfile
  // Anytime you reset the profile you will need to set the eth record as well
  const setEthRecordAndResetProfile = transactions.resetProfile

  const _transactions = [
    setEthRecordOnly ? makeTransactionItem('updateEthAddress', { name, address: recipient }) : null,
    setEthRecordAndResetProfile
      ? makeTransactionItem('resetProfileWithRecords', {
          name,
          records: {
            coinTypes: [{ key: 'ETH', value: recipient }],
          },
          resolver: resolverAddress,
        })
      : null,

    transactions.sendManager && !!abilities?.sendNameFunctionCallDetails?.sendManager
      ? makeTransactionItem(isOwnerOrManager ? 'transferName' : 'transferSubname', {
          name,
          newOwnerAddress: recipient,
          sendType: 'sendManager',
          contract: abilities?.sendNameFunctionCallDetails?.sendManager?.contract,
          reclaim: abilities?.sendNameFunctionCallDetails?.sendManager?.method === 'reclaim',
        } as any) // TODO: need to get the Data and transaction values in sync
      : null,
    transactions.sendOwner && !!abilities?.sendNameFunctionCallDetails?.sendOwner
      ? makeTransactionItem(isOwnerOrManager ? 'transferName' : 'transferSubname', {
          name,
          newOwnerAddress: recipient,
          sendType: 'sendOwner',
          contract: abilities?.sendNameFunctionCallDetails?.sendOwner?.contract,
        })
      : null,
  ].filter((transaction) => !!transaction)

  return _transactions
}
