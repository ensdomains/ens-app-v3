import migrateProfile from './migrateProfile'
import testSendName from './testSendName'
import updateResolver from './updateResolver'
import wrapName from './wrapName'
import updateProfile from './updateProfile'

export const transactions = {
  updateResolver,
  migrateProfile,
  wrapName,
  testSendName,
  updateProfile,
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
