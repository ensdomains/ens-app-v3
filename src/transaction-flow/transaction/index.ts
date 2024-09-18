import approveDnsRegistrar from './approveDnsRegistrar'
import approveNameWrapper from './approveNameWrapper'
import burnFuses from './burnFuses'
import changePermissions from './changePermissions'
import claimDnsName from './claimDnsName'
import commitName from './commitName'
import createSubname from './createSubname'
import deleteSubname from './deleteSubname'
import extendNames from './extendNames'
import importDnsName from './importDnsName'
import migrateProfile from './migrateProfile'
import migrateProfileWithReset from './migrateProfileWithReset'
import registerName from './registerName'
import removeVerificationRecord from './removeVerificationRecord'
import resetPrimaryName from './resetPrimaryName'
import resetProfile from './resetProfile'
import resetProfileWithRecords from './resetProfileWithRecords'
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
import updateVerificationRecord from './updateVerificationRecord'
import wrapName from './wrapName'

export const transactions = {
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

export type Transaction = typeof transactions
export type TransactionName = keyof Transaction

export type TransactionParameters<name extends TransactionName> = Parameters<
  Transaction[name]['transaction']
>[0]

export type TransactionData<name extends TransactionName> = TransactionParameters<name>['data']

export type TransactionReturnType<name extends TransactionName> = ReturnType<
  Transaction[name]['transaction']
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
  return transactions[name].transaction({ ...rest } as any) as TransactionReturnType<name>
}

export type TransactionItem<name extends TransactionName = TransactionName> = {
  name: name
  data: TransactionData<name>
}

export type TransactionItemUnion = {
  [name in TransactionName]: TransactionItem<name>
}[TransactionName]
