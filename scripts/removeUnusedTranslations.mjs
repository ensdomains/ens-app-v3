import fs from 'fs/promises'
import path from 'path'

const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales', 'en')

async function removeKeysFromFile(filePath, keysToRemove) {
  const content = JSON.parse(await fs.readFile(filePath, 'utf-8'))
  
  function removeKey(obj, keyPath) {
    const parts = keyPath.split('.')
    const lastPart = parts.pop()
    let current = obj
    
    for (const part of parts) {
      if (!current[part] || typeof current[part] !== 'object') return
      current = current[part]
    }
    
    delete current[lastPart]
    
    // Clean up empty objects
    if (Object.keys(current).length === 0 && parts.length > 0) {
      removeKey(obj, parts.join('.'))
    }
  }
  
  for (const key of keysToRemove) {
    if (key) removeKey(content, key)
  }
  
  await fs.writeFile(filePath, JSON.stringify(content, null, 2) + '\n')
}

const keysToRemove = {
  'error.json': ['unknown', 'noTxtRecord', 'dnssecFailure', 'invalidTxtRecord', 'invalidAddressChecksum', 'resolutionFailure'],
  'common.json': [
    'expiry', 'parent', 'registrant', 'controller', 'dnsOwner', 'all',
    'expiresInYears_one', 'expiresInYears_other',
    'expiresInMonths_one', 'expiresInMonths_other',
    'expiresInDays_one', 'expiresInDays_other',
    'expiresInHours_one', 'expiresInHours_other', 'expiresInHours_zero',
    'gracePeriod.expiresInYears_one', 'gracePeriod.expiresInYears_other',
    'gracePeriod.expiresInMonths_one', 'gracePeriod.expiresInMonths_other',
    'gracePeriod.expiresInDays_one', 'gracePeriod.expiresInDays_other',
    'gracePeriod.expiresInHours_one', 'gracePeriod.expiresInHours_other',
    'gracePeriod.expiresInHours_zero'
  ],
  'profile.json': [
    'dnsOwnerNotManager',
    'expiry.panel.expiry.title',
    'expiry.panel.parent-expiry.title',
    'expiry.panel.parent-grace-period.title',
    'parent-owner'
  ],
  'transactionFlow.json': [
    'description.setName', 'description.setRecords', 'description.test',
    'description.addSuccess', 'description.sendName', 'description.migrateProfile',
    'description.migrateProfileWithSync', 'description.migrateProfileWithEthAddress',
    'description.wrapName', 'description.updateResolver', 'description.setPrimaryName',
    'description.resetPrimaryName', 'description.updateEthAddress'
  ],
  'status.json': ['error', 'minutesAgo_one', 'minutesAgo_other'],
  'steps.json': [
    'selectType.title', 'selectType.subtitle', 'selectType.learnMore', 'selectType.select.heading',
    // ... (all keys from steps.json)
  ],
  'not-found.json': ['title', 'message'],
  'application-error.json': ['title', 'message'],
  'action.json': ['change', 'upload', 'edit', 'clear', 'update', 'set', 'remove', 'sign', 'reset', 'restart', 'transfer', 'burnSelected', 'check', 'remindMe', 'begin', 'finish', 'skip', 'feedback', 'migrate', 'setToSelf', 'import', 'connect'],
  'unit.json': ['years_one', 'years_other', 'months_one', 'months_other', 'days_one', 'days_other', 'hours_one', 'hours_other', 'minutes_one', 'minutes_other', 'invalid_date', 'yrs_one', 'yrs_other', 'gas', 'selected', 'perPage'],
  'navigation.json': ['home', 'names', 'favourites', 'governance', 'community', 'developers', 'support', 'bounty', 'terms', 'privacy', 'back', 'oldApp', 'ipfsApp', 'feedback'],
  'wallet.json': ['noPrimaryName', 'register'],
  'name.json': ['expiry', 'parent', 'registrant', 'controller', 'dnsOwner', 'all', 'expiresInYears_one', 'expiresInYears_other', 'expiresInMonths_one', 'expiresInMonths_other', 'expiresInDays_one', 'expiresInDays_other', 'expiresInHours_one', 'expiresInHours_other', 'expiresInHours_zero', 'expiredInHours_one', 'expiredInHours_other', 'expiredInHours_zero', 'expiredInDays_one', 'expiredInDays_other', 'expiredInMonths_one', 'expiredInMonths_other', 'expiredInYears_one', 'expiredInYears_other', 'gracePeriod.expiresInYears_one', 'gracePeriod.expiresInYears_other', 'gracePeriod.expiresInMonths_one', 'gracePeriod.expiresInMonths_other', 'gracePeriod.expiresInDays_one', 'gracePeriod.expiresInDays_other', 'gracePeriod.expiresInHours_one', 'gracePeriod.expiresInHours_other', 'gracePeriod.expiresInHours_zero', 'extend', 'send', 'transfer', 'sendManager', 'sendOwner', 'renew'],
  'records.json': ['label'],
  'sortTypes.json': ['expiryDate', 'labelName', 'createdAt'],
  'errors.json': ['noResults', 'addressRequired', 'indexingErrors.title', 'indexingErrors.message', 'indexingErrors.message_datetime', 'networkError.blurb', 'expiringSoon', 'hasExpired', 'ownerManagerChoice', 'unknown', 'notMigrated', 'featureNotAvailable', 'featureNotAvailableLink', 'keyInUse', 'gracePeriod', 'default', 'invalidJSON', 'duplicateKey'],
  'transaction.json': ['description.setName', 'description.setRecords', 'description.test', 'description.addSuccess', 'description.sendName', 'description.migrateProfile', 'description.migrateProfileWithSync', 'description.migrateProfileWithEthAddress', 'description.wrapName', 'description.updateResolver', 'description.setPrimaryName', 'description.resetPrimaryName', 'description.updateEthAddress', 'description.testSendName', 'description.createSubname', 'description.deleteSubname', 'description.extendNames', 'description.transferName', 'description.transferSubname', 'description.updateProfileRecords', 'description.resetProfile', 'description.unwrapName', 'description.updateVerificationRecord', 'description.removeVerificationRecord'],
  'search.json': ['address', 'errors.tooShort', 'errors.invalid', 'status.registered', 'status.gracePeriod', 'status.premium', 'status.notOwned', 'status.notImported', 'status.short', 'status.default', 'status.invalid', 'status.unsupportedTLD', 'status.imported', 'status.owned', 'status.offChain'],
  'selectableInput.json': ['add', 'placeholder', 'empty'],
  'testnetFaucet.json': ['explanation'],
  'roles.json': ['dns-owner.title', 'dns-owner.description', 'parent-owner.title', 'parent-owner.description', 'manager.description', 'profile-editor.title', 'profile-editor.description', 'eth-record.title', 'eth-record.description'],
  'verification.json': ['verifiedBy'],
  'verificationErrorDialog.json': ['wrongAccount'],
  'subtitle.json': ['start', 'this', 'your', 'wallet'],
  'banner.json': ['available.title', 'available.description'],
  'tabs.json': ['profile.name', 'profile.actions.setAsPrimaryName.title', 'profile.actions.extend.label', 'profile.warnings.offchain', 'profile.warnings.homoglyph', 'records.name', 'ownership.name', 'ownership.warning.managerNotParentOwner', 'ownership.sections.roles.addresses_one', 'ownership.sections.roles.addresses_other', 'ownership.sections.expiry.panel.expiry.title', 'ownership.sections.expiry.panel.grace-period.title', 'ownership.sections.expiry.panel.registration.title', 'ownership.sections.expiry.panel.parent-expiry.title', 'ownership.sections.expiry.panel.parent-grace-period.title', 'ownership.tooltips.owner', 'ownership.tooltips.parent-owner', 'ownership.tooltips.dns-owner', 'ownership.tooltips.manager', 'ownership.tooltips.profile-editor', 'ownership.tooltips.subname-manager', 'ownership.tooltips.eth-record', 'ownership.tooltips.grace-period', 'ownership.tooltips.contract-address', 'ownership.tooltips.namewrapper'],
  'details.json': ['title', 'notWrapped', 'sendName.title', 'sendName.description', 'sendName.learnMore', 'sendName.makeOwner', 'sendName.makeOwnerDescription', 'sendName.makeManager', 'sendName.makeManagerDescription', 'sendName.transferSubname', 'sendName.transferController', 'wrap.startTitle', 'wrap.resumeTitle', 'wrap.completeTitle', 'wrap.startLabel', 'wrap.resumeLabel', 'wrap.boxTitle', 'wrap.boxDescription', 'descriptions.owner', 'descriptions.controller', 'descriptions.registrant', 'descriptions.dnsOwner'],
  'advancedEditor.json': ['title', 'tabs.text.placeholder.default', 'tabs.address.placeholder.default', 'tabs.other.publicKey.label', 'tabs.other.publicKey.placeholder'],
  'invoice.json': ['timeRegistration', 'totalPaid'],
  'input.json': ['profileEditor.tabs.avatar.nft.address.owned', 'profileEditor.tabs.avatar.nft.address.other', 'profileEditor.tabs.general.label', 'profileEditor.tabs.general.name.label', 'profileEditor.tabs.general.name.placeholder', 'profileEditor.tabs.general.url.label', 'profileEditor.tabs.general.url.placeholder', 'profileEditor.tabs.general.location.label', 'profileEditor.tabs.general.location.placeholder', 'profileEditor.tabs.general.description.label', 'profileEditor.tabs.general.description.placeholder'],
  'intro.json': ['migrateAndUpdateResolver.title', 'syncManager.description', 'selectPrimaryName.updateEthAddress.title', 'selectPrimaryName.updateEthAddress.description', 'selectPrimaryName.noResolver.title', 'selectPrimaryName.noResolver.description', 'selectPrimaryName.invalidResolver.title', 'selectPrimaryName.invalidResolver.description', 'multiStepSubnameDelete.title', 'multiStepSubnameDelete.description'],
  'section.json': ['wallet.title']
}

async function main() {
  for (const [file, keys] of Object.entries(keysToRemove)) {
    const filePath = path.join(LOCALES_DIR, file)
    try {
      await removeKeysFromFile(filePath, keys)
      console.log(`Removed unused keys from ${file}`)
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`Skipping ${file} - file does not exist`)
      } else {
        console.error(`Error processing ${file}:`, error)
      }
    }
  }
}

main().catch(console.error)
