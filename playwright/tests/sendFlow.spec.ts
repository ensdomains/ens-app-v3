import { expect } from '@playwright/test'

import { test } from '..'

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

    await morePage.goto(name)
    await login.connect()

    await morePage.sendButton.click()

    await page.getByTestId('dogfood').type(accounts.getAddress('user3'))
    await page.getByTestId('owner-checkbox').click()
    await page.getByText('Next').click()
    await transactionModal.autoComplete()

    await expect(page.getByTestId('owner-button-name-name.manager')).toHaveText(/0xf39...92266/)
  })

  test('Should allow manager to change manager when they are not the owner', async ({
    page,
    login,
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

    await morePage.goto(name)
    await login.connect()

    await morePage.sendButton.click()

    // Should not allow the manager to change the owner
    await expect(page.getByTestId('Make Owner')).toHaveCount(0)
    await page.getByTestId('dogfood').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    await page.getByText('Next').click()

    await transactionModal.autoComplete()
    await expect(page.getByTestId('owner-button-name-name.manager')).toHaveText(/0x709...c79C8/)
  })

  test('Should allow owner to change owner', async ({ page, login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      manager: 'user2',
    })

    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await morePage.sendButton.click()
    await page.getByTestId('manager-checkbox').click()
    await page.getByTestId('dogfood').type('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    await page.getByText('Next').click()

    await transactionModal.autoComplete()

    await expect(page.getByTestId('owner-button-name-name.owner')).toHaveText(/0xf39...92266/)
  })

  test('Should allow owner to change manager if they are not the manager', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      manager: 'user2',
    })

    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await morePage.sendButton.click()

    await page.getByTestId('owner-checkbox').click()
    await page.getByTestId('dogfood').type('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    await page.getByText('Next').click()
    await transactionModal.autoComplete()
    await expect(page.getByTestId('owner-button-name-name.manager')).toHaveText(/0xf39...92266/)
  })

  test('Should allow owner to change owner and manager', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      manager: 'user2',
    })

    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await morePage.sendButton.click()

    await page.getByTestId('dogfood').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    await page.getByText('Next').click()
    await transactionModal.confirm()
    await page.getByText('Next').click()
    await page.getByText('Back').click()

    // Should work after going back after first transaction
    await page.getByTestId('dogfood').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    await page.getByText('Next').click()
    await transactionModal.autoComplete()
    await expect(page.getByTestId('owner-button-name-name.owner')).toHaveText(/0x709...c79C8/)
    await expect(page.getByTestId('owner-button-name-name.manager')).toHaveText(/0x709...c79C8/)
  })
})

test.describe('Unwrapped subnames', () => {
  test('Should allow unwrapped subname to be sent by owner (setOwner)', async ({
    page,
    login,
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

    await morePage.goto(subname)
    await login.connect()

    await morePage.sendButton.click()
    await page.getByTestId('dogfood').type('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    await page.getByText('Next').click()
    await transactionModal.autoComplete()
    await expect(page.getByTestId('owner-button-name-name.manager')).toHaveText(/0xf39...92266/)
  })

  test('Should allow unwrapped subname to be sent by unwrapped parent owner (setSubnodeOwner)', async ({
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
          owner: 'user2',
        },
      ],
    })

    const subname = `test.${name}`

    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(subname)
    await login.connect()

    await morePage.sendButton.click()
    await page.getByTestId('dogfood').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    await page.getByText('Next').click()
    await transactionModal.autoComplete()
    await expect(page.getByTestId('owner-button-name-name.manager')).toHaveText(/0x709...c79C8/)
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

    await morePage.goto(subname)
    await login.connect()

    await morePage.sendButton.click()

    await expect(page.getByText('Make manager')).toBeVisible()
    await page.getByTestId('dogfood').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    await page.getByText('Next').click()
    await transactionModal.autoComplete()

    await expect(page.getByTestId('owner-button-name-name.manager')).toHaveText(/0x709...c79C8/)
  })

  test('should allow parent owner to send name', async ({
    page,
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
          owner: 'user2',
        },
      ],
    })

    const subname = `test.${name}`

    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(subname)
    await login.connect()

    await morePage.sendButton.click()
    await expect(page.getByText('Make manager')).toBeVisible()
    await page.getByTestId('dogfood').type('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    await page.getByText('Next').click()
    await transactionModal.autoComplete()

    await expect(page.getByTestId('owner-button-name-name.manager')).toHaveText(/0xf39...92266/)
  })
})

test.describe('Wrapped subname with PCC burned', () => {
  test('should NOT allow parent owner to transfer', async ({ login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
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

  test('should allow name owner to transfer', async ({ page, login, makeName, makePageObject }) => {
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

    await morePage.goto(subname)
    await login.connect()

    await expect(morePage.sendButton).toHaveCount(0)
    await expect(page.getByText('Make owner')).toBeVisible()
    await page.getByTestId('dogfood').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    await page.getByText('Next').click()
    await transactionModal.autoComplete()

    await page.getByTestId('profile-tab').click()
    await expect(page.getByTestId('owner-profile-button-name.owner')).toHaveText(
      /owner0x709...c79C8/,
    )
  })
})

test.describe('Wrapped name', () => {
  test('Should allow namewrapper owner to send name', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
    })

    const subname = `test.${name}`

    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(subname)
    await login.connect()

    await morePage.sendButton.click()
    await expect(page.getByText('Make owner')).toBeVisible()
    await page.getByTestId('dogfood').type('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    await page.getByText('Next').click()
    await transactionModal.autoComplete()
    await expect(page.getByTestId('owner-button-name-name.owner')).toHaveText(/0xf39...92266/)
  })
})
