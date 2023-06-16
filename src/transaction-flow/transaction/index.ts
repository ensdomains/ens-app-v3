import approveNameWrapper from './approveNameWrapper'
import burnFuses from './burnFuses'
import changePermissions from './changePermissions'
import commitName from './commitName'
import createSubname from './createSubname'
import deleteSubname from './deleteSubname'
import extendNames from './extendNames'
import importDNSSECName from './importDNSSECName'
import migrateProfile from './migrateProfile'
import migrateProfileWithEthAddress from './migrateProfileWithEthAddress'
import migrateProfileWithReset from './migrateProfileWithReset'
import registerName from './registerName'
import resetPrimaryName from './resetPrimaryName'
import resetProfile from './resetProfile'
import setPrimaryName from './setPrimaryName'
import syncManager from './syncManager'
import testSendName from './testSendName'
import transferController from './transferController'
import transferName from './transferName'
import transferSubname from './transferSubname'
import unwrapName from './unwrapName'
import updateEthAddress from './updateEthAddress'
import updateProfile from './updateProfile'
import updateProfileRecords from './updateProfileRecords'
import updateResolver from './updateResolver'
import wrapName from './wrapName'

export const transactions = {
  approveNameWrapper,
  burnFuses,
  changePermissions,
  commitName,
  createSubname,
  deleteSubname,
  extendNames,
  importDNSSECName,
  migrateProfile,
  migrateProfileWithEthAddress,
  migrateProfileWithReset,
  registerName,
  resetPrimaryName,
  resetProfile,
  setPrimaryName,
  syncManager,
  testSendName,
  transferController,
  transferName,
  transferSubname,
  unwrapName,
  updateEthAddress,
  updateProfile,
  updateProfileRecords,
  updateResolver,
  wrapName,
}

export type Transaction = typeof transactions
export type TransactionName = keyof Transaction

export type TransactionData<T extends TransactionName> = Parameters<
  Transaction[T]['transaction']
>[2]

export const makeTransactionItem = <T extends TransactionName>(
  name: T,
  data: TransactionData<T>,
) => ({
  name,
  data,
})

export type TransactionItem = ReturnType<typeof makeTransactionItem>
