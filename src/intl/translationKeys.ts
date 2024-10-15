import { match } from 'ts-pattern'

import type { Role } from '@app/hooks/ownership/useRoles/useRoles'

type GetTranslationKeys<T, RT = string> = (...args: T[]) => RT

export type TransactionAction =
  | 'setName'
  | 'setRecords'
  | 'test'
  | 'addSuccess'
  | 'sendName'
  | 'migrateProfile'
  | 'migrateProfileWithReset'
  | 'migrateProfileWithSync'
  | 'migrateProfileWithEthAddress'
  | 'wrapName'
  | 'updateResolver'
  | 'updateProfile'
  | 'setPrimaryName'
  | 'resetPrimaryName'
  | 'updateEthAddress'
  | 'testSendName'
  | 'burnFuses'
  | 'createSubname'
  | 'deleteSubname'
  | 'extendNames'
  | 'approveDnsRegistrar'
  | 'claimDnsName'
  | 'importDnsName'
  | 'commitName'
  | 'registerName'
  | 'approveNameWrapper'
  | 'clearRecords'
  | 'updateRecords'
  | 'updateRecord'
  | 'removeRecord'
  | 'resetProfileWithRecords'
  | 'transferName'
  | 'transferSubname'
  | 'changePermissions'
  | 'syncManager'
  | 'updateProfileRecords'
  | 'resetProfile'
  | 'unwrapName'
  | 'updateVerificationRecord'
  | 'removeVerificationRecord'

export type ProfileError =
  | 'unknown'
  | 'invalidName'
  | 'invalidAddress'
  | 'expiringSoon'
  | 'hasExpired'
  | 'ownerManagerChoice'
  | 'notMigrated'
  | 'featureNotAvailable'
  | 'featureNotAvailableLink'
  | 'migrationNotAvailable'
  | 'migrationNotAvailableLink'
  | 'addressLength'
  | 'unsupportedTLD'
  | 'keyInUse'
  | 'hasSubnames'
  | 'permissionRevoked'
  | 'gracePeriod'
  | 'default'
  | 'invalidJSON'
  | 'isOwnerCannotEdit'
  | 'cannotEdit'
  | 'isOwnerCannotVerify'
  | 'cannotVerify'

export const getProfileErrorTranslationKey: GetTranslationKeys<ProfileError> = (error) =>
  match(error)
    .with('invalidName', () => 'errors.invalidName')
    .with('invalidAddress', () => 'errors.invalidAddress')
    .with('expiringSoon', () => 'errors.expiringSoon')
    .with('hasExpired', () => 'errors.hasExpired')
    .with('ownerManagerChoice', () => 'errors.ownerManagerChoice')
    .with('notMigrated', () => 'errors.notMigrated')
    .with('featureNotAvailable', () => 'errors.featureNotAvailable')
    .with('featureNotAvailableLink', () => 'errors.featureNotAvailableLink')
    .with('migrationNotAvailable', () => 'errors.migrationNotAvailable')
    .with('migrationNotAvailableLink', () => 'errors.migrationNotAvailableLink')
    .with('addressLength', () => 'errors.addressLength')
    .with('unsupportedTLD', () => 'errors.unsupportedTLD')
    .with('keyInUse', () => 'errors.keyInUse')
    .with('hasSubnames', () => 'errors.hasSubnames')
    .with('permissionRevoked', () => 'errors.permissionRevoked')
    .with('gracePeriod', () => 'errors.gracePeriod')
    .with('default', () => 'errors.default')
    .with('invalidJSON', () => 'errors.invalidJSON')
    .with('isOwnerCannotEdit', () => 'errors.isOwnerCannotEdit')
    .with('cannotEdit', () => 'errors.cannotEdit')
    .with('isOwnerCannotVerify', () => 'errors.isOwnerCannotVerify')
    .with('cannotVerify', () => 'errors.cannotVerify')
    .otherwise(() => 'errors.unknown')

export const getRoleTranslationKeys: GetTranslationKeys<
  Role,
  { title: string; description: string }
> = (role) =>
  match(role)
    .with('manager', () => ({
      title: 'roles.manager.title',
      description: 'roles.manager.description',
    }))
    .with('owner', () => ({
      title: 'roles.owner.title',
      description: 'roles.owner.description',
    }))
    .with('eth-record', () => ({
      title: 'roles.eth-record.title',
      description: 'roles.eth-record.description',
    }))
    .with('dns-owner', () => ({
      title: 'roles.dns-owner.title',
      description: 'roles.dns-owner.description',
    }))
    .with('parent-owner', () => ({
      title: 'roles.parent-owner.title',
      description: 'roles.parent-owner.description',
    }))
    .otherwise(() => ({ title: '', description: '' }))

