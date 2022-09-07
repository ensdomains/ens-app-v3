import burnFuses from './burnFuses'
import createSubname from './createSubname'
import migrateProfile from './migrateProfile'
import setPrimaryName from './setPrimaryName'
import testSendName from './testSendName'
import updateEthAddress from './updateEthAddress'
import updateProfile from './updateProfile'
import updateResolver from './updateResolver'
import wrapName from './wrapName'
import migrateProfileWithSync from './migrateProfileWithSync'

export const transactions = {
  updateResolver,
  migrateProfile,
  wrapName,
  testSendName,
  updateProfile,
  setPrimaryName,
  updateEthAddress,
  migrateProfileWithSync,
  burnFuses,
  createSubname,
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
