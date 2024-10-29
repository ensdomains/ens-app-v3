import { expect } from '@playwright/test'

import { test } from '../../../playwright'
import { Name } from '../../../playwright/fixtures/makeName'

test.describe('Unwrapped 4LD, Unwrapped 3LD,2LD - Parent Owner and Manager', () => {
  test('Send feature', async ({ login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            texts: [{ key: 'name', value: 'test' }],
            coins: [
              {
                coin: 'etcLegacy',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user',
            },
          ],
        },
      ],
    })
    const subname = `4ld.test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')
    const sendNameModal = makePageObject('SendNameModal')
    const transactionModal = makePageObject('TransactionModal')

    await ownershipPage.goto(subname)
    await login.connect()

    await ownershipPage.sendNameButton.click()
    await sendNameModal.searchInput.fill(accounts.getAddress('user3'))
    await sendNameModal.searchResult(accounts.getAddress('user3')).click()
    await expect(sendNameModal.resetProfileSwitch).not.toBeVisible()

    await sendNameModal.summaryHeader.click()
    test.step('Should not be able to reset profile since old resolver does not support VersionableResolver', async () => {
      await expect(sendNameModal.summaryItem('reset-profile')).toHaveCount(0)
    })
    test.step('Should not be able to send Owner', async () => {
      await expect(sendNameModal.summaryItem('owner')).toHaveCount(0)
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

    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).not.toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record', {
      timeout: 15000,
    })
  })

  test('Sync Manager', async ({ login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            texts: [{ key: 'name', value: 'test' }],
            coins: [
              {
                coin: 'etcLegacy',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user',
            },
          ],
        },
      ],
    })

    const subname = `4ld.test.${name}`
    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(subname)
    await login.connect()

    await expect(ownershipPage.syncManagerButton).not.toBeVisible()
  })

  test('Edit Roles', async ({ login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            texts: [{ key: 'name', value: 'test' }],
            coins: [
              {
                coin: 'etcLegacy',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user',
            },
          ],
        },
      ],
    })

    const subname = `4ld.test.${name}`
    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')
    const editRolesModal = makePageObject('EditRolesModal')

    await ownershipPage.goto(subname)
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
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).not.toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record', {
      timeout: 15000,
    })
  })

  test('Expiry Section, Extend & Set Reminder', async ({ login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            texts: [{ key: 'name', value: 'test' }],
            coins: [
              {
                coin: 'etcLegacy',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user',
            },
          ],
        },
      ],
    })

    const subname = `4ld.test.${name}`
    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(subname)
    await login.connect()

    await expect(ownershipPage.expiryPanelExpiry).toHaveCount(0)
    await expect(ownershipPage.expiryPanelGracePeriod).toHaveCount(0)
    await expect(ownershipPage.expiryPanelRegistrationDate).toHaveCount(0)
    await expect(ownershipPage.expiryPanelParentExpiry).toHaveCount(0)
    await expect(ownershipPage.expiryPanelParentGracePeriod).toHaveCount(0)

    await expect(ownershipPage.extendButton).toHaveCount(0)
    await expect(ownershipPage.setReminder).toHaveCount(0)
  })
})

test.describe('Unwrapped 4LD, Unwrapped 3LD,2LD - Manager Only', () => {
  test('Send feature', async ({ login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user2',
      subnames: [
        {
          label: 'test',
          owner: 'user2',
          records: {
            texts: [{ key: 'name', value: 'test' }],
            coins: [
              {
                coin: 'etcLegacy',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user',
            },
          ],
        },
      ],
    })
    const subname = `4ld.test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')
    const sendNameModal = makePageObject('SendNameModal')
    const transactionModal = makePageObject('TransactionModal')

    await ownershipPage.goto(subname)
    await login.connect()

    await ownershipPage.sendNameButton.click()
    await sendNameModal.searchInput.fill(accounts.getAddress('user3'))
    await sendNameModal.searchResult(accounts.getAddress('user3')).click()
    await expect(sendNameModal.resetProfileSwitch).not.toBeVisible()

    await sendNameModal.summaryHeader.click()
    test.step('Should not be able to reset profile since old resolver does not support VersionableResolver', async () => {
      await expect(sendNameModal.summaryItem('reset-profile')).toHaveCount(0)
    })
    test.step('Should not be able to send Owner', async () => {
      await expect(sendNameModal.summaryItem('owner')).toHaveCount(0)
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

    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).not.toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record', {
      timeout: 15000,
    })
  })

  test('Sync Manager', async ({ login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            texts: [{ key: 'name', value: 'test' }],
            coins: [
              {
                coin: 'etcLegacy',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user',
            },
          ],
        },
      ],
    })

    const subname = `4ld.test.${name}`
    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(subname)
    await login.connect()

    await expect(ownershipPage.syncManagerButton).not.toBeVisible()
  })

  test('Edit Roles', async ({ login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            texts: [{ key: 'name', value: 'test' }],
            coins: [
              {
                coin: 'etcLegacy',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user',
            },
          ],
        },
      ],
    })

    const subname = `4ld.test.${name}`
    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')
    const editRolesModal = makePageObject('EditRolesModal')

    await ownershipPage.goto(subname)
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
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).not.toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record', {
      timeout: 15000,
    })
  })

  test('Expiry Section, Extend & Set Reminder', async ({ login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            texts: [{ key: 'name', value: 'test' }],
            coins: [
              {
                coin: 'etcLegacy',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user',
            },
          ],
        },
      ],
    })

    const subname = `4ld.test.${name}`
    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(subname)
    await login.connect()

    await expect(ownershipPage.expiryPanelExpiry).toHaveCount(0)
    await expect(ownershipPage.expiryPanelGracePeriod).toHaveCount(0)
    await expect(ownershipPage.expiryPanelRegistrationDate).toHaveCount(0)
    await expect(ownershipPage.expiryPanelParentExpiry).toHaveCount(0)
    await expect(ownershipPage.expiryPanelParentGracePeriod).toHaveCount(0)

    await expect(ownershipPage.extendButton).toHaveCount(0)
    await expect(ownershipPage.setReminder).toHaveCount(0)
  })
})

