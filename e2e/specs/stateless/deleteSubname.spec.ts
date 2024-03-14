import { expect } from '@playwright/test'

import { test } from '../../../playwright/index'

test.describe('unwrapped', () => {
  test('allows deletion when parent owner but NOT child owner', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped-to-delete',
      type: 'legacy',
      subnames: [
        {
          label: 'parent-not-child',
          owner: 'user2',
        },
      ],
    })
    const subname = `parent-not-child.${name}`

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(subname)
    await login.connect()

    // Manager button should exist
    await expect(page.getByTestId('owner-profile-button-name.manager')).toBeVisible()

    await page.getByTestId('profile-action-Delete subname').click()
    await transactionModal.autoComplete()

    // Button should not exist
    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveCount(0)
  })

  test('allows deletion when parent owner and child owner', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped-to-delete',
      type: 'legacy',
      subnames: [
        {
          label: 'parent-child',
          type: 'legacy',
        },
      ],
    })
    const subname = `parent-child.${name}`

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(subname)
    await login.connect()

    // Manager button should exist
    await expect(page.getByTestId('owner-profile-button-name.manager')).toBeVisible()

    await page.getByTestId('profile-action-Delete subname').click()
    await transactionModal.autoComplete()

    // Button should not exist
    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveCount(0)
  })

  test('allows deletion when NOT parent owner, but child owner', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped-to-delete',
      type: 'legacy',
      owner: 'user2',
      subnames: [
        {
          label: 'not-parent-child',
          type: 'legacy',
          owner: 'user',
        },
      ],
    })
    const subname = `not-parent-child.${name}`

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(subname)
    await login.connect()

    // Manager button should exist
    await expect(page.getByTestId('owner-profile-button-name.manager')).toBeVisible()

    await page.getByTestId('profile-action-Delete subname').click()
    await page.getByTestId('delete-subname-not-parent-button').click()
    await transactionModal.autoComplete()

    // Button should not exist
    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveCount(0)
  })
})

test.describe('wrapped', () => {
  test('allows deletion when parent owner but NOT child owner', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped-to-delete',
      type: 'wrapped',
      subnames: [
        {
          label: 'parent-not-child',
          owner: 'user2',
        },
      ],
    })
    const subname = `parent-not-child.${name}`

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(subname)
    await login.connect()

    // Manager button should exist
    await expect(page.getByTestId('owner-profile-button-name.manager')).toBeVisible()

    await page.getByTestId('profile-action-Delete subname').click()
    await transactionModal.autoComplete()

    // Button should not exist
    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveCount(0)
  })

  test('allows deletion when parent owner and child owner', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped-to-delete',
      owner: 'user',
      type: 'wrapped',
      subnames: [
        {
          label: 'parent-child',
          owner: 'user',
          type: 'wrapped',
        },
      ],
    })
    const subname = `parent-child.${name}`

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(subname)
    await login.connect()

    // Manager button should exist
    await expect(page.getByTestId('owner-profile-button-name.manager')).toBeVisible()

    await page.getByTestId('profile-action-Delete subname').click()
    await transactionModal.autoComplete()

    // Button should not exist
    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveCount(0)
  })

  test('allows deletion when NOT parent owner, but child owner', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped-to-delete',
      type: 'wrapped',
      owner: 'user2',
      subnames: [
        {
          label: 'not-parent-child',
          type: 'wrapped',
          owner: 'user',
        },
      ],
    })
    const subname = `not-parent-child.${name}`

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(subname)
    await login.connect()

    // Manager button should exist
    await expect(page.getByTestId('owner-profile-button-name.manager')).toBeVisible()

    await page.getByTestId('profile-action-Delete subname').click()
    await page.getByTestId('delete-subname-not-parent-button').click()
    await transactionModal.autoComplete()

    // Button should not exist
    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveCount(0)
  })
})

