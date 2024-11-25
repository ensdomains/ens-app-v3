import { expect } from '@playwright/test'

import { test } from '../../../playwright'

test.describe('Unwrapped 2LD - Owner and Manager', () => {
  test('Send feature', async ({ login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'owner-manager',
      type: 'legacy',
      records: {
        coins: [
          {
            coin: 'etcLegacy',
            value: '0x42D63ae25990889E35F215bC95884039Ba354115',
          },
        ],
      },
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const sendNameModal = makePageObject('SendNameModal')
    const transactionModal = makePageObject('TransactionModal')

    await ownershipPage.goto(name)
    await login.connect()

    await ownershipPage.sendNameButton.click()
    await sendNameModal.searchInput.fill(accounts.getAddress('user3'))
    await sendNameModal.searchResult(accounts.getAddress('user3')).click()
    await expect(sendNameModal.resetProfileSwitch).toHaveCount(0)

    await sendNameModal.summaryHeader.click()
    test.step('Should not be able to reset profile since old resolver does not support VersionableResolver', async () => {
      await expect(sendNameModal.summaryItem('reset-profile')).toHaveCount(0)
    })
    test.step('Should be able to send Owner', async () => {
      await expect(sendNameModal.summaryItem('owner')).toBeVisible()
    })
    test.step('Should be able to send Manager', async () => {
      await expect(sendNameModal.summaryItem('manager')).toBeVisible()
    })
    test.step('Should be able to send ETH record', async () => {
      await expect(sendNameModal.summaryItem('eth-record')).toBeVisible()
    })

    await sendNameModal.sendButton.click()
    await sendNameModal.confirmButton.click()

    await transactionModal.autoComplete()

    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager')
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record')
  })

  test('Sync Manager', async ({ login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'owner-manager',
      type: 'legacy',
      records: {
        coins: [
          {
            coin: 'etcLegacy',
            value: '0x42D63ae25990889E35F215bC95884039Ba354115',
          },
        ],
      },
    })

    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(name)
    await login.connect()

    await expect(ownershipPage.syncManagerButton).toHaveCount(0)
  })

  test('Edit Roles', async ({ login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')
    const editRolesModal = makePageObject('EditRolesModal')

    await ownershipPage.goto(name)
    await login.connect()
    await ownershipPage.editRolesButton.click()

    await editRolesModal.roleCardChangeButton('owner').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()

    await editRolesModal.roleCardChangeButton('manager').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()

    await editRolesModal.roleCardChangeButton('eth-record').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()

    await editRolesModal.saveButton.click()
    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager')
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record')
  })

  test('Expiry Section, Extend & Set Reminder', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const extendNamesModal = makePageObject('ExtendNamesModal')

    await ownershipPage.goto(name)
    await login.connect()

    expect(await ownershipPage.getExpiryTimestamp()).toBeGreaterThan(0)
    await expect(ownershipPage.expiryPanelRegistrationDate).toHaveCount(1)
    await expect(ownershipPage.expiryPanelGracePeriod).toHaveCount(1)
    await expect(ownershipPage.expiryPanelParentExpiry).toHaveCount(0)
    await expect(ownershipPage.expiryPanelParentGracePeriod).toHaveCount(0)
    await expect(ownershipPage.setReminder).toBeVisible()
    await ownershipPage.extendButton.click()
    await extendNamesModal.getExtendButton.click()
    await expect(page.getByText('Confirm Details')).toBeVisible()
  })
})

