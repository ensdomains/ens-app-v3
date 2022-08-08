import migrateProfile from './migrateProfile'
import setPrimaryName from './setPrimaryName'
import testSendName from './testSendName'
import updateEthAddress from './updateEthAddress'
import updateResolver from './updateResolver'
import wrapName from './wrapName'

export const transactions = {
  updateResolver,
  migrateProfile,
  wrapName,
  testSendName,
  setPrimaryName,
  updateEthAddress,
}

export type Transaction = typeof transactions
export type TransactionName = keyof Transaction

export const makeTransactionItem = <T extends TransactionName>(
  name: T,
  data: Parameters<Transaction[T]['transaction']>[2],
) => ({
  name,
  data,
})
