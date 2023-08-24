import { expect } from '@playwright/test'
import { test } from '@root/playwright'

test.describe('Happy', () => {
  test('Should allow owner to change manager', async ({
    page,
    login,
    makeName,
    accounts,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      manager: 'user2',
    })

    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')
    const sendNameModal = makePageObject('SendNameModal')

    await morePage.goto(name)
    await login.connect()

    await morePage.sendButton.click()
    await page.getByTestId('dogfood').type(accounts.getAddress('user3'))
    await page.getByTestId('manager-checkbox').click()
    await sendNameModal.clickNextButton()
    await transactionModal.autoComplete()

    await expect(page.getByTestId('owner-button-name-name.manager')).toHaveText(
      new RegExp(accounts.getAddress('user3', 4)),
    )
  })

  test('Should allow manager to change manager when they are not the owner', async ({
    page,
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

    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')
    const sendNameModal = makePageObject('SendNameModal')

    await morePage.goto(name)
    await login.connect()

    await morePage.sendButton.click()
    await page.getByTestId('manager-checkbox').click()

    // Should not allow the manager to change the owner
    await expect(page.getByTestId('Make Owner')).toHaveCount(0)
    await page.getByTestId('dogfood').type(accounts.getAddress('user3'))
    await sendNameModal.clickNextButton()

    await transactionModal.autoComplete()
    await expect(page.getByTestId('owner-button-name-name.manager')).toContainText(
      accounts.getAddress('user3', 4),
    )
  })

  test('Should allow owner to change owner', async ({
    page,
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

    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')
    const sendNameModal = makePageObject('SendNameModal')

    await morePage.goto(name)
    await login.connect()

    await morePage.sendButton.click()
    await page.getByTestId('owner-checkbox').click()
    await page.getByTestId('dogfood').type(accounts.getAddress('user3'))
    await sendNameModal.clickNextButton()

    await transactionModal.autoComplete()

    await expect(page.getByTestId('owner-button-name-name.owner')).toContainText(
      accounts.getAddress('user3', 4),
    )
  })

  test('Should allow owner to change manager if they are not the manager', async ({
    page,
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

    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')
    const sendNameModal = makePageObject('SendNameModal')

    await morePage.goto(name)
    await login.connect()
    // ()

    await morePage.sendButton.click()

    await page.getByTestId('manager-checkbox').click()
    await page.getByTestId('dogfood').type(accounts.getAddress('user3'))
    await sendNameModal.clickNextButton()

    await transactionModal.autoComplete()
    await expect(page.getByTestId('owner-button-name-name.manager')).toContainText(
      accounts.getAddress('user3', 4),
    )
  })

  test('Should allow owner to change owner and manager', async ({
    page,
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

    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')
    const sendNameModal = makePageObject('SendNameModal')

    await morePage.goto(name)
    await login.connect()

    await morePage.sendButton.click()

    await page.getByTestId('manager-checkbox').click()
    await page.getByTestId('owner-checkbox').click()
    await page.getByTestId('dogfood').type(accounts.getAddress('user3'))
    await sendNameModal.clickNextButton()
    await transactionModal.confirm()
    await sendNameModal.clickNextButton()
    await page.getByText('Back').click()

    // Should work after going back after first transaction
    await page.getByTestId('dogfood').type(accounts.getAddress('user3'))
    await page.getByTestId('manager-checkbox').click()
    await page.getByTestId('owner-checkbox').click()
    await sendNameModal.clickNextButton()

    await transactionModal.autoComplete()
    await expect(page.getByTestId('owner-button-name-name.owner')).toContainText(
      accounts.getAddress('user3', 4),
      { timeout: 15000 },
    )
    await expect(page.getByTestId('owner-button-name-name.manager')).toContainText(
      accounts.getAddress('user3', 4),
    )
  })
})

test.describe('Unwrapped subnames', () => {
  test('Should allow unwrapped subname to be sent by owner (setOwner)', async ({
    page,
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

    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')
    const sendNameModal = makePageObject('SendNameModal')

    await morePage.goto(subname)
    await login.connect()

    await morePage.sendButton.click()
    await page.getByTestId('manager-checkbox').click()
    await page.getByTestId('dogfood').type(accounts.getAddress('user3'))
    await sendNameModal.clickNextButton()

    await transactionModal.autoComplete()
    await expect(page.getByTestId('owner-button-name-name.manager')).toContainText(
      accounts.getAddress('user3', 4),
    )
  })

  test('Should allow unwrapped subname to be sent by unwrapped parent owner (setSubnodeOwner)', async ({
    page,
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

    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')
    const sendNameModal = makePageObject('SendNameModal')

    await morePage.goto(subname)
    await login.connect()

    await morePage.sendButton.click()
    await page.getByTestId('manager-checkbox').click()
    await page.getByTestId('dogfood').type(accounts.getAddress('user3'))
    await sendNameModal.clickNextButton()
    await transactionModal.autoComplete()
    await expect(page.getByTestId('owner-button-name-name.manager')).toContainText(
      accounts.getAddress('user3', 4),
    )
  })

  test('should NOT show send button when subname is wrapped and parent is unwrapped', async ({
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

    const morePage = makePageObject('MorePage')

    await morePage.goto(subname)
    await login.connect()

    await expect(morePage.sendButton).toHaveCount(0)
  })
})

test.describe('Unwrapped name', () => {
  test('should NOT show send button when parent is owner and not manager', async ({
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

    const morePage = makePageObject('MorePage')

    await morePage.goto(subname)
    await login.connect()

    await expect(morePage.sendButton).toHaveCount(0)
  })
})

test.describe('Wrapped subnames', () => {
  test('should allow namewrapper subname owner to send name', async ({
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
        },
      ],
    })

    const subname = `test.${name}`

    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')
    const sendNameModal = makePageObject('SendNameModal')

    await morePage.goto(subname)
    await login.connect()

    await morePage.sendButton.click()

    await page.getByTestId('manager-checkbox').click()
    await expect(page.getByText('Make manager')).toBeVisible()
    await page.getByTestId('dogfood').type(accounts.getAddress('user3'))
    await sendNameModal.clickNextButton()
    await transactionModal.autoComplete()

    await expect(page.getByTestId('owner-button-name-name.manager')).toContainText(
      accounts.getAddress('user3', 4),
    )
  })

  test('should allow parent owner to send name', async ({
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
        },
      ],
    })

    const subname = `test.${name}`

    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')
    const sendNameModal = makePageObject('SendNameModal')

    await morePage.goto(subname)
    await login.connect()

    await morePage.sendButton.click()
    await page.getByTestId('manager-checkbox').click()
    await expect(page.getByText('Make manager')).toBeVisible()
    await page.getByTestId('dogfood').type(accounts.getAddress('user3'))
    await sendNameModal.clickNextButton()
    await transactionModal.autoComplete()

    await expect(page.getByTestId('owner-button-name-name.manager')).toContainText(
      accounts.getAddress('user3', 4),
    )
  })
})

test.describe('Wrapped subname with PCC burned', () => {
  test('should NOT allow parent owner to transfer', async ({ login, makeName, makePageObject }) => {
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

    const morePage = makePageObject('MorePage')

    await morePage.goto(subname)
    await login.connect()

    await expect(morePage.sendButton).toHaveCount(0)
  })

  test('should allow name owner to transfer', async ({
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

    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')
    const sendNameModal = makePageObject('SendNameModal')

    await morePage.goto(subname)
    await login.connect()

    await morePage.sendButton.click()
    await page.getByTestId('owner-checkbox').click()
    await expect(page.getByText('Make owner')).toBeVisible()
    await page.getByTestId('dogfood').type(accounts.getAddress('user3'))
    await sendNameModal.clickNextButton()
    await transactionModal.autoComplete()

    await page.getByTestId('profile-tab').click()
    await expect(page.getByTestId('owner-profile-button-name.owner')).toContainText(
      accounts.getAddress('user3', 4),
    )
  })
})

test.describe('Wrapped name', () => {
  test('Should allow namewrapper owner to send name', async ({
    page,
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
    })

    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')
    const sendNameModal = makePageObject('SendNameModal')

    await morePage.goto(name)
    await login.connect()

    await morePage.sendButton.click()
    await page.getByTestId('owner-checkbox').click()
    await expect(page.getByText('Make owner')).toBeVisible()
    await page.getByTestId('dogfood').type(accounts.getAddress('user3'))
    await sendNameModal.clickNextButton()
    await transactionModal.autoComplete()
    await expect(page.getByTestId('owner-button-name-name.owner')).toContainText(
      accounts.getAddress('user3', 4),
    )
  })
})
