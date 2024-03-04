import { expect } from '@playwright/test'

import { test } from '../../../../playwright'

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
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0033')
    await expect(page.locator('text=1 year extension')).toBeVisible()
  })

  await test.step('should show the cost comparison data', async () => {
    await expect(page.getByTestId('year-marker-0')).toContainText('2% gas')
    await expect(page.getByTestId('year-marker-1')).toContainText('1% gas')
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
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('$0.13')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('$10.13')
    await extendNamesModal.getCounterMinusButton.click()
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('$5.00')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('$0.13')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('$5.13')
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
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0033')
    await expect(page.locator('text=1 year extension')).toBeVisible()
  })

  await test.step('should show the cost comparison data', async () => {
    await expect(page.getByTestId('year-marker-0')).toContainText('2% gas')
    await expect(page.getByTestId('year-marker-1')).toContainText('1% gas')
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
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('$0.13')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('$10.13')
    await extendNamesModal.getCounterMinusButton.click()
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('$5.00')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('$0.13')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('$5.13')
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
