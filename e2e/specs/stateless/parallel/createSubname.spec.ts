import { expect } from '@playwright/test'

import { test } from '../../../../playwright'

test('should not show add subname button when the connected wallet is the registrant but not the controller', async ({
  page,
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'other-controller',
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
    subnames: [
      {
        label: 'test',
        owner: 'user',
        type: 'legacy',
      },
    ],
  })
  const subnamesPage = makePageObject('SubnamesPage')

  await subnamesPage.goto(name)
  await login.connect()

  await page.waitForTimeout(3000)
  await expect(subnamesPage.getAddSubnameButton).toHaveCount(0)
})

test('should not show add subname button when the connected wallet does not own the name', async ({
  page,
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'other-registrant',
    type: 'legacy',
    owner: 'user2',
  })
  const subnamesPage = makePageObject('SubnamesPage')

  await subnamesPage.goto(name)
  await login.connect()

  await page.waitForTimeout(3000)
  await expect(subnamesPage.getAddSubnameButton).toHaveCount(0)
})

test('should show add subname button when the connected wallet is the manager', async ({
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'manager-only',
    type: 'legacy',
    owner: 'user2',
    manager: 'user',
  })
  const subnamesPage = makePageObject('SubnamesPage')

  await subnamesPage.goto(name)

  await login.connect()

  await expect(subnamesPage.getAddSubnameButton).toHaveCount(1)
})

test('should not allow creating a subname with invalid characters', async ({
  page,
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'manager-only',
    type: 'legacy',
    owner: 'user2',
    manager: 'user',
  })
  const subnamesPage = makePageObject('SubnamesPage')

  await subnamesPage.goto(name)
  await login.connect()

  await subnamesPage.getAddSubnameButton.click()
  await subnamesPage.getAddSubnameInput.type('invalid name')
  await expect(subnamesPage.getSubmitSubnameButton).toBeDisabled()
  await expect(page.getByText('Contains invalid characters')).toBeVisible()
})

test('should allow creating a subname', async ({ page, makeName, login, makePageObject }) => {
  const name = await makeName({
    label: 'manager-only',
    type: 'legacy',
    owner: 'user2',
    manager: 'user',
  })

  const subnamesPage = makePageObject('SubnamesPage')

  await subnamesPage.goto(name)
  await login.connect()

  await subnamesPage.getAddSubnameButton.click()
  await subnamesPage.getAddSubnameInput.type('test')
  await subnamesPage.getSubmitSubnameButton.click()

  const transactionModal = makePageObject('TransactionModal')
  await transactionModal.autoComplete()

  await expect(page.getByText(`test.${name}`)).toBeVisible({ timeout: 15000 })
})

test('should allow creating a subnames if the user is the wrapped owner', async ({
  page,
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'wrapped',
    type: 'wrapped',
  })
  const subnamesPage = makePageObject('SubnamesPage')

  await page.goto(`/${name}`)
  await login.connect()

  await page.getByTestId('subnames-tab').click()
  // await subnamesPage.goto(name)

  await subnamesPage.getAddSubnameButton.click()
  await subnamesPage.getAddSubnameInput.fill('test')
  await subnamesPage.getSubmitSubnameButton.click()

  const transactionModal = makePageObject('TransactionModal')
  await transactionModal.autoComplete()

  await expect(page.getByText(`test.${name}`)).toBeVisible({ timeout: 15000 })
})

test('should not allow adding a subname that already exists', async ({
  login,
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
        owner: 'user',
      },
    ],
  })
  const subnamesPage = makePageObject('SubnamesPage')
  await subnamesPage.goto(name)

  await login.connect()

  await subnamesPage.getAddSubnameButton.click()
  await subnamesPage.getAddSubnameInput.fill('test')
  await expect(subnamesPage.getSubmitSubnameButton).toBeDisabled()
})