test.describe('Unwrapped 4LD - Unwrapped 3LD,2LD - Parent only', () => {
  test('Send feature', async ({ login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            texts: [{ key: 'name', value: 'test' }],
            coins: [
              {
                coin: 'etcLegacy',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user2',
            },
          ],
        },
      ],
    })
    const subname = `4ld.test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')
    const sendNameModal = makePageObject('SendNameModal')
    const transactionModal = makePageObject('TransactionModal')

    await ownershipPage.goto(subname)
    await login.connect()

    await ownershipPage.sendNameButton.click()
    await sendNameModal.searchInput.fill(accounts.getAddress('user3'))
    await sendNameModal.searchResult(accounts.getAddress('user3')).click()
    await expect(sendNameModal.resetProfileSwitch).not.toBeVisible()

    await sendNameModal.summaryHeader.click()
    test.step('Should not be able to reset profile since old resolver does not support VersionableResolver', async () => {
      await expect(sendNameModal.summaryItem('reset-profile')).toHaveCount(0)
    })
    test.step('Should not be able to send Owner', async () => {
      await expect(sendNameModal.summaryItem('owner')).toHaveCount(0)
    })
    test.step('Should be able to send Manager', async () => {
      await expect(sendNameModal.summaryItem('manager')).toBeVisible()
    })
    test.step('Should not be able to send ETH record', async () => {
      await expect(sendNameModal.summaryItem('eth-record')).toHaveCount(0)
    })

    await sendNameModal.sendButton.click()
    await sendNameModal.confirmButton.click()

    await transactionModal.autoComplete()

    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).not.toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).not.toContainText(
      'ETH record',
      {
        timeout: 15000,
      },
    )
  })

  test('Sync Manager', async ({ login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            texts: [{ key: 'name', value: 'test' }],
            coins: [
              {
                coin: 'etcLegacy',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user2',
            },
          ],
        },
      ],
    })

    const subname = `4ld.test.${name}`
    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(subname)
    await login.connect()

    await expect(ownershipPage.syncManagerButton).not.toBeVisible()
  })

  test('Edit Roles', async ({ login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            texts: [{ key: 'name', value: 'test' }],
            coins: [
              {
                coin: 'etcLegacy',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user2',
            },
          ],
        },
      ],
    })

    const subname = `4ld.test.${name}`
    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')
    const editRolesModal = makePageObject('EditRolesModal')

    await ownershipPage.goto(subname)
    await login.connect()
    await ownershipPage.editRolesButton.click()

    await expect(editRolesModal.roleCardChangeButton('owner')).toHaveCount(0)

    await editRolesModal.roleCardChangeButton('manager').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()

    await expect(editRolesModal.roleCardChangeButton('eth-record')).toHaveCount(0)

    await editRolesModal.saveButton.click()
    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).not.toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).not.toContainText(
      'ETH record',
      {
        timeout: 15000,
      },
    )
  })

  test('Expiry Section, Extend & Set Reminder', async ({ login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            texts: [{ key: 'name', value: 'test' }],
            coins: [
              {
                coin: 'etcLegacy',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user2',
            },
          ],
        },
      ],
    })

    const subname = `4ld.test.${name}`
    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(subname)
    await login.connect()

    await expect(ownershipPage.expiryPanelExpiry).toHaveCount(0)
    await expect(ownershipPage.expiryPanelGracePeriod).toHaveCount(0)
    await expect(ownershipPage.expiryPanelRegistrationDate).toHaveCount(0)
    await expect(ownershipPage.expiryPanelParentExpiry).toHaveCount(0)
    await expect(ownershipPage.expiryPanelParentGracePeriod).toHaveCount(0)

    await expect(ownershipPage.extendButton).toHaveCount(0)
    await expect(ownershipPage.setReminder).toHaveCount(0)
  })
})

test.describe('Unwrapped 4LD - Wrapped 3LD,2LD - Parent Owner only', () => {
  test('Send feature', async ({ login, makeName, makePageObject, page }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'wrapped',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          type: 'wrapped',
          subnames: [
            {
              label: '4ld',
              owner: 'user2',
              type: 'legacy',
            },
          ],
        },
      ],
    })
    const subname = `4ld.test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(subname)
    await login.connect()

    await page.waitForTimeout(2000)
    await expect(ownershipPage.sendNameButton).toHaveCount(0)
    await expect(ownershipPage.editRolesButton).toHaveCount(0)
    await expect(ownershipPage.syncManagerButton).toHaveCount(0)
  })

  test('Expiry Section, Extend & Set Reminder', async ({ login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          type: 'legacy',
          records: {
            texts: [{ key: 'name', value: 'test' }],
            coins: [
              {
                coin: 'etcLegacy',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user2',
              type: 'legacy',
            },
          ],
        },
      ],
    })

    const subname = `4ld.test.${name}`
    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(subname)
    await login.connect()

    await expect(ownershipPage.expiryPanelExpiry).toHaveCount(0)
    await expect(ownershipPage.expiryPanelGracePeriod).toHaveCount(0)
    await expect(ownershipPage.expiryPanelRegistrationDate).toHaveCount(0)
    await expect(ownershipPage.expiryPanelParentExpiry).toHaveCount(0)
    await expect(ownershipPage.expiryPanelParentGracePeriod).toHaveCount(0)

    await expect(ownershipPage.extendButton).toHaveCount(0)
    await expect(ownershipPage.setReminder).toHaveCount(0)
  })
})

