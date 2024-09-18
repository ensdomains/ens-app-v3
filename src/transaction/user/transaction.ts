import approveDnsRegistrar from './transaction/approveDnsRegistrar'
import approveNameWrapper from './transaction/approveNameWrapper'
import burnFuses from './transaction/burnFuses'
import changePermissions from './transaction/changePermissions'
import claimDnsName from './transaction/claimDnsName'
import commitName from './transaction/commitName'
import createSubname from './transaction/createSubname'
import deleteSubname from './transaction/deleteSubname'
import extendNames from './transaction/extendNames'
import importDnsName from './transaction/importDnsName'
import migrateProfile from './transaction/migrateProfile'
import migrateProfileWithReset from './transaction/migrateProfileWithReset'
import registerName from './transaction/registerName'
import removeVerificationRecord from './transaction/removeVerificationRecord'
import resetPrimaryName from './transaction/resetPrimaryName'
import resetProfile from './transaction/resetProfile'
import resetProfileWithRecords from './transaction/resetProfileWithRecords'
import setPrimaryName from './transaction/setPrimaryName'
import syncManager from './transaction/syncManager'
import testSendName from './transaction/testSendName'
import transferController from './transaction/transferController'
import transferName from './transaction/transferName'
import transferSubname from './transaction/transferSubname'
import unwrapName from './transaction/unwrapName'
import updateEthAddress from './transaction/updateEthAddress'
import updateProfile from './transaction/updateProfile'
import updateProfileRecords from './transaction/updateProfileRecords'
import updateResolver from './transaction/updateResolver'
import updateVerificationRecord from './transaction/updateVerificationRecord'
import wrapName from './transaction/wrapName'

export const userTransactions = {
  approveDnsRegistrar,
  approveNameWrapper,
  burnFuses,
  changePermissions,
  claimDnsName,
  commitName,
  createSubname,
  deleteSubname,
  extendNames,
  importDnsName,
  migrateProfile,
  migrateProfileWithReset,
  registerName,
  resetPrimaryName,
  resetProfile,
  resetProfileWithRecords,
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
  updateVerificationRecord,
  removeVerificationRecord,
}

export type UserTransactionObject = typeof userTransactions
export type TransactionName = keyof UserTransactionObject

export type TransactionParameters<name extends TransactionName> = Parameters<
  UserTransactionObject[name]['transaction']
>[0]

export type TransactionData<name extends TransactionName> = TransactionParameters<name>['data']

export type TransactionReturnType<name extends TransactionName> = ReturnType<
  UserTransactionObject[name]['transaction']
>

export const createTransactionItem = <name extends TransactionName>(
  name: name,
  data: TransactionData<name>,
) => ({
  name,
  data,
})

export const createTransactionRequest = <name extends TransactionName>({
  name,
  ...rest
}: { name: name } & TransactionParameters<name>): TransactionReturnType<name> => {
  // i think this has to be any :(
  return userTransactions[name].transaction({ ...rest } as any) as TransactionReturnType<name>
}

export type TransactionItem<name extends TransactionName = TransactionName> = {
  name: name
  data: TransactionData<name>
}

export type TransactionItemUnion = {
  [name in TransactionName]: TransactionItem<name>
}[TransactionName]
