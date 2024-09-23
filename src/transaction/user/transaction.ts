import type { TargetChain } from '@app/constants/chains'

// eslint-disable-next-line @typescript-eslint/naming-convention
import __dev_failure from './transaction/__dev_failure'
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __dev_failure,
}

export type UserTransactionObject = typeof userTransactions
export type UserTransactionName = keyof UserTransactionObject

export type UserTransactionParameters<name extends UserTransactionName> = Parameters<
  UserTransactionObject[name]['transaction']
>[0]

export type UserTransactionData<name extends UserTransactionName> =
  UserTransactionParameters<name>['data']

export type UserTransactionReturnType<name extends UserTransactionName> = ReturnType<
  UserTransactionObject[name]['transaction']
>

export const createUserTransaction = <name extends UserTransactionName>(
  name: name,
  data: UserTransactionData<name>,
) => ({
  name,
  data,
})

export const createTransactionRequest = <name extends UserTransactionName>({
  name,
  ...rest
}: { name: name } & UserTransactionParameters<name>): UserTransactionReturnType<name> => {
  // i think this has to be any :(
  return userTransactions[name].transaction({ ...rest } as any) as UserTransactionReturnType<name>
}

export type GenericUserTransaction<name extends UserTransactionName = UserTransactionName> = {
  name: name
  data: UserTransactionData<name>
  targetChainId?: TargetChain['id']
}

export type UserTransaction = {
  [name in UserTransactionName]: GenericUserTransaction<name>
}[UserTransactionName]
