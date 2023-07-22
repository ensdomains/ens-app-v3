import { expect } from '@playwright/test'

import { test } from '..'

test('should be able to delete subname', async ({
  page,
  login,
  subgraph,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'with-subnames',
    type: 'legacy',
    owner: 'user',
    subnames: [
      {
        label: 'test',
        owner: 'user',
      },
    ],
  })
  const subnamesPage = makePageObject('SubnamesPage')
  const transactionModal = makePageObject('TransactionModal')

  await subnamesPage.goto(name)

  await login.connect()

  await subnamesPage.getSubnameRow(`test.${name}`).click()

  const profilePage = makePageObject('ProfilePage')
  expect(page.getByTestId('profile-actions')).toHaveCount(1)
  await profilePage.getDeleteSubnameButton.click()

  await transactionModal.autoComplete()

  expect(page.getByTestId('profile-actions')).toHaveCount(0)
  await subgraph.sync()

  await page.goBack()
  await expect(subnamesPage.getSubnameRow(`test.${name}`)).toHaveCount(0)
})

test.describe('wrapped subname', () => {
  test('should be able to delete subname as parent owner', async ({
    page,
    makeName,
    login,
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

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(subname)

    await login.connect()

    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveCount(1)

    await profilePage.getDeleteSubnameButton.click()

    await transactionModal.autoComplete()

    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveCount(0)
  })

  test('should be able to delete subname as name owner', async ({
    page,
    makeName,
    login,
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

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(subname)

    await login.connect()

    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveCount(1)

    await profilePage.getDeleteSubnameButton.click()

    await transactionModal.autoComplete()

    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveCount(0)
  })
})

test.describe('wrapped subname with PCC burned', () => {
  test('should NOT allow parent owner to delete', async ({ makeName, login, makePageObject }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user',
      fuses: ['CANNOT_UNWRAP'],
      subnames: [
        {
          label: 'test',
          owner: 'user2',
          fuses: ['PARENT_CANNOT_CONTROL'],
        },
      ],
    })

    const subname = `test.${name}`

    const profilePage = makePageObject('ProfilePage')
    await profilePage.goto(subname)

    await login.connect()

    await expect(profilePage.getDeleteSubnameButton).toHaveCount(0)
  })

  test('should allow name owner to delete', async ({ page, makeName, login, makePageObject }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user2',
      fuses: ['CANNOT_UNWRAP'],
      subnames: [
        {
          label: 'test',
          owner: 'user',
          fuses: ['PARENT_CANNOT_CONTROL'],
        },
      ],
    })

    const subname = `test.${name}`

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(subname)

    await login.connect()

    await page.pause()
    await profilePage.getDeleteSubnameButton.click()

    // Delete emancipated name warning
    await expect(page.locator('text="This subname cannot be recreated"')).toHaveCount(1)
    await page.getByTestId('delete-emancipated-subname-button').click()

    await transactionModal.autoComplete()

    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveCount(0)
  })

  test('should not allow parent owner to delete if PCC is expired', async ({
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user',
      fuses: ['CANNOT_UNWRAP'],
      subnames: [
        {
          label: 'test',
          owner: 'user2',
          duration: -60 * 60 * 24,
          fuses: ['PARENT_CANNOT_CONTROL'],
        },
      ],
    })

    const subname = `test.${name}`

    const profilePage = makePageObject('ProfilePage')
    await profilePage.goto(subname)

    await login.connect()

    await expect(profilePage.getDeleteSubnameButton).toHaveCount(0)
  })
})