test.describe('Unwrapped 2LD - Owner Only', () => {
  test('Send feature', async ({ login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'other-manager',
      type: 'legacy',
      owner: 'user',
      manager: 'user2',
      records: {
        coins: [
          {
            coin: 'etcLegacy',
            value: '0x42D63ae25990889E35F215bC95884039Ba354115',
          },
        ],
      },
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const sendNameModal = makePageObject('SendNameModal')
    const transactionModal = makePageObject('TransactionModal')

    await ownershipPage.goto(name)
    await login.connect()

    await ownershipPage.sendNameButton.click()
    await sendNameModal.searchInput.fill(accounts.getAddress('user3'))
    await sendNameModal.searchResult(accounts.getAddress('user3')).click()
    await expect(sendNameModal.resetProfileSwitch).toHaveCount(0)

    await sendNameModal.summaryHeader.click()
    test.step('Should not be able to reset profile', async () => {
      await expect(sendNameModal.summaryItem('reset-profile')).toHaveCount(0)
    })
    test.step('Should be able to send Owner', async () => {
      await expect(sendNameModal.summaryItem('owner')).toBeVisible()
    })
    test.step('Should be able to send Manager', async () => {
      await expect(sendNameModal.summaryItem('manager')).toBeVisible()
    })
    test.step('Should be able to send ETH record', async () => {
      await expect(sendNameModal.summaryItem('eth-record')).toHaveCount(0)
    })

    await sendNameModal.sendButton.click()
    await sendNameModal.confirmButton.click()

    await transactionModal.autoComplete()

    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager')
    await expect(ownershipPage.roleRow(accounts.getAddress('user'))).toContainText('ETH record')
  })

  test('Sync Manager', async ({ page, login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'other-manager',
      type: 'legacy',
      owner: 'user',
      manager: 'user2',
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')

    await ownershipPage.goto(name)
    await login.connect()

    await ownershipPage.syncManagerButton.click()
    await page.getByRole('button', { name: 'Next' }).click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user'))).toContainText('manager')
    await expect(ownershipPage.roleRow(accounts.getAddress('user'))).toContainText('owner')
  })

  test('Edit Roles', async ({ login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'other-manager',
      type: 'legacy',
      owner: 'user',
      manager: 'user2',
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')
    const editRolesModal = makePageObject('EditRolesModal')

    await ownershipPage.goto(name)
    await login.connect()
    await ownershipPage.editRolesButton.click()

    await editRolesModal.roleCardChangeButton('owner').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()

    await editRolesModal.roleCardChangeButton('manager').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()

    await expect(editRolesModal.roleCardChangeButton('eth-record')).toHaveCount(0)

    await editRolesModal.saveButton.click()
    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager')
    await expect(ownershipPage.roleRow(accounts.getAddress('user'))).toContainText('ETH record')
  })

  test('Expiry Section, Extend & Set Reminder', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'other-manager',
      type: 'legacy',
      owner: 'user',
      manager: 'user2',
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const extendNamesModal = makePageObject('ExtendNamesModal')

    await ownershipPage.goto(name)
    await login.connect()

    expect(await ownershipPage.getExpiryTimestamp()).toBeGreaterThan(0)
    await expect(ownershipPage.expiryPanelRegistrationDate).toHaveCount(1)
    await expect(ownershipPage.expiryPanelGracePeriod).toHaveCount(1)
    await expect(ownershipPage.expiryPanelParentExpiry).toHaveCount(0)
    await expect(ownershipPage.expiryPanelParentGracePeriod).toHaveCount(0)
    await expect(ownershipPage.setReminder).toBeVisible()
    await ownershipPage.extendButton.click()
    await extendNamesModal.getExtendButton.click()
    await expect(page.getByText('Confirm Details')).toBeVisible()
  })
})

test.describe('Unwrapped 2LD - Manager Only', () => {
  test('Send Feature', async ({ page, login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'other-manager',
      type: 'legacy',
      owner: 'user2',
      manager: 'user',
      records: {
        coins: [
          {
            coin: 'etcLegacy',
            value: '0x42D63ae25990889E35F215bC95884039Ba354115',
          },
        ],
      },
    })

    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(name)
    await login.connect()

    await page.waitForTimeout(2000)
    await expect(ownershipPage.sendNameButton).toHaveCount(0)
  })

  test('Edit Roles', async ({ login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'other-manager',
      type: 'legacy',
      owner: 'user2',
      manager: 'user',
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')
    const editRolesModal = makePageObject('EditRolesModal')

    await ownershipPage.goto(name)
    await login.connect()
    await ownershipPage.editRolesButton.click()

    await expect(editRolesModal.roleCardChangeButton('owner')).toHaveCount(0)
    await editRolesModal.roleCardChangeButton('manager').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()

    await editRolesModal.roleCardChangeButton('eth-record').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()

    await editRolesModal.saveButton.click()
    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user2'))).toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record', {
      timeout: 15000,
    })
  })

  test('Expiry Section, Extend & Set Reminder', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'other-manager',
      type: 'legacy',
      owner: 'user2',
      manager: 'user',
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const extendNamesModal = makePageObject('ExtendNamesModal')

    await ownershipPage.goto(name)
    await login.connect()

    expect(await ownershipPage.getExpiryTimestamp()).toBeGreaterThan(0)
    await expect(ownershipPage.expiryPanelRegistrationDate).toHaveCount(1)
    await expect(ownershipPage.expiryPanelGracePeriod).toHaveCount(1)
    await expect(ownershipPage.expiryPanelParentExpiry).toHaveCount(0)
    await expect(ownershipPage.expiryPanelParentGracePeriod).toHaveCount(0)
    await expect(ownershipPage.setReminder).toBeVisible()
    await ownershipPage.extendButton.click()
    await page.getByRole('button', { name: 'I understand' }).click()
    await extendNamesModal.getExtendButton.click()
    await expect(page.getByText('Confirm Details')).toBeVisible()
  })
})

