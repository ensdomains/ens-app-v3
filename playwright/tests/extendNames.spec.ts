import { expect } from '@playwright/test'

import { test } from '..'

test('should be able to register multiple names on the address page', async ({
  page,
  accounts,
  wallet,
  Login,
  AddressPage,
}) => {
  const address = accounts.getAddress('user')
  const addresPage = new AddressPage(page)
  await addresPage.goto(address)

  await new Login(page, wallet).connect()

  await page.pause()
})

test('should be able to extend a single unwrapped name from profile', async ({
  page,
  wallet,
  Login,
  ProfilePage,
  ExtendNamesModal,
  TransactionModal,
  nameGenerator,
}) => {
  const name = await nameGenerator({
    label: 'legacy',
    type: 'legacy',
    owner: 'user2',
  })

  const profilePage = new ProfilePage(page)
  await profilePage.goto(name)

  await new Login(page, wallet).connect()

  const timestamp = await profilePage.getExpiryTimestamp()

  await profilePage.getExtendButton.click()

  const extendNamesModal = new ExtendNamesModal(page)
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
      page.locator('text=Extending this name will not give you ownership of it'),
    ).toBeVisible()
    const transactionModal = new TransactionModal(page, wallet)
    await transactionModal.autoComplete()
    const newTimestamp = await profilePage.getExpiryTimestamp()
    await expect(newTimestamp).toEqual(timestamp + 31536000000)
  })
})

test('should be able to extend a single unwrapped name in grace period from profile', async ({
  page,
  wallet,
  Login,
  ProfilePage,
  ExtendNamesModal,
  TransactionModal,
  nameGenerator,
}) => {
  const name = await nameGenerator({
    label: 'legacy',
    type: 'legacy',
    owner: 'user2',
    duration: 2419200,
  })

  const profilePage = new ProfilePage(page)
  await profilePage.goto(name)

  await new Login(page, wallet).connect()

  const timestamp = await profilePage.getExpiryTimestamp()
  await page.pause()

  await profilePage.getExtendButton.click()

  const extendNamesModal = new ExtendNamesModal(page)
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
      page.locator('text=Extending this name will not give you ownership of it'),
    ).toBeVisible()
    const transactionModal = new TransactionModal(page, wallet)
    await transactionModal.autoComplete()
    const newTimestamp = await profilePage.getExpiryTimestamp()
    await expect(newTimestamp).toEqual(timestamp + 31536000000)
  })
})
