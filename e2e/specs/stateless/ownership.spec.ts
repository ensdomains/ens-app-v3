import { expect } from '@playwright/test'

import { test } from '../../../playwright'

test.describe('Send name', () => {
  test('should be able to send owner, manager and eth-record of unwrapped 2ld name if you are the owner and manager on old resolver', async ({
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'other-manager',
      type: 'legacy',
      records: {
        coins: [
          {
            coin: 'eth',
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

    // Should not be able to reset profile since old resolver does not support VersionableResolver
    await sendNameModal.summaryHeader.click()
    await expect(sendNameModal.summaryItem('owner')).toBeVisible()
    await expect(sendNameModal.summaryItem('manager')).toBeVisible()
    await expect(sendNameModal.summaryItem('eth-record')).toBeVisible()
    await expect(sendNameModal.summaryItem('reset-profile')).toHaveCount(0)

    await sendNameModal.sendButton.click()
    await sendNameModal.confirmButton.click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager')
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record')
  })

  test('should be able to send owner and manager of an unwrapped 2ld name if you are the owner but not manager', async ({
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'other-manager',
      type: 'legacy',
      manager: 'user2',
      records: {
        coins: [
          {
            coin: 'eth',
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

    // Should not be able to reset profile since old resolver does not support VersionableResolver
    // Should not be able to set eth record because user is not the manager
    await sendNameModal.summaryHeader.click()
    await expect(sendNameModal.summaryItem('owner')).toBeVisible()
    await expect(sendNameModal.summaryItem('manager')).toBeVisible()
    await expect(sendNameModal.summaryItem('eth-record')).toHaveCount(0)
    await expect(sendNameModal.summaryItem('reset-profile')).toHaveCount(0)

    await sendNameModal.sendButton.click()
    await sendNameModal.confirmButton.click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager')
    await expect(ownershipPage.roleRow('0x42D63ae25990889E35F215bC95884039Ba354115')).toContainText(
      'ETH record',
    )
  })

  test('should not be able to send name if user is manager but not owner', async ({
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
      records: {
        coins: [
          {
            coin: 'eth',
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

  test('should be able to send owner, eth-record and reset profile of a wrapped 2ld name if you are the owner', async ({
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      records: {
        coins: [
          {
            coin: 'eth',
            value: '0x42D63ae25990889E35F215bC95884039Ba354115',
          },
        ],
        texts: [
          {
            key: 'name',
            value: 'test',
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
    await sendNameModal.resetProfileSwitch.check()

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

  test('should be able to send manager, eth-record of a unwrapped subname name if you are the manager', async ({
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'legacy',
      owner: 'user2',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            coins: [
              {
                coin: 'eth',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
            texts: [
              {
                key: 'name',
                value: 'test',
              },
            ],
          },
        },
      ],
    })
    const subname = `test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')
    const sendNameModal = makePageObject('SendNameModal')
    const transactionModal = makePageObject('TransactionModal')

    await ownershipPage.goto(subname)
    await login.connect()

    await ownershipPage.sendNameButton.click()
    await sendNameModal.searchInput.fill(accounts.getAddress('user3'))
    await sendNameModal.searchResult(accounts.getAddress('user3')).click()
    await expect(sendNameModal.resetProfileSwitch).toHaveCount(0)

    // Should not be able to set owner because name is unwrapped
    await sendNameModal.summaryHeader.click()
    await expect(sendNameModal.summaryItem('owner')).toHaveCount(0)
    await expect(sendNameModal.summaryItem('manager')).toBeVisible()
    await expect(sendNameModal.summaryItem('eth-record')).toBeVisible()
    await expect(sendNameModal.summaryItem('reset-profile')).toHaveCount(0)

    await sendNameModal.sendButton.click()
    await sendNameModal.confirmButton.click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).not.toContainText('owner')
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record')
  })

  test('should be able to send manager if user is parent owner and not manager of unwrapped subname', async ({
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'legacy',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user2',
          records: {
            coins: [
              {
                coin: 'eth',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
            texts: [
              {
                key: 'name',
                value: 'test',
              },
            ],
          },
        },
      ],
    })
    const subname = `test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')
    const sendNameModal = makePageObject('SendNameModal')
    const transactionModal = makePageObject('TransactionModal')

    await ownershipPage.goto(subname)
    await login.connect()

    await ownershipPage.sendNameButton.click()
    await sendNameModal.searchInput.fill(accounts.getAddress('user3'))
    await sendNameModal.searchResult(accounts.getAddress('user3')).click()
    await expect(sendNameModal.resetProfileSwitch).toHaveCount(0)

    // Should not be able to set owner because name is unwrapped
    // Should not be able to set eth record because user is not the manager
    // Should not be able to reset profile since old resolver does not support VersionableResolver
    await sendNameModal.summaryHeader.click()
    await expect(sendNameModal.summaryItem('owner')).toHaveCount(0)
    await expect(sendNameModal.summaryItem('manager')).toBeVisible()
    await expect(sendNameModal.summaryItem('eth-record')).toHaveCount(0)
    await expect(sendNameModal.summaryItem('reset-profile')).toHaveCount(0)

    await sendNameModal.sendButton.click()
    await sendNameModal.confirmButton.click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user'))).not.toContainText(
      'parent-owner',
    )
    await expect(ownershipPage.roleRow('0x42D63ae25990889E35F215bC95884039Ba354115')).toContainText(
      'ETH record',
    )
  })

  test('should be able to send manager and eth-record if user is manager and not parent owner of unwrapped subname', async ({
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'legacy',
      owner: 'user2',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            coins: [
              {
                coin: 'eth',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
            texts: [
              {
                key: 'name',
                value: 'test',
              },
            ],
          },
        },
      ],
    })
    const subname = `test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')
    const sendNameModal = makePageObject('SendNameModal')
    const transactionModal = makePageObject('TransactionModal')

    await ownershipPage.goto(subname)
    await login.connect()

    await ownershipPage.sendNameButton.click()
    await sendNameModal.searchInput.fill(accounts.getAddress('user3'))
    await sendNameModal.searchResult(accounts.getAddress('user3')).click()
    await expect(sendNameModal.resetProfileSwitch).toHaveCount(0)

    // Should not be able to set owner because name is unwrapped
    // Should not be able to set eth record because user is not the manager
    // Should not be able to reset profile since old resolver does not support VersionableResolver
    await sendNameModal.summaryHeader.click()
    await expect(sendNameModal.summaryItem('owner')).toHaveCount(0)
    await expect(sendNameModal.summaryItem('manager')).toBeVisible()
    await expect(sendNameModal.summaryItem('eth-record')).toBeVisible()
    await expect(sendNameModal.summaryItem('reset-profile')).toHaveCount(0)

    await sendNameModal.sendButton.click()
    await sendNameModal.confirmButton.click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager', {
      timeout: 15000,
    })

    await expect(ownershipPage.roleRow(accounts.getAddress('user2'))).toContainText('Parent owner')
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record')
  })

  test('should be able to send manager if user is parent owner and not manager of wrapped subname', async ({
    page,
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user2',
          records: {
            coins: [
              {
                coin: 'eth',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
            texts: [
              {
                key: 'name',
                value: 'test',
              },
            ],
          },
        },
      ],
    })
    const subname = `test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')
    const sendNameModal = makePageObject('SendNameModal')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(subname)
    await login.connect()
    await expect(profilePage.record('text', 'nickname')).toContainText('test')

    await ownershipPage.goto(subname)
    await ownershipPage.sendNameButton.click()
    await sendNameModal.searchInput.fill(accounts.getAddress('user3'))
    await sendNameModal.searchResult(accounts.getAddress('user3')).click()
    await expect(sendNameModal.resetProfileSwitch).toHaveCount(0)

    // Should not be able to set owner because name is unwrapped
    // Should not be able to set eth record because user is not the manager
    // Should not be able to reset profile since user is not manager
    await sendNameModal.summaryHeader.click()
    await expect(sendNameModal.summaryItem('owner')).toHaveCount(0)
    await expect(sendNameModal.summaryItem('manager')).toBeVisible()
    await expect(sendNameModal.summaryItem('eth-record')).toHaveCount(0)
    await expect(sendNameModal.summaryItem('reset-profile')).toHaveCount(0)

    await sendNameModal.sendButton.click()
    await sendNameModal.confirmButton.click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager', {
      timeout: 15000,
    })

    await expect(ownershipPage.roleRow(accounts.getAddress('user'))).toContainText('Parent owner')
    await expect(ownershipPage.roleRow('0x42D63ae25990889E35F215bC95884039Ba354115')).toContainText(
      'ETH record',
    )

    await profilePage.goto(subname)
    await page.waitForTimeout(2000)
    await expect(profilePage.record('text', 'nickname')).toContainText('test')
  })

  test('should be able to send manager and eth-record if user is manager and not parent owner of wrapped subname', async ({
    page,
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user2',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            coins: [
              {
                coin: 'eth',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
            texts: [
              {
                key: 'name',
                value: 'test',
              },
            ],
          },
        },
      ],
    })
    const subname = `test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')
    const sendNameModal = makePageObject('SendNameModal')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(subname)
    await login.connect()
    await expect(profilePage.record('text', 'nickname')).toContainText('test')

    await ownershipPage.goto(subname)
    await ownershipPage.sendNameButton.click()
    await sendNameModal.searchInput.fill(accounts.getAddress('user3'))
    await sendNameModal.searchResult(accounts.getAddress('user3')).click()
    await sendNameModal.resetProfileSwitch.click()

    // Should not be able to set owner because name is unwrapped
    // Should not be able to set eth record because user is not the manager
    await sendNameModal.summaryHeader.click()
    await expect(sendNameModal.summaryItem('owner')).toHaveCount(0)
    await expect(sendNameModal.summaryItem('manager')).toBeVisible()
    await expect(sendNameModal.summaryItem('eth-record')).toBeVisible()
    await expect(sendNameModal.summaryItem('reset-profile')).toBeVisible()

    await sendNameModal.sendButton.click()
    await sendNameModal.confirmButton.click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager', {
      timeout: 15000,
    })

    await expect(ownershipPage.roleRow(accounts.getAddress('user2'))).toContainText('Parent owner')
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record')

    await profilePage.goto(subname)
    await page.waitForTimeout(2000)
    await expect(profilePage.record('text', 'nickname')).toHaveCount(0)
  })

  test('should be able to send owner and eth-record if user is owner and not parent owner of emancipated subname', async ({
    page,
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user2',
      fuses: {
        named: ['CANNOT_UNWRAP'],
      },
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            coins: [
              {
                coin: 'eth',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
            texts: [
              {
                key: 'name',
                value: 'test',
              },
            ],
          },
          fuses: {
            parent: {
              named: ['PARENT_CANNOT_CONTROL'],
            },
          },
        },
      ],
    })
    const subname = `test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')
    const profilePage = makePageObject('ProfilePage')
    const sendNameModal = makePageObject('SendNameModal')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(subname)
    await login.connect()
    await expect(profilePage.record('text', 'nickname')).toContainText('test')

    await ownershipPage.goto(subname)
    await ownershipPage.sendNameButton.click()
    await sendNameModal.searchInput.fill(accounts.getAddress('user3'))
    await sendNameModal.searchResult(accounts.getAddress('user3')).click()
    await sendNameModal.resetProfileSwitch.check()

    // Should not be able to set owner because name is unwrapped
    // Should not be able to set eth record because user is not the manager
    // Should not be able to reset profile since old resolver does not support VersionableResolver
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

    await profilePage.goto(subname)
    await page.waitForTimeout(2000)
    await expect(profilePage.record('text', 'nickname')).toHaveCount(0)
  })
})

test.describe('Edit roles: Happy ', () => {
  test('Should allow owner to change manager', async ({
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      manager: 'user2',
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')
    const editRolesModal = makePageObject('EditRolesModal')

    await ownershipPage.goto(name)
    await login.connect()

    await ownershipPage.editRolesButton.click()
    await editRolesModal.roleCardChangeButton('manager').click()
    await editRolesModal.setToSelfButton.click()
    await editRolesModal.saveButton.click()
    await transactionModal.autoComplete()

    await expect(ownershipPage.roleRow(accounts.getAddress('user'))).toContainText('manager')
  })

  test('Should allow manager to change manager when they are not the owner', async ({
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
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

    // Should not allow the manager to change the owner
    await expect(editRolesModal.roleCard('owner')).toHaveCount(0)
    await editRolesModal.roleCardChangeButton('manager').click()

    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()
    await editRolesModal.saveButton.click()

    await transactionModal.autoComplete()

    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager')
  })

  test('Should allow owner to change owner', async ({
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
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
    await editRolesModal.saveButton.click()

    await transactionModal.autoComplete()

    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('owner')
  })

  test('Should allow owner to change manager if they are not the manager', async ({
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
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
    await editRolesModal.roleCardChangeButton('manager').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()
    await editRolesModal.saveButton.click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager')
  })

  test('Should allow owner to change owner and manager', async ({
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
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
    await editRolesModal.saveButton.click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager')
  })
})

test.describe('Edit roles: Unwrapped subnames', () => {
  test('Should allow unwrapped subname to be sent by owner (setOwner)', async ({
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user2',
      manager: 'user2',
      subnames: [
        {
          label: 'test',
          owner: 'user',
        },
      ],
    })

    const subname = `test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')
    const editRolesModal = makePageObject('EditRolesModal')

    await ownershipPage.goto(subname)
    await login.connect()

    await ownershipPage.editRolesButton.click()
    await editRolesModal.roleCardChangeButton('manager').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()
    await editRolesModal.saveButton.click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager')
  })

  test('Should allow unwrapped subname to be sent by unwrapped parent owner (setSubnodeOwner)', async ({
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      subnames: [
        {
          label: 'test',
          owner: 'user2',
        },
      ],
    })

    const subname = `test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')
    const editRolesModal = makePageObject('EditRolesModal')

    await ownershipPage.goto(subname)
    await login.connect()

    await ownershipPage.editRolesButton.click()
    await editRolesModal.roleCardChangeButton('manager').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()
    await editRolesModal.saveButton.click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager')
  })

  test('should NOT show send button when subname is wrapped and parent is unwrapped', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      subnames: [
        {
          label: 'test',
          type: 'wrapped',
          owner: 'user2',
        },
      ],
    })

    const subname = `test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(subname)
    await login.connect()

    await page.waitForTimeout(2000)
    await expect(ownershipPage.sendNameButton).toHaveCount(0)
    await expect(ownershipPage.editRolesButton).toHaveCount(0)
  })
})

test.describe('Edit roles: Unwrapped name', () => {
  test('should NOT show send button when parent is owner and not manager', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      manager: 'user2',
      subnames: [
        {
          label: 'test',
          owner: 'user2',
        },
      ],
    })

    const subname = `test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(subname)
    await login.connect()

    await page.waitForTimeout(2000)
    await expect(ownershipPage.sendNameButton).toHaveCount(0)
    await expect(ownershipPage.editRolesButton).toHaveCount(0)
  })
})

test.describe('Edit roles: Wrapped subnames', () => {
  test('should allow namewrapper subname owner to send name', async ({
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user2',
      subnames: [
        {
          label: 'test',
          owner: 'user',
        },
      ],
    })

    const subname = `test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')
    const editRolesModal = makePageObject('EditRolesModal')

    await ownershipPage.goto(subname)
    await login.connect()

    await ownershipPage.editRolesButton.click()

    await editRolesModal.roleCardChangeButton('manager').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()
    await editRolesModal.saveButton.click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager')
  })

  test('should allow parent owner to send name', async ({
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user2',
        },
      ],
    })

    const subname = `test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')
    const editRolesModal = makePageObject('EditRolesModal')

    await ownershipPage.goto(subname)
    await login.connect()

    await ownershipPage.editRolesButton.click()
    await editRolesModal.roleCardChangeButton('manager').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()
    await editRolesModal.saveButton.click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager')
  })
})

test.describe('Edit roles: Wrapped subname with PCC burned', () => {
  test('should NOT allow parent owner to transfer', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user',
      fuses: {
        named: ['CANNOT_UNWRAP'],
      },
      subnames: [
        {
          label: 'test',
          owner: 'user2',
          fuses: {
            parent: {
              named: ['PARENT_CANNOT_CONTROL'],
            },
          },
        },
      ],
    })

    const subname = `test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(subname)
    await login.connect()

    await page.waitForTimeout(2000)
    await expect(ownershipPage.sendNameButton).toHaveCount(0)
    await expect(ownershipPage.editRolesButton).toHaveCount(0)
  })

  test('should allow name owner to transfer', async ({
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user2',
      fuses: {
        named: ['CANNOT_UNWRAP'],
      },
      subnames: [
        {
          label: 'test',
          owner: 'user',
          fuses: {
            parent: {
              named: ['PARENT_CANNOT_CONTROL'],
            },
          },
        },
      ],
    })

    const subname = `test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')
    const editRolesModal = makePageObject('EditRolesModal')

    await ownershipPage.goto(subname)
    await login.connect()

    await ownershipPage.editRolesButton.click()
    await editRolesModal.roleCardChangeButton('owner').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()
    await editRolesModal.saveButton.click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('owner')
  })
})

test.describe('Edit roles: Wrapped name', () => {
  test('Should allow namewrapper owner to send name', async ({
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
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
    await editRolesModal.saveButton.click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('owner')
  })
})

test.describe('Extend name', () => {
  test('should be able to extend unwrapped name', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'legacy',
      type: 'legacy',
      owner: 'user2',
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const extendNamesModal = makePageObject('ExtendNamesModal')
    const transactionModal = makePageObject('TransactionModal')

    await ownershipPage.goto(name)
    await login.connect()

    const timestamp = await ownershipPage.getExpiryTimestamp()

    await ownershipPage.extendButton.click()

    await test.step('should show ownership warning', async () => {
      await expect(page.getByText(`You do not own ${name}`)).toBeVisible()
      await page.getByRole('button', { name: 'I understand' }).click()
    })
    await test.step('should show the correct price data', async () => {
      await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
      await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
      await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0034')
      await expect(page.getByText('1 year extension', { exact: true })).toBeVisible()
    })

    await test.step('should work correctly with plus minus control', async () => {
      await expect(extendNamesModal.getCounterMinusButton).toBeDisabled()
      await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
      await extendNamesModal.getCounterPlusButton.click()
      await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0065')
      await expect(page.getByText('2 years extension', { exact: true })).toBeVisible()
    })

    await test.step('should show correct fiat values', async () => {
      await extendNamesModal.getCurrencyToggle.click({ force: true })
      await expect(extendNamesModal.getInvoiceExtensionFee).toContainText(/\$10\.0/)
      await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('$0.13')
      await expect(extendNamesModal.getInvoiceTotal).toContainText(/\$10\.1/)
      await extendNamesModal.getCounterMinusButton.click()
      await expect(extendNamesModal.getInvoiceExtensionFee).toContainText(/\$5\.0/)
      await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('$0.13')
      await expect(extendNamesModal.getInvoiceTotal).toContainText(/\$5\.1/)
    })

    await test.step('should extend', async () => {
      await extendNamesModal.getExtendButton.click()
      await transactionModal.autoComplete()
      const newTimestamp = await ownershipPage.getExpiryTimestamp()
      expect(newTimestamp).toEqual(timestamp + 31536000000)
    })
  })
})

test.describe('Sync manager', () => {
  test('should be able to sync manager as owner of unwrapped 2ld', async ({
    page,
    login,
    accounts,
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
    const transactionModal = makePageObject('TransactionModal')

    await ownershipPage.goto(name)
    await login.connect()

    await ownershipPage.syncManagerButton.click()
    await page.getByRole('button', { name: 'Next' }).click()

    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user'))).toContainText('manager')
    await expect(ownershipPage.roleRow(accounts.getAddress('user'))).toContainText('owner')
  })
})
