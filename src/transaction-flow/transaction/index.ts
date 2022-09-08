import burnFuses from './burnFuses'
import createSubname from './createSubname'
import extendNames from './extendNames'
import migrateProfile from './migrateProfile'
import setPrimaryName from './setPrimaryName'
import testSendName from './testSendName'
import updateEthAddress from './updateEthAddress'
import updateProfile from './updateProfile'
import updateResolver from './updateResolver'
import wrapName from './wrapName'

export const transactions = {
  updateResolver,
  migrateProfile,
  wrapName,
  testSendName,
  updateProfile,
  setPrimaryName,
  updateEthAddress,
  burnFuses,
  createSubname,
  extendNames,
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
