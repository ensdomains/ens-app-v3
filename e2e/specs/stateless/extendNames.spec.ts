/* eslint-disable no-await-in-loop */
import { expect } from '@playwright/test'
import { test } from '@root/playwright'

test('should be able to register multiple names on the address page', async ({
  page,
  accounts,
  login,
  subgraph,
  makePageObject,
  makeName,
}) => {
  const names = await makeName([
    {
      label: 'extend-legacy',
      type: 'legacy',
      owner: 'user2',
    },
    {
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user2',
    },
  ])

  const address = accounts.getAddress('user2')
  const addresPage = makePageObject('AddressPage')
  const transactionModal = makePageObject('TransactionModal')

  await addresPage.goto(address)

  await login.connect()

  await addresPage.selectToggle.click()
  const timestampDict: { [key: string]: number } = {}
  for (const name of names) {
    await addresPage.search(name)
    const timestamp = await addresPage.getTimestamp(name)
    timestampDict[name] = timestamp
    await addresPage.getNameRow(name).click()
  }
  await addresPage.extendNamesButton.click()
  await addresPage.extendNamesModalNextButton.click()

  // check the invoice details
  await expect(page.getByTestId('invoice-item-0-amount')).toHaveText(/0.0065/)
  await expect(page.getByTestId('invoice-item-1-amount')).toHaveText(/0.0003/)
  await expect(page.getByTestId('invoice-total')).toHaveText(/0.0068/)
  await expect(page.getByText('1 year extension')).toBeVisible()

  // check the price comparison table
  await expect(page.getByTestId('year-marker-0')).toHaveText(/4% gas/)
  await expect(page.getByTestId('year-marker-1')).toHaveText(/2% gas/)
  await expect(page.getByTestId('year-marker-2')).toHaveText(/1% gas/)

  // increment and save
  await page.getByTestId('plus-minus-control-plus').click()
  await page.getByTestId('extend-names-confirm').click()
  await expect(
    page.getByText('Extending this name will not give you ownership of it'),
  ).toBeVisible()
  await transactionModal.autoComplete()

  await subgraph.sync()
  await page.reload()
  for (const name of names) {
    await addresPage.search(name)
    await expect(addresPage.nameExpiry(name)).not.toHaveText(/12/, { timeout: 15000 })
    await expect(await addresPage.getTimestamp(name)).toEqual(timestampDict[name] + 31536000000 * 2)
  }
})

test('should be able to extend a single unwrapped name from profile', async ({
  page,
  login,
  makePageObject,
  makeName,
}) => {
  const name = await makeName({
    label: 'legacy',
    type: 'legacy',
    owner: 'user2',
  })

  const profilePage = makePageObject('ProfilePage')
  const transactionModal = makePageObject('TransactionModal')

  await profilePage.goto(name)
  await login.connect()

  const timestamp = await profilePage.getExpiryTimestamp()

  await profilePage.getExtendButton.click()

  const extendNamesModal = makePageObject('ExtendNamesModal')
  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0034')
    await expect(page.getByText('1 year extension')).toBeVisible()
  })

  await test.step('should show the cost comparison data', async () => {
    await expect(page.getByTestId('year-marker-0')).toContainText('4% gas')
    await expect(page.getByTestId('year-marker-1')).toContainText('2% gas')
    await expect(page.getByTestId('year-marker-2')).toContainText('1% gas')
  })

  await test.step('should work correctly with plus minus control', async () => {
    await expect(extendNamesModal.getCounterMinusButton).toBeDisabled()
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
    await extendNamesModal.getCounterPlusButton.click()
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0065')
    await expect(page.locator('text=2 year extension')).toBeVisible()
  })

  await test.step('should show correct fiat values', async () => {
    await extendNamesModal.getCurrencyToggle.click({ force: true })
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('$10.00')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('$0.20')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('$10.20')
    await extendNamesModal.getCounterMinusButton.click()
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('$5.00')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('$0.20')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('$5.20')
  })

  await test.step('should extend', async () => {
    await extendNamesModal.getExtendButton.click()
    await expect(
      page.getByText('Extending this name will not give you ownership of it'),
    ).toBeVisible()
    await transactionModal.autoComplete()
    const newTimestamp = await profilePage.getExpiryTimestamp()
    await expect(newTimestamp).toEqual(timestamp + 31536000000)
  })
})