test.describe('Unwrapped 4LD, Wrapped 3LD,2LD - Manager Only', () => {
  test('Send feature', async ({ login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'wrapped',
      owner: 'user2',
      subnames: [
        {
          label: 'test',
          owner: 'user2',
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
          subnames: [
            {
              label: '4ld',
              owner: 'user',
              type: 'legacy',
            },
          ],
        },
      ],
    })
    const subname = `4ld.test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')
    const sendNameModal = makePageObject('SendNameModal')
    const transactionModal = makePageObject('TransactionModal')

    await ownershipPage.goto(subname)
    await login.connect()

    await ownershipPage.sendNameButton.click()
    await sendNameModal.searchInput.fill(accounts.getAddress('user3'))
    await sendNameModal.searchResult(accounts.getAddress('user3')).click()
    await expect(sendNameModal.resetProfileSwitch).toBeVisible()
    await sendNameModal.resetProfileSwitch.click()

    await sendNameModal.summaryHeader.click()
    test.step('Should be able to reset profile', async () => {
      await expect(sendNameModal.summaryItem('reset-profile')).toHaveCount(1)
    })
    test.step('Should not be able to send Owner', async () => {
      await expect(sendNameModal.summaryItem('owner')).toHaveCount(0)
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

    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).not.toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record', {
      timeout: 15000,
    })
  })

  test('Sync Manager', async ({ login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            texts: [{ key: 'name', value: 'test' }],
            coins: [
              {
                coin: 'etcLegacy',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user',
            },
          ],
        },
      ],
    })

    const subname = `4ld.test.${name}`
    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(subname)
    await login.connect()

    await expect(ownershipPage.syncManagerButton).not.toBeVisible()
  })

  test('Edit Roles', async ({ login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            texts: [{ key: 'name', value: 'test' }],
            coins: [
              {
                coin: 'etcLegacy',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user',
            },
          ],
        },
      ],
    })

    const subname = `4ld.test.${name}`
    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')
    const editRolesModal = makePageObject('EditRolesModal')

    await ownershipPage.goto(subname)
    await login.connect()
    await ownershipPage.editRolesButton.click()

    expect(editRolesModal.roleCardChangeButton('owner')).toHaveCount(0)

    await editRolesModal.roleCardChangeButton('manager').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()

    await editRolesModal.roleCardChangeButton('eth-record').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()

    await editRolesModal.saveButton.click()
    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).not.toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('manager', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record', {
      timeout: 15000,
    })
  })

  test('Expiry Section, Extend & Set Reminder', async ({ login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            texts: [{ key: 'name', value: 'test' }],
            coins: [
              {
                coin: 'etcLegacy',
                value: '0x42D63ae25990889E35F215bC95884039Ba354115',
              },
            ],
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user',
            },
          ],
        },
      ],
    })

    const subname = `4ld.test.${name}`
    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(subname)
    await login.connect()

    await expect(ownershipPage.expiryPanelExpiry).toHaveCount(0)
    await expect(ownershipPage.expiryPanelGracePeriod).toHaveCount(0)
    await expect(ownershipPage.expiryPanelRegistrationDate).toHaveCount(0)
    await expect(ownershipPage.expiryPanelParentExpiry).toHaveCount(0)
    await expect(ownershipPage.expiryPanelParentGracePeriod).toHaveCount(0)

    await expect(ownershipPage.extendButton).toHaveCount(0)
    await expect(ownershipPage.setReminder).toHaveCount(0)
  })
})

test.describe('Wrapped & Emancipated 4LD, Wrapped 3LD,2LD - Parent Owner and Manager', () => {
  test('Send feature', async ({ login, accounts, makeName, makePageObject }) => {
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
          owner: 'user2',
          fuses: {
            parent: {
              named: ['PARENT_CANNOT_CONTROL'],
            },
            child: {
              named: ['CANNOT_UNWRAP'],
            },
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user',
              fuses: {
                parent: {
                  named: ['PARENT_CANNOT_CONTROL'],
                },
              },
            },
          ],
        },
      ],
    } as unknown as Name)
    const subname = `4ld.test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')
    const sendNameModal = makePageObject('SendNameModal')
    const transactionModal = makePageObject('TransactionModal')

    await ownershipPage.goto(subname)
    await login.connect()

    await ownershipPage.sendNameButton.click()
    await sendNameModal.searchInput.fill(accounts.getAddress('user3'))
    await sendNameModal.searchResult(accounts.getAddress('user3')).click()

    await sendNameModal.summaryHeader.click()
    await expect(sendNameModal.resetProfileSwitch).toBeVisible()
    await sendNameModal.resetProfileSwitch.click()

    test.step('Should be able to reset profile', async () => {
      await expect(sendNameModal.summaryItem('reset-profile')).toBeVisible()
    })
    test.step('Should not be able to send Owner', async () => {
      await expect(sendNameModal.summaryItem('owner')).toBeVisible()
    })
    test.step('Should be able to send Manager', async () => {
      await expect(sendNameModal.summaryItem('manager')).not.toBeVisible()
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

    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).not.toContainText('manager', {
      timeout: 15000,
    })

    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record', {
      timeout: 15000,
    })
  })

  test('Sync Manager', async ({ login, makeName, makePageObject }) => {
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
          owner: 'user2',
          fuses: {
            parent: {
              named: ['PARENT_CANNOT_CONTROL'],
            },
            child: {
              named: ['CANNOT_UNWRAP'],
            },
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user',
              fuses: {
                parent: {
                  named: ['PARENT_CANNOT_CONTROL'],
                },
              },
            },
          ],
        },
      ],
    } as unknown as Name)

    const subname = `4ld.test.${name}`
    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(subname)
    await login.connect()

    await expect(ownershipPage.syncManagerButton).not.toBeVisible()
  })

  test('Edit Roles', async ({ login, accounts, makeName, makePageObject }) => {
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
          owner: 'user2',
          fuses: {
            parent: {
              named: ['PARENT_CANNOT_CONTROL'],
            },
            child: {
              named: ['CANNOT_UNWRAP'],
            },
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user',
              fuses: {
                parent: {
                  named: ['PARENT_CANNOT_CONTROL'],
                },
              },
            },
          ],
        },
      ],
    } as unknown as Name)

    const subname = `4ld.test.${name}`
    const ownershipPage = makePageObject('OwnershipPage')
    const transactionModal = makePageObject('TransactionModal')
    const editRolesModal = makePageObject('EditRolesModal')

    await ownershipPage.goto(subname)
    await login.connect()
    await ownershipPage.editRolesButton.click()

    await expect(editRolesModal.roleCardChangeButton('manager')).toHaveCount(0)

    await editRolesModal.roleCardChangeButton('owner').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()

    await editRolesModal.roleCardChangeButton('eth-record').click()
    await editRolesModal.searchInput.fill(accounts.getAddress('user3'))
    await editRolesModal.searchResult(accounts.getAddress('user3')).click()

    await editRolesModal.saveButton.click()
    await transactionModal.autoComplete()
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).not.toContainText('manager', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('owner', {
      timeout: 15000,
    })
    await expect(ownershipPage.roleRow(accounts.getAddress('user3'))).toContainText('ETH record', {
      timeout: 15000,
    })
  })

  test('Expiry Section, Extend & Set Reminder', async ({ login, makeName, makePageObject }) => {
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
          owner: 'user2',
          fuses: {
            parent: {
              named: ['PARENT_CANNOT_CONTROL'],
            },
            child: {
              named: ['CANNOT_UNWRAP'],
            },
          },
          subnames: [
            {
              label: '4ld',
              owner: 'user',
              fuses: {
                parent: {
                  named: ['PARENT_CANNOT_CONTROL'],
                },
              },
            },
          ],
        },
      ],
    } as unknown as Name)

    const subname = `4ld.test.${name}`
    const ownershipPage = makePageObject('OwnershipPage')

    await ownershipPage.goto(subname)
    await login.connect()

    await expect(ownershipPage.expiryPanelExpiry).toHaveCount(1)
    await expect(ownershipPage.expiryPanelGracePeriod).toHaveCount(0)
    await expect(ownershipPage.expiryPanelRegistrationDate).toHaveCount(0)
    await expect(ownershipPage.expiryPanelParentExpiry).toHaveCount(1)
    await expect(ownershipPage.expiryPanelParentGracePeriod).toHaveCount(0)

    expect(await ownershipPage.getExpiryTimestamp()).not.toBeNull()

    await expect(ownershipPage.extendButton).toHaveCount(0)
    await expect(ownershipPage.setReminder).toHaveCount(0)
  })
})
