import { expect } from '@playwright/test'
import { waitForSubgraph } from 'playwright/fixtures/nameGenerator/utils/waitForSubgraph'

import { test } from '..'

test('should be able to delete subname', async ({
  page,
  wallet,
  provider,
  nameGenerator,
  Login,
  SubnamesPage,
  ProfilePage,
  TransactionModal,
}) => {
  const name = await nameGenerator({
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
  const subnamesPage = new SubnamesPage(page)
  await subnamesPage.goto(name)

  const login = new Login(page, wallet)
  await login.connect()

  await subnamesPage.getSubnameRow(`test.${name}`).click()

  const profilePage = new ProfilePage(page)
  expect(page.getByTestId('profile-actions')).toHaveCount(1)
  await profilePage.getDeleteSubnameButton.click()

  const transactionModal = new TransactionModal(page, wallet)
  await transactionModal.autoComplete()

  expect(page.getByTestId('profile-actions')).toHaveCount(0)
  await waitForSubgraph(provider)()

  await page.goBack()
  await expect(subnamesPage.getSubnameRow(`test.${name}`)).toHaveCount(0)
})

test.describe('wrapped subname', () => {
  test('should be able to delete subname as parent owner', async ({
    page,
    wallet,
    nameGenerator,
    Login,
    ProfilePage,
    TransactionModal,
  }) => {
    const name = await nameGenerator({
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

    const profilePage = new ProfilePage(page)
    await profilePage.goto(subname)

    const login = new Login(page, wallet)
    await login.connect()

    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveCount(1)

    await profilePage.getDeleteSubnameButton.click()

    const transactionModal = new TransactionModal(page, wallet)
    await transactionModal.autoComplete()

    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveCount(0)
  })

  test('should be able to delete subname as name owner', async ({
    page,
    wallet,
    nameGenerator,
    Login,
    ProfilePage,
    TransactionModal,
  }) => {
    const name = await nameGenerator({
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

    const profilePage = new ProfilePage(page)
    await profilePage.goto(subname)

    const login = new Login(page, wallet)
    await login.connect()

    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveCount(1)

    await profilePage.getDeleteSubnameButton.click()

    const transactionModal = new TransactionModal(page, wallet)
    await transactionModal.autoComplete()

    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveCount(0)
  })
})

test.describe('wrapped subname with PCC burned', () => {
  test('should NOT allow parent owner to delete', async ({
    page,
    wallet,
    nameGenerator,
    Login,
    ProfilePage,
  }) => {
    const name = await nameGenerator({
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
            child: {
              named: [],
            },
          },
        },
      ],
    })

    const subname = `test.${name}`

    const profilePage = new ProfilePage(page)
    await profilePage.goto(subname)

    const login = new Login(page, wallet)
    await login.connect()

    await expect(profilePage.getDeleteSubnameButton).toHaveCount(0)
  })

  test('should allow name owner to delete', async ({
    page,
    wallet,
    nameGenerator,
    Login,
    ProfilePage,
    TransactionModal,
  }) => {
    const name = await nameGenerator({
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
            child: {
              named: [],
            },
          },
        },
      ],
    })

    const subname = `test.${name}`

    const profilePage = new ProfilePage(page)
    await profilePage.goto(subname)

    const login = new Login(page, wallet)
    await login.connect()

    await page.pause()
    await profilePage.getDeleteSubnameButton.click()

    // Delete emancipated name warning
    await expect(page.locator('text="This subname cannot be recreated"')).toHaveCount(1)
    await page.getByTestId('delete-emancipated-subname-button').click()

    const transactionModal = new TransactionModal(page, wallet)
    await transactionModal.autoComplete()

    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveCount(0)
  })

  test('should not allow parent owner to delete if PCC is expired', async ({
    page,
    wallet,
    nameGenerator,
    Login,
    ProfilePage,
  }) => {
    const name = await nameGenerator({
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
          duration: -60 * 60 * 24,
          fuses: {
            parent: {
              named: ['PARENT_CANNOT_CONTROL'],
            },
            child: {
              named: [],
            },
          },
        },
      ],
    })

    const subname = `test.${name}`

    const profilePage = new ProfilePage(page)
    await profilePage.goto(subname)

    const login = new Login(page, wallet)
    await login.connect()

    await expect(profilePage.getDeleteSubnameButton).toHaveCount(0)
  })
})
