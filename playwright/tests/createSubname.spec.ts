import { expect } from '@playwright/test'

import { test } from '..'

test('should not show add subname button when the connected wallet is the registrant but not the controller', async ({
  page,
  wallet,
  nameGenerator,
  Login,
  SubnamesPage,
}) => {
  const name = await nameGenerator({
    label: 'other-controller',
    type: 'legacy',
    owner: 'user',
    manager: 'user2',
  })
  const subnamesPage = new SubnamesPage(page)
  await subnamesPage.goto(name)

  const login = new Login(page, wallet)
  await login.connect()

  await expect(subnamesPage.getAddSubnameButton).toHaveCount(0)
})

test('should not show add subname button when the connected wallet does not own the name', async ({
  page,
  wallet,
  nameGenerator,
  Login,
  SubnamesPage,
}) => {
  const name = await nameGenerator({
    label: 'other-registrant',
    type: 'legacy',
    owner: 'user2',
    manager: 'user2',
  })
  const subnamesPage = new SubnamesPage(page)
  await subnamesPage.goto(name)

  const login = new Login(page, wallet)
  await login.connect()

  await expect(subnamesPage.getAddSubnameButton).toHaveCount(0)
})

test('should show add subname button when the connected wallet is the manager', async ({
  page,
  wallet,
  nameGenerator,
  Login,
  SubnamesPage,
}) => {
  const name = await nameGenerator({
    label: 'manager-only',
    type: 'legacy',
    owner: 'user2',
    manager: 'user',
  })
  const subnamesPage = new SubnamesPage(page)
  await subnamesPage.goto(name)

  const login = new Login(page, wallet)
  await login.connect()

  await expect(subnamesPage.getAddSubnameButton).toHaveCount(1)
})

test('should not allow creating a subname with invalid characters', async ({
  page,
  wallet,
  nameGenerator,
  Login,
  SubnamesPage,
}) => {
  const name = await nameGenerator({
    label: 'manager-only',
    type: 'legacy',
    owner: 'user2',
    manager: 'user',
  })
  const subnamesPage = new SubnamesPage(page)
  await subnamesPage.goto(name)

  const login = new Login(page, wallet)
  await login.connect()

  await subnamesPage.getAddSubnameButton.click()
  await subnamesPage.getAddSubnameInput.type('invalid name')
  await expect(subnamesPage.getSubmitSubnameButton).toBeDisabled()
  await expect(page.locator('text=Contains invalid characters')).toBeVisible()
})

test('should allow creating a subname', async ({
  page,
  wallet,
  nameGenerator,
  Login,
  SubnamesPage,
  TransactionModal,
}) => {
  const name = await nameGenerator({
    label: 'manager-only',
    type: 'legacy',
    owner: 'user2',
    manager: 'user',
  })
  const subnamesPage = new SubnamesPage(page)
  await subnamesPage.goto(name)

  const login = new Login(page, wallet)
  await login.connect()

  await subnamesPage.getAddSubnameButton.click()
  await subnamesPage.getAddSubnameInput.type('test')
  await subnamesPage.getSubmitSubnameButton.click()

  const transactionModal = new TransactionModal(page, wallet)
  await transactionModal.autoComplete()

  await expect(page.locator(`text="test.${name}"`)).toBeVisible()
})

test('should allow creating a subnames if the user is the wrapped owner', async ({
  page,
  wallet,
  nameGenerator,
  Login,
  SubnamesPage,
  TransactionModal,
}) => {
  const name = await nameGenerator({
    label: 'wrapped',
    type: 'wrapped',
    owner: 'user',
  })
  const subnamesPage = new SubnamesPage(page)
  await subnamesPage.goto(name)

  const login = new Login(page, wallet)
  await login.connect()

  await subnamesPage.getAddSubnameButton.click()
  await subnamesPage.getAddSubnameInput.type('test')
  await subnamesPage.getSubmitSubnameButton.click()

  const transactionModal = new TransactionModal(page, wallet)
  await transactionModal.autoComplete()

  await expect(page.locator(`text="test.${name}"`)).toBeVisible()
})

test('should not allow adding a subname that already exists', async ({
  page,
  wallet,
  nameGenerator,
  Login,
  SubnamesPage,
}) => {
  const name = await nameGenerator({
    label: 'wrapped',
    type: 'wrapped',
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

  await subnamesPage.getAddSubnameButton.click()
  await subnamesPage.getAddSubnameInput.type('test')
  await expect(subnamesPage.getSubmitSubnameButton).toBeDisabled()
})

test('should allow creating an expired wrapped subname', async ({
  page,
  wallet,
  nameGenerator,
  Login,
  SubnamesPage,
  TransactionModal,
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
        owner: 'user',
        duration: -60 * 60 * 24 * 30,
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
  const subnamesPage = new SubnamesPage(page)
  await subnamesPage.goto(name)

  const login = new Login(page, wallet)
  await login.connect()

  await subnamesPage.getAddSubnameButton.click()
  await subnamesPage.getAddSubnameInput.type('test')
  await subnamesPage.getSubmitSubnameButton.click()

  const transactionModal = new TransactionModal(page, wallet)
  await transactionModal.autoComplete()

  await expect(page.locator(`text="test.${name}"`)).toBeVisible()
})

test('should allow creating an expired wrapped subname from the profile page', async ({
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
    fuses: {
      named: ['CANNOT_UNWRAP'],
    },
    subnames: [
      {
        label: 'test',
        owner: 'user',
        duration: -60 * 60 * 24 * 30,
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
  const profilePage = new ProfilePage(page)
  await profilePage.goto(`test.${name}`)

  const login = new Login(page, wallet)
  await login.connect()

  await page.pause()

  await profilePage.getRecreateButton.click()

  const transactionModal = new TransactionModal(page, wallet)
  await transactionModal.autoComplete()

  await expect(profilePage.getRecreateButton).toHaveCount(0)
})