export const getStatusTranslationKeys: GetTranslationKeys<
  'pending' | 'confirmed' | 'failed' | 'searching',
  {
    regular: string
    notifyTitle: string
    notifyMessage: string
  }
> = (status) =>
  match(status)
    .with('pending', () => ({
      regular: 'transaction.status.pending.regular',
      notifyTitle: 'transaction.status.pending..title',
      notifyMessage: 'transaction.status.pending..description',
    }))
    .with('confirmed', () => ({
      regular: 'transaction.status.confirmed.regular',
      notifyTitle: 'transaction.status.confirmed.notifyTitle',
      notifyMessage: 'transaction.status.confirmed.notifyMessage',
    }))
    .with('failed', () => ({
      regular: 'transaction.status.failed.regular',
      notifyTitle: 'transaction.status.failed.notifyTitle',
      notifyMessage: 'transaction.status.failed.notifyMessage',
    }))
    .otherwise(() => ({ regular: '', notifyTitle: '', notifyMessage: '' }))

export const getTransactionActionTranslationKeys: GetTranslationKeys<TransactionAction> = (
  status,
) =>
  match(status)
    .with('setName', () => 'transaction.description.setName')
    .with('setRecords', () => 'transaction.description.setRecords')
    .with('test', () => 'transaction.description.test')
    .with('addSuccess', () => 'transaction.description.addSuccess')
    .with('sendName', () => 'transaction.description.sendName')
    .with('migrateProfile', () => 'transaction.description.migrateProfile')
    .with('migrateProfileWithReset', () => 'transaction.description.migrateProfileWithReset')
    .with('migrateProfileWithSync', () => 'transaction.description.migrateProfileWithSync')
    .with(
      'migrateProfileWithEthAddress',
      () => 'transaction.description.migrateProfileWithEthAddress',
    )
    .with('wrapName', () => 'transaction.description.wrapName')
    .with('updateResolver', () => 'transaction.description.updateResolver')
    .with('updateProfile', () => 'transaction.description.updateProfile')
    .with('setPrimaryName', () => 'transaction.description.setPrimaryName')
    .with('resetPrimaryName', () => 'transaction.description.resetPrimaryName')
    .with('updateEthAddress', () => 'transaction.description.updateEthAddress')
    .with('testSendName', () => 'transaction.description.testSendName')
    .with('burnFuses', () => 'transaction.description.burnFuses')
    .with('createSubname', () => 'transaction.description.createSubname')
    .with('deleteSubname', () => 'transaction.description.deleteSubname')
    .with('extendNames', () => 'transaction.description.extendNames')
    .with('approveDnsRegistrar', () => 'transaction.description.approveDnsRegistrar')
    .with('claimDnsName', () => 'transaction.description.claimDnsName')
    .with('importDnsName', () => 'transaction.description.importDnsName')
    .with('commitName', () => 'transaction.description.commitName')
    .with('registerName', () => 'transaction.description.registerName')
    .with('approveNameWrapper', () => 'transaction.description.approveNameWrapper')
    .with('clearRecords', () => 'transaction.description.clearRecords')
    .with('updateRecords', () => 'transaction.description.updateRecords')
    .with('updateRecord', () => 'transaction.description.updateRecord')
    .with('removeRecord', () => 'transaction.description.removeRecord')
    .with('resetProfileWithRecords', () => 'transaction.description.resetProfileWithRecords')
    .with('transferName', () => 'transaction.description.transferName')
    .with('transferSubname', () => 'transaction.description.transferSubname')
    .with('changePermissions', () => 'transaction.description.changePermissions')
    .with('syncManager', () => 'transaction.description.syncManager')
    .with('updateProfileRecords', () => 'transaction.description.updateProfileRecords')
    .with('resetProfile', () => 'transaction.description.resetProfile')
    .with('unwrapName', () => 'transaction.description.unwrapName')
    .with('updateVerificationRecord', () => 'transaction.description.updateVerificationRecord')
    .with('removeVerificationRecord', () => 'transaction.description.removeVerificationRecord')
    .otherwise(() => '')
