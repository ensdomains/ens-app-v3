import { expect } from '@playwright/test'

import { test } from '../../../../playwright/index'

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

  await transactionModal.autoComplete()

  await profilePage.goto(subname)
  await expect(page.getByTestId('owner-profile-button-name.manager')).toBeVisible()
})

test('should allow creating an expired wrapped subname from the profile page', async ({
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

  await transactionModal.autoComplete()

  await expect(profilePage.getRecreateButton).toHaveCount(0)
})