test.describe('emancipated', () => {
  test('does NOT allow deletion when parent owner but NOT child owner', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'emancipated-to-delete',
      type: 'wrapped',
      owner: 'user',
      fuses: {
        named: ['CANNOT_UNWRAP'],
      },
      subnames: [
        {
          label: 'parent-not-child',
          owner: 'user2',
          fuses: {
            parent: {
              named: ['PARENT_CANNOT_CONTROL'],
            },
          },
        },
      ],
    })
    const subname = `parent-not-child.${name}`

    const profilePage = makePageObject('ProfilePage')

    await profilePage.goto(subname)
    await login.connect()

    // Owner button should exist
    await expect(page.getByTestId('owner-profile-button-name.owner')).toBeVisible()

    // Delete should not exist
    await expect(page.getByTestId('profile-action-Delete subname')).toHaveCount(0)
  })

  test('allows deletion when parent owner and child owner', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'emancipated-to-delete',
      type: 'wrapped',
      owner: 'user',
      fuses: {
        named: ['CANNOT_UNWRAP'],
      },
      subnames: [
        {
          label: 'parent-child',
          owner: 'user',
          fuses: {
            parent: {
              named: ['PARENT_CANNOT_CONTROL'],
            },
          },
        },
      ],
    })
    const subname = `parent-child.${name}`

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(subname)
    await login.connect()

    // Owner button should exist
    await expect(page.getByTestId('owner-profile-button-name.owner')).toBeVisible()

    await page.getByTestId('profile-action-Delete subname').click()
    await page.getByTestId('delete-emancipated-subname-button').click()

    await transactionModal.autoComplete()

    // Owner button should not exist
    await expect(page.getByTestId('owner-profile-button-name.owner')).toHaveCount(0)
  })

  test('allows deletion when NOT parent owner, but child owner', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'emancipated-to-delete',
      type: 'wrapped',
      owner: 'user2',
      fuses: {
        named: ['CANNOT_UNWRAP'],
      },
      subnames: [
        {
          label: 'not-parent-child',
          owner: 'user',
          fuses: {
            parent: {
              named: ['PARENT_CANNOT_CONTROL'],
            },
          },
        },
      ],
    })
    const subname = `not-parent-child.${name}`

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(subname)
    await login.connect()

    // Owner button should exist
    await expect(page.getByTestId('owner-profile-button-name.owner')).toBeVisible()

    await page.getByTestId('profile-action-Delete subname').click()
    await page.getByTestId('delete-emancipated-subname-button').click()

    await transactionModal.autoComplete()

    // Owner button should not exist
    await expect(page.getByTestId('owner-profile-button-name.owner')).toHaveCount(0)
  })
})

test('should not allow parent owner to delete if PCC is expired', async ({
  page,
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'wrapped-expired-subname',
    type: 'wrapped',
    owner: 'user',
    fuses: {
      named: ['CANNOT_UNWRAP'],
    },
    subnames: [
      {
        label: 'day-expired',
        owner: 'user',
        duration: -24 * 60 * 60,
        fuses: {
          parent: {
            named: ['PARENT_CANNOT_CONTROL'],
          },
        },
      },
    ],
  })
  const subname = `day-expired.${name}`

  const profilePage = makePageObject('ProfilePage')

  await profilePage.goto(subname)
  await login.connect()
  // this is because once PCC expires, the name is effectively deleted
  await expect(page.getByTestId('profile-action-Delete subname')).toHaveCount(0)
})

test.describe('subgraph errors', () => {
  test('should disable delete button for unwrapped subname', async ({
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
          type: 'legacy',
        },
      ],
    })
    const subname = `test.${name}`

    const profilePage = makePageObject('ProfilePage')

    await profilePage.goto(subname)
    await login.connect()

    await expect(profilePage.deleteSubnameButton).toBeVisible()

    await page.goto('/my/settings')
    await page.getByTestId('subgraph-network-error').check()

    await profilePage.goto(subname)
    await expect(profilePage.disabledDeleteSubnameButton).toBeVisible()

    await page.goto('/my/settings')
    await page.getByTestId('subgraph-network-error').uncheck()
  })

  test('should disable delete button for wrapped subname', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'wrapped',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user',
        },
      ],
    })
    const subname = `test.${name}`

    const profilePage = makePageObject('ProfilePage')

    await profilePage.goto(subname)
    await login.connect()

    await expect(profilePage.deleteSubnameButton).toBeVisible()

    await page.goto('/my/settings')
    await page.getByTestId('subgraph-network-error').check()

    await profilePage.goto(subname)
    await expect(profilePage.disabledDeleteSubnameButton).toBeVisible()

    await page.goto('/my/settings')
    await page.getByTestId('subgraph-network-error').uncheck()
  })
})
