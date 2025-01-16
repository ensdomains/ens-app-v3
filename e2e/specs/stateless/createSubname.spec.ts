import { expect } from '@playwright/test'

import { test } from '../../../playwright/index'

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
  test.slow()
  const name = await makeName({
    label: 'manager-only',
    type: 'legacy',
    owner: 'user2',
    manager: 'user',
  })

  const subnamesPage = makePageObject('SubnamesPage')
  const recordsPage = makePageObject('RecordsPage')

  await subnamesPage.goto(name)
  await login.connect()

  await subnamesPage.getAddSubnameButton.click()
  await subnamesPage.getAddSubnameInput.fill('test')
  await subnamesPage.getSubmitSubnameButton.click()
  await subnamesPage.addMoreToProfileButton.click()
  await page.getByTestId('profile-record-option-name').click()
  await page.getByTestId('profile-record-option-description').click()
  await page.getByTestId('add-profile-records-button').click()
  await page
    .getByTestId('profile-record-input-input-eth')
    .fill('0x42D63ae25990889E35F215bC95884039Ba354115')
  await page.getByTestId('profile-record-input-input-name').fill('Test Name')
  await page
    .getByTestId('profile-record-input-description')
    .getByRole('textbox')
    .fill('New profile')

  await subnamesPage.getSubmitSubnameProfileButton.click()

  const transactionModal = makePageObject('TransactionModal')
  await transactionModal.autoComplete()

  const subname = `test.${name}`
  await recordsPage.goto(subname)

  await expect(recordsPage.getRecordValue('text', 'name')).toHaveText('Test Name')
  await expect(recordsPage.getRecordValue('text', 'description')).toHaveText('New profile')
  await expect(recordsPage.getRecordValue('address', 'eth')).toHaveText(
    '0x42D63ae25990889E35F215bC95884039Ba354115',
  )
})

test('should allow creating a subnames if the user is the wrapped owner', async ({
  page,
  login,
  makeName,
  makePageObject,
}) => {
  test.slow()

  const name = await makeName({
    label: 'wrapped',
    type: 'wrapped',
  })
  const subnamesPage = makePageObject('SubnamesPage')
  const recordsPage = makePageObject('RecordsPage')
  await page.goto(`/${name}`)
  await login.connect()

  await page.getByTestId('subnames-tab').click()
  // await subnamesPage.goto(name)

  await subnamesPage.getAddSubnameButton.click()
  await subnamesPage.getAddSubnameInput.fill('test')
  await subnamesPage.getSubmitSubnameButton.click()

  await subnamesPage.addMoreToProfileButton.click()
  await page.getByTestId('profile-record-option-name').click()
  await page.getByTestId('profile-record-option-description').click()
  await page.getByTestId('add-profile-records-button').click()
  await page
    .getByTestId('profile-record-input-input-eth')
    .fill('0x42D63ae25990889E35F215bC95884039Ba354115')
  await page.getByTestId('profile-record-input-input-name').fill('Test Name')
  await page
    .getByTestId('profile-record-input-description')
    .getByRole('textbox')
    .fill('New profile')
  await subnamesPage.getSubmitSubnameProfileButton.click()

  const transactionModal = makePageObject('TransactionModal')
  await transactionModal.autoComplete()

  const subname = `test.${name}`

  await recordsPage.goto(subname)
  await expect(recordsPage.getRecordValue('text', 'name')).toHaveText('Test Name')
  await expect(recordsPage.getRecordValue('text', 'description')).toHaveText('New profile')
  await expect(recordsPage.getRecordValue('address', 'eth')).toHaveText(
    '0x42D63ae25990889E35F215bC95884039Ba354115',
  )
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

test('should allow creating an expired wrapped subname', async ({
  page,
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'wrapped',
    type: 'wrapped',
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
        },
      },
    ],
  })
  const subname = `test.${name}`

  const profilePage = makePageObject('ProfilePage')
  const subnamesPage = makePageObject('SubnamesPage')
  const transactionModal = makePageObject('TransactionModal')

  await profilePage.goto(subname)
  await login.connect()
  await expect(
    page.getByText('This subname has expired and is not owned. You can recreate this subname.'),
  ).toBeVisible()

  await subnamesPage.goto(name)
  await subnamesPage.getAddSubnameButton.click()
  await subnamesPage.getAddSubnameInput.fill('test')
  await subnamesPage.getSubmitSubnameButton.click()
  await subnamesPage.getSubmitSubnameProfileButton.click()

  await transactionModal.autoComplete()

  await profilePage.goto(subname)
  await expect(page.getByTestId('owner-profile-button-name.manager')).toBeVisible()
})

test('should allow creating an expired wrapped subname from the profile page', async ({
  page,
  makeName,
  login,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'wrapped',
    type: 'wrapped',
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
        },
      },
    ],
  })

  const subname = `test.${name}`

  const profilePage = makePageObject('ProfilePage')
  const transactionModal = makePageObject('TransactionModal')

  await profilePage.goto(subname)

  await login.connect()

  await profilePage.getRecreateButton.click()

  await page.getByTestId('reclaim-profile-next').click()

  await transactionModal.autoComplete()

  await expect(profilePage.getRecreateButton).toHaveCount(0)
})

test('should allow skipping records when creating a subname', async ({
  page,
  makeName,
  login,
  makePageObject,
}) => {
  test.slow()
  const name = await makeName({
    label: 'manager-only',
    type: 'legacy',
    owner: 'user',
    manager: 'user',
  })

  const subnamesPage = makePageObject('SubnamesPage')

  await subnamesPage.goto(name)
  await login.connect()

  await subnamesPage.getAddSubnameButton.click()
  await subnamesPage.getAddSubnameInput.fill('test')
  await subnamesPage.getSubmitSubnameButton.click()
  expect(subnamesPage.addMoreToProfileButton).toBeVisible()
  await page.getByTestId('create-subname-profile-next').click()

  const transactionModal = makePageObject('TransactionModal')
  await transactionModal.autoComplete()

  const subname = `test.${name}`

  await expect(page).toHaveURL(new RegExp(`/${subname}`), { timeout: 15000 })
  await expect(page.getByTestId('profile-empty-banner')).toBeVisible()
})
