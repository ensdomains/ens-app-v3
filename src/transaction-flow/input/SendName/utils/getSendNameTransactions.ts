import { Address } from 'viem'

import type { useAbilities } from '@app/hooks/abilities/useAbilities'
import { createTransactionItem, TransactionItem } from '@app/transaction-flow/transaction'
import { makeTransferNameOrSubnameTransactionItem } from '@app/transaction-flow/transaction/utils/makeTransferNameOrSubnameTransactionItem'

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
  resolverAddress?: Address | null
}) => {
  if (!recipient) return []

  const setEthRecordOnly = transactions.setEthRecord && !transactions.resetProfile
  // Anytime you reset the profile you will need to set the eth record as well
  const setEthRecordAndResetProfile = transactions.resetProfile

  const _transactions = [
    setEthRecordOnly
      ? createTransactionItem('updateEthAddress', { name, address: recipient })
      : null,
    setEthRecordAndResetProfile && resolverAddress
      ? createTransactionItem('resetProfileWithRecords', {
          name,
          records: {
            coins: [{ coin: 'ETH', value: recipient }],
          },
          resolverAddress,
        })
      : null,
    transactions.sendManager
      ? makeTransferNameOrSubnameTransactionItem({
          name,
          newOwnerAddress: recipient,
          sendType: 'sendManager',
          isOwnerOrManager,
          abilities,
        })
      : null,
    transactions.sendOwner
      ? makeTransferNameOrSubnameTransactionItem({
          name,
          newOwnerAddress: recipient,
          sendType: 'sendOwner',
          isOwnerOrManager,
          abilities,
        })
      : null,
  ].filter(
    (
      transaction,
    ): transaction is
      | TransactionItem<'transferName'>
      | TransactionItem<'transferSubname'>
      | TransactionItem<'updateEthAddress'>
      | TransactionItem<'resetProfileWithRecords'> => !!transaction,
  )

  return _transactions as NonNullable<(typeof _transactions)[number]>[]
}
