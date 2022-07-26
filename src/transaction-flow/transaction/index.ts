import migrateProfile from './migrateProfile'
import updateResolver from './updateResolver'
import wrapName from './wrapName'

export const transactions = {
  updateResolver,
  migrateProfile,
  wrapName,
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