test.describe('Wrapped and Emancipated 2LD - Owner', () => {
  test('Send Feature', async ({ login, accounts, makeName, makePageObject }) => {
    // Should be able to send owner, eth-record and reset profile of a wrapped 2ld name if you are the owner
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      records: {
        texts: [{ key: 'name', value: 'test' }],
        coins: [
          {
            coin: 'etcLegacy',
            value: '0x42D63ae25990889E35F215bC95884039Ba354115',
          },
        ],
      },
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const sendNameModal = makePageObject('SendNameModal')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(name)
    await login.connect()

    await expect(profilePage.record('text', 'nickname')).toContainText('test')

    await ownershipPage.goto(name)
    await ownershipPage.sendNameButton.click()
    await sendNameModal.searchInput.fill(accounts.getAddress('user3'))
    await sendNameModal.searchResult(accounts.getAddress('user3')).click()
    await sendNameModal.resetProfileSwitch.click()

    // Should not be able to set manager because name is wrapped
    await sendNameModal.summaryHeader.click()
    await expect(sendNameModal.summaryItem('owner')).toBeVisible()
    await expect(sendNameModal.summaryItem('manager')).toHaveCount(0)
    await expect(sendNameModal.summaryItem('eth-record')).toBeVisible()
    await expect(sendNameModal.summaryItem('reset-profile')).toBeVisible()

    await sendNameModal.sendButton.click()
    await sendNameModal.confirmButton.click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).not.toContainText('manager')
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record')

    await profilePage.goto(name)
    await expect(profilePage.record('text', 'nickname')).toHaveCount(0)
  })

  test('Edit Roles', async ({ login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      records: {
        texts: [{ key: 'name', value: 'test' }],
        coins: [
          {
            coin: 'etcLegacy',
            value: '0x42D63ae25990889E35F215bC95884039Ba354115',
          },
        ],
      },
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')
    const editRolesModal = makePageObject('EditRolesModal')

    await ownershipPage.goto(name)
    await login.connect()
    await ownershipPage.editRolesButton.click()

    await editRolesModal.roleCardChangeButton('owner').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()

    await expect(editRolesModal.roleCardChangeButton('manager')).toHaveCount(0)

    await editRolesModal.roleCardChangeButton('eth-record').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()

    await editRolesModal.saveButton.click()
    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record', {
      timeout: 15000,
    })
  })

  test('Expiry Section, Extend & Set Reminder', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      records: {
        texts: [{ key: 'name', value: 'test' }],
        coins: [
          {
            coin: 'etcLegacy',
            value: '0x42D63ae25990889E35F215bC95884039Ba354115',
          },
        ],
      },
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const extendNamesModal = makePageObject('ExtendNamesModal')

    await ownershipPage.goto(name)
    await login.connect()

    expect(await ownershipPage.getExpiryTimestamp()).toBeGreaterThan(0)
    await expect(ownershipPage.expiryPanelRegistrationDate).toHaveCount(1)
    await expect(ownershipPage.expiryPanelGracePeriod).toHaveCount(1)
    await expect(ownershipPage.expiryPanelParentExpiry).toHaveCount(0)
    await expect(ownershipPage.expiryPanelParentGracePeriod).toHaveCount(0)
    await expect(ownershipPage.setReminder).toBeVisible()
    await ownershipPage.extendButton.click()
    await extendNamesModal.getExtendButton.click()
    await expect(page.getByText('Confirm Details')).toBeVisible()
  })
})