test('should be able to extend a single unwrapped name in grace period from profile', async ({
  page,
  login,
  makePageObject,
  makeName,
}) => {
  const name = await makeName({
    label: 'legacy',
    type: 'legacy',
    owner: 'user2',
    duration: -24 * 60 * 60,
  })

  const profilePage = makePageObject('ProfilePage')
  await profilePage.goto(name)

  await login.connect()

  await expect(page.getByText(`${name} has expired`)).toBeVisible()

  const timestamp = await profilePage.getExpiryTimestamp()

  await profilePage.getExtendButton.click()

  const extendNamesModal = makePageObject('ExtendNamesModal')
  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0034')
    await expect(page.locator('text=1 year extension')).toBeVisible()
  })

  await test.step('should show the cost comparison data', async () => {
    await expect(page.getByTestId('year-marker-0')).toContainText('4% gas')
    await expect(page.getByTestId('year-marker-1')).toContainText('2% gas')
    await expect(page.getByTestId('year-marker-2')).toContainText('1% gas')
  })

  await test.step('should work correctly with plus minus control', async () => {
    await expect(extendNamesModal.getCounterMinusButton).toBeDisabled()
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
    await extendNamesModal.getCounterPlusButton.click()
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0065')
    await expect(page.locator('text=2 year extension')).toBeVisible()
  })

  await test.step('should show correct fiat values', async () => {
    await extendNamesModal.getCurrencyToggle.click({ force: true })
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('$10.00')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('$0.20')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('$10.20')
    await extendNamesModal.getCounterMinusButton.click()
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('$5.00')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('$0.20')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('$5.20')
  })

  await test.step('should extend', async () => {
    await extendNamesModal.getExtendButton.click()
    await expect(
      page.getByText('Extending this name will not give you ownership of it'),
    ).toBeVisible()
    const transactionModal = makePageObject('TransactionModal')
    await transactionModal.autoComplete()

    const newTimestamp = await profilePage.getExpiryTimestamp()
    await expect(newTimestamp).toEqual(timestamp + 31536000000)
  })
})

test('should be able to extend a single unwrapped name in grace period from profile 2', async ({
  page,
  login,
  makePageObject,
  makeName,
}) => {
  const name = await makeName({
    label: 'legacy',
    type: 'legacy',
    owner: 'user2',
    duration: -14 * 24 * 60 * 60,
  })

  const extendNamesModal = makePageObject('ExtendNamesModal')
  const profilePage = makePageObject('ProfilePage')

  await profilePage.goto(name)
  await login.connect()

  const timestamp = await profilePage.getExpiryTimestamp()

  await profilePage.getExtendButton.click()

  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0034')
    await expect(page.locator('text=1 year extension')).toBeVisible()
  })

  await test.step('should show the cost comparison data', async () => {
    await expect(page.getByTestId('year-marker-0')).toContainText('4% gas')
    await expect(page.getByTestId('year-marker-1')).toContainText('2% gas')
    await expect(page.getByTestId('year-marker-2')).toContainText('1% gas')
  })

  await test.step('should work correctly with plus minus control', async () => {
    await expect(extendNamesModal.getCounterMinusButton).toBeDisabled()
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
    await extendNamesModal.getCounterPlusButton.click()
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0065')
    await expect(page.locator('text=2 year extension')).toBeVisible()
  })

  await test.step('should show correct fiat values', async () => {
    await extendNamesModal.getCurrencyToggle.click({ force: true })
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('$10.00')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('$0.20')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('$10.20')
    await extendNamesModal.getCounterMinusButton.click()
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('$5.00')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('$0.20')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('$5.20')
  })

  await test.step('should extend', async () => {
    await extendNamesModal.getExtendButton.click()
    await expect(
      page.getByText('Extending this name will not give you ownership of it'),
    ).toBeVisible()
    const transactionModal = makePageObject('TransactionModal')
    await transactionModal.autoComplete()
    const newTimestamp = await profilePage.getExpiryTimestamp()
    await expect(newTimestamp).toEqual(timestamp + 31536000000)
  })
})

test('should not show extend button on unwrapped subnames', async ({
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'with-subname',
    type: 'legacy',
    subnames: [
      {
        label: 'test',
      },
    ],
  })

  const subname = `test.${name}`

  const profilePage = makePageObject('ProfilePage')

  await profilePage.goto(subname)
  await login.connect()

  await expect(profilePage.getExtendButton).toHaveCount(0)
})
