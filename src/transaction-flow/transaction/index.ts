import burnFuses from './burnFuses'
import commitName from './commitName'
import createSubname from './createSubname'
import importDNSSECName from './importDNSSECName'
import migrateProfile from './migrateProfile'
import migrateProfileWithSync from './migrateProfileWithSync'
import registerName from './registerName'
import setPrimaryName from './setPrimaryName'
import testSendName from './testSendName'
import transferController from './transferController'
import transferName from './transferName'
import transferSubname from './transferSubname'
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
  migrateProfileWithSync,
  burnFuses,
  createSubname,
  commitName,
  registerName,
  transferName,
  transferSubname,
  transferController,
  importDNSSECName,
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