test.describe('Grace Period Unwrapped 2LD', () => {
  test('Send feature', async ({ login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'grace-period-unwrapped',
      type: 'legacy',
      records: {
        coins: [
          {
            coin: 'etcLegacy',
            value: '0x42D63ae25990889E35F215bC95884039Ba354115',
          },
        ],
      },
      duration: -24 * 60 * 60,
    })

    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(name)
    await login.connect()

    await expect(ownershipPage.sendNameButton).toHaveCount(0)
  })

  test('Sync Manager', async ({ login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'grace-period-unwrapped',
      type: 'legacy',
      owner: 'user',
      manager: 'user2',
      records: {
        coins: [
          {
            coin: 'etcLegacy',
            value: '0x42D63ae25990889E35F215bC95884039Ba354115',
          },
        ],
      },
      duration: -24 * 60 * 60,
    })

    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(name)
    await login.connect()

    await expect(ownershipPage.syncManagerButton).toHaveCount(0)
  })

  test('Edit Roles', async ({ login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'grace-period-unwrapped',
      type: 'legacy',
      duration: -24 * 60 * 60,
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')
    const editRolesModal = makePageObject('EditRolesModal')

    await ownershipPage.goto(name)
    await login.connect()

    await ownershipPage.editRolesButton.click()

    await expect(editRolesModal.roleCardChangeButton('owner')).toHaveCount(0)
    await expect(editRolesModal.roleCardChangeButton('manager')).toHaveCount(0)

    await editRolesModal.roleCardChangeButton('eth-record').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()

    await editRolesModal.saveButton.click()
    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user'))).toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user'))).toContainText('manager')
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record')
  })

  test('Expiry Section, Extend & Set Reminder', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'grace-period-unwrapped',
      type: 'legacy',
      duration: -24 * 60 * 60,
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const extendNamesModal = makePageObject('ExtendNamesModal')

    await ownershipPage.goto(name)
    await login.connect()

    expect(await ownershipPage.getExpiryTimestamp()).toBeGreaterThan(0)
    await expect(ownershipPage.expiryPanelRegistrationDate).toHaveCount(1)
    await expect(ownershipPage.expiryPanelGracePeriod).toHaveCount(1)
    await expect(ownershipPage.expiryPanelParentExpiry).toHaveCount(0)
    await expect(ownershipPage.expiryPanelParentGracePeriod).toHaveCount(0)
    await expect(ownershipPage.setReminder).toBeVisible()
    await ownershipPage.extendButton.click()
    await extendNamesModal.getExtendButton.click()
    await expect(page.getByText('Confirm Details')).toBeVisible()
  })
})

test.describe('Grace Period Wrapped 2LD', () => {
  test('Send feature', async ({ login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'grace-period-wrapped',
      type: 'wrapped',
      records: {
        coins: [
          {
            coin: 'etcLegacy',
            value: '0x42D63ae25990889E35F215bC95884039Ba354115',
          },
        ],
      },
      duration: -24 * 60 * 60,
    })

    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(name)
    await login.connect()

    await expect(ownershipPage.sendNameButton).toHaveCount(0)
  })

  test('Sync Manager', async ({ login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'grace-period-wrapped',
      type: 'wrapped',
      owner: 'user',
      records: {
        coins: [
          {
            coin: 'etcLegacy',
            value: '0x42D63ae25990889E35F215bC95884039Ba354115',
          },
        ],
      },
      duration: -24 * 60 * 60,
    })

    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(name)
    await login.connect()

    await expect(ownershipPage.syncManagerButton).toHaveCount(0)
  })

  test('Edit Roles', async ({ login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'grace-period-wrapped',
      type: 'wrapped',
      duration: -24 * 60 * 60,
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')
    const editRolesModal = makePageObject('EditRolesModal')

    await ownershipPage.goto(name)
    await login.connect()

    await ownershipPage.editRolesButton.click()

    await expect(editRolesModal.roleCardChangeButton('owner')).toHaveCount(0)
    await expect(editRolesModal.roleCardChangeButton('manager')).toHaveCount(0)

    await editRolesModal.roleCardChangeButton('eth-record').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()

    await editRolesModal.saveButton.click()
    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user'))).toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user'))).toContainText('owner')
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record')
  })

  test('Expiry Section, Extend & Set Reminder', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'grace-period-unwrapped',
      type: 'legacy',
      duration: -24 * 60 * 60,
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const extendNamesModal = makePageObject('ExtendNamesModal')

    await ownershipPage.goto(name)
    await login.connect()

    expect(await ownershipPage.getExpiryTimestamp()).toBeGreaterThan(0)
    await expect(ownershipPage.expiryPanelRegistrationDate).toHaveCount(1)
    await expect(ownershipPage.expiryPanelGracePeriod).toHaveCount(1)
    await expect(ownershipPage.expiryPanelParentExpiry).toHaveCount(0)
    await expect(ownershipPage.expiryPanelParentGracePeriod).toHaveCount(0)
    await expect(ownershipPage.setReminder).toBeVisible()
    await ownershipPage.extendButton.click()
    await extendNamesModal.getExtendButton.click()
    await expect(page.getByText('Confirm Details')).toBeVisible()
  })
})
