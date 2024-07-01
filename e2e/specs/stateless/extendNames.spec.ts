/* eslint-disable no-await-in-loop */
import { expect } from '@playwright/test'

import { dateToDateInput, roundDurationWithDay, secondsToDateInput } from '@app/utils/date'
import { daysToSeconds } from '@app/utils/time'

import { test } from '../../../playwright'

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
    const label = name.replace('.eth', '')
    await addresPage.search(label)
    const timestamp = await addresPage.getTimestamp(name)
    timestampDict[name] = timestamp
    await addresPage.getNameRow(name).click()
  }
  await addresPage.extendNamesButton.click()

  // warning message
  await expect(page.getByText('You do not own all these names')).toBeVisible()
  await page.getByRole('button', { name: 'I understand' }).click()

  // name list
  await addresPage.extendNamesModalNextButton.click()

  // check the invoice details
  await expect(page.getByTestId('invoice-item-0-amount')).toContainText('0.0065')
  await expect(page.getByTestId('invoice-item-1-amount')).toContainText('0.0002')
  await expect(page.getByTestId('invoice-total')).toContainText('0.0067')
  await expect(page.getByText('1 year extension', { exact: true })).toBeVisible()

  // check the price comparison table
  await expect(page.getByTestId('year-marker-0')).toContainText('3% gas')
  await expect(page.getByTestId('year-marker-1')).toContainText('1% gas')
  await expect(page.getByTestId('year-marker-2')).toContainText('1% gas')

  // increment and save
  await page.getByTestId('plus-minus-control-plus').click()
  await page.getByTestId('plus-minus-control-plus').click()
  await page.getByTestId('extend-names-confirm').click()

  await transactionModal.autoComplete()

  await subgraph.sync()
  await page.reload()
  for (const name of names) {
    const label = name.replace('.eth', '')
    await addresPage.search(label)
    await expect(addresPage.nameExpiry(name)).not.toHaveText(/12/, { timeout: 30000 })
    expect(await addresPage.getTimestamp(name)).toEqual(timestampDict[name] + 31536000000 * 3)
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
  await test.step('should show warning message', async () => {
    await expect(page.getByText('You do not own this name')).toBeVisible()
    await page.getByRole('button', { name: 'I understand' }).click()
  })

  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0033')
    await expect(page.getByText('1 year extension', { exact: true })).toBeVisible({
      timeout: 30000,
    })
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
    await expect(page.getByText('2 years extension', { exact: true })).toBeVisible({
      timeout: 30000,
    })
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
    await transactionModal.autoComplete()
    const newTimestamp = await profilePage.getExpiryTimestamp()
    expect(newTimestamp).toEqual(timestamp + 31536000000)
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
    owner: 'user',
    duration: -24 * 60 * 60,
  })

  const profilePage = makePageObject('ProfilePage')
  await profilePage.goto(name)

  await login.connect()

  await expect(page.getByText(`${name} has expired`)).toBeVisible()

  const timestamp = await profilePage.getExpiryTimestamp()

  await page.pause()
  await profilePage.getExtendButton.click()

  const extendNamesModal = makePageObject('ExtendNamesModal')

  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0033')
    await expect(page.getByText('1 year extension', { exact: true })).toBeVisible()
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
    await expect(page.getByText('2 years extension', { exact: true })).toBeVisible()
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
    const transactionModal = makePageObject('TransactionModal')
    await transactionModal.autoComplete()

    const newTimestamp = await profilePage.getExpiryTimestamp()
    expect(newTimestamp).toEqual(timestamp + 31536000000)
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

  await test.step('should show warning message', async () => {
    await expect(page.getByText('You do not own this name')).toBeVisible()
    await page.getByRole('button', { name: 'I understand' }).click()
  })

  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0033')
    await expect(page.getByText('1 year extension', { exact: true })).toBeVisible()
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
    await expect(page.getByText('2 years extension', { exact: true })).toBeVisible()
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
    const transactionModal = makePageObject('TransactionModal')
    await transactionModal.autoComplete()
    const newTimestamp = await profilePage.getExpiryTimestamp()
    expect(newTimestamp).toEqual(timestamp + 31536000000)
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

test('should be able to extend a name by a month', async ({
  page,
  login,
  makePageObject,
  makeName,
}) => {
  const name = await makeName({
    label: 'legacy',
    type: 'legacy',
    owner: 'user',
  })

  const extendNamesModal = makePageObject('ExtendNamesModal')
  const profilePage = makePageObject('ProfilePage')

  await profilePage.goto(name)
  await login.connect()

  await page.pause()
  const timestamp = await profilePage.getExpiryTimestamp()
  await profilePage.getExtendButton.click()

  await test.step('should be able to pick by date', async () => {
    const dateSelection = page.getByTestId('date-selection')
    await expect(dateSelection).toHaveText('Pick by date')

    await dateSelection.click()
  })

  await test.step('should set and render a date properly', async () => {
    const expiryTime = (await profilePage.getExpiryTimestamp()) / 1000
    const calendar = page.getByTestId('calendar')
    const monthLater = await page.evaluate(
      (ts) => {
        return new Date(ts)
      },
      (expiryTime + daysToSeconds(31)) * 1000,
    )

    await calendar.fill(dateToDateInput(monthLater))
    await expect(page.getByTestId('calendar-date')).toHaveValue(
      secondsToDateInput(expiryTime + roundDurationWithDay(monthLater, expiryTime)),
    )
  })

  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0003')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0004')
    await expect(page.getByText('1 month extension', { exact: true })).toBeVisible()
  })

  await test.step('should extend', async () => {
    await extendNamesModal.getExtendButton.click()
    const transactionModal = makePageObject('TransactionModal')
    await transactionModal.autoComplete()

    const newTimestamp = await profilePage.getExpiryTimestamp()
    const comparativeTimestamp = timestamp + daysToSeconds(31) * 1000
    await expect(comparativeTimestamp).toEqual(newTimestamp)
  })
})

test('should be able to extend a name by a day', async ({
  page,
  login,
  makePageObject,
  makeName,
}) => {
  const name = await makeName({
    label: 'legacy',
    type: 'legacy',
    owner: 'user',
  })

  const extendNamesModal = makePageObject('ExtendNamesModal')
  const profilePage = makePageObject('ProfilePage')

  await profilePage.goto(name)
  await login.connect()

  await page.pause()
  const timestamp = await profilePage.getExpiryTimestamp()
  await profilePage.getExtendButton.click()

  await test.step('should be able to pick by date', async () => {
    const dateSelection = page.getByTestId('date-selection')
    await expect(dateSelection).toHaveText('Pick by date')

    await dateSelection.click()
  })

  await test.step('should set and render a date properly', async () => {
    const expiryTime = (await profilePage.getExpiryTimestamp()) / 1000
    const calendar = page.getByTestId('calendar')
    const monthLater = await page.evaluate(
      (ts) => {
        return new Date(ts)
      },
      (expiryTime + daysToSeconds(1)) * 1000,
    )

    await calendar.fill(dateToDateInput(monthLater))
    await expect(page.getByTestId('calendar-date')).toHaveValue(
      secondsToDateInput(expiryTime + roundDurationWithDay(monthLater, expiryTime)),
    )
  })

  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.000009')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0001')
    await expect(page.getByText('1 day extension', { exact: true })).toBeVisible()
  })

  await test.step('should extend', async () => {
    await extendNamesModal.getExtendButton.click()
    const transactionModal = makePageObject('TransactionModal')
    await transactionModal.autoComplete()

    const newTimestamp = await profilePage.getExpiryTimestamp()
    const comparativeTimestamp = timestamp + daysToSeconds(1) * 1000
    await expect(comparativeTimestamp).toEqual(newTimestamp)
  })
})

test('should be able to extend a name in grace period by a month', async ({
  page,
  login,
  makePageObject,
  makeName,
}) => {
  const name = await makeName({
    label: 'legacy',
    type: 'legacy',
    owner: 'user',
    duration: -24 * 60 * 60,
  })

  const profilePage = makePageObject('ProfilePage')
  await profilePage.goto(name)

  await login.connect()

  await expect(page.getByText(`${name} has expired`)).toBeVisible()

  const timestamp = await profilePage.getExpiryTimestamp()

  await page.pause()
  await profilePage.getExtendButton.click()

  const extendNamesModal = makePageObject('ExtendNamesModal')

  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0033')
    await expect(page.getByText('1 year extension', { exact: true })).toBeVisible()
  })

  await test.step('should show the cost comparison data', async () => {
    await expect(page.getByTestId('year-marker-0')).toContainText('2% gas')
    await expect(page.getByTestId('year-marker-1')).toContainText('1% gas')
    await expect(page.getByTestId('year-marker-2')).toContainText('1% gas')
  })

  await test.step('should be able to pick by date', async () => {
    const dateSelection = page.getByTestId('date-selection')
    await expect(dateSelection).toHaveText('Pick by date')

    await dateSelection.click()
  })

  await test.step('should set and render a date properly', async () => {
    const expiryTime = (await profilePage.getExpiryTimestamp()) / 1000
    const calendar = page.getByTestId('calendar')
    const monthLater = await page.evaluate(
      (ts) => {
        return new Date(ts)
      },
      (expiryTime + daysToSeconds(31)) * 1000,
    )

    await calendar.fill(dateToDateInput(monthLater))
    await expect(page.getByTestId('calendar-date')).toHaveValue(
      secondsToDateInput(expiryTime + roundDurationWithDay(monthLater, expiryTime)),
    )
  })

  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0003')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0004')
    await expect(page.getByText('1 month extension', { exact: true })).toBeVisible()
  })

  await test.step('should extend', async () => {
    await extendNamesModal.getExtendButton.click()
    const transactionModal = makePageObject('TransactionModal')
    await transactionModal.autoComplete()

    const newTimestamp = await profilePage.getExpiryTimestamp()
    const comparativeTimestamp = timestamp + daysToSeconds(31) * 1000
    await expect(comparativeTimestamp).toEqual(newTimestamp)
  })
})

test('should be able to extend a name in grace period by 1 day', async ({
  page,
  login,
  makePageObject,
  makeName,
}) => {
  const name = await makeName({
    label: 'legacy',
    type: 'legacy',
    owner: 'user',
    duration: -24 * 60 * 60,
  })

  const profilePage = makePageObject('ProfilePage')
  await profilePage.goto(name)

  await login.connect()

  await expect(page.getByText(`${name} has expired`)).toBeVisible()

  const timestamp = await profilePage.getExpiryTimestamp()

  await page.pause()
  await profilePage.getExtendButton.click()

  const extendNamesModal = makePageObject('ExtendNamesModal')

  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0033')
    await expect(page.getByText('1 year extension', { exact: true })).toBeVisible()
  })

  await test.step('should show the cost comparison data', async () => {
    await expect(page.getByTestId('year-marker-0')).toContainText('2% gas')
    await expect(page.getByTestId('year-marker-1')).toContainText('1% gas')
    await expect(page.getByTestId('year-marker-2')).toContainText('1% gas')
  })

  await test.step('should be able to pick by date', async () => {
    const dateSelection = page.getByTestId('date-selection')
    await expect(dateSelection).toHaveText('Pick by date')

    await dateSelection.click()
  })

  await test.step('should set and render a date properly', async () => {
    const expiryTime = (await profilePage.getExpiryTimestamp()) / 1000
    const calendar = page.getByTestId('calendar')
    const monthLater = await page.evaluate(
      (ts) => {
        return new Date(ts)
      },
      (expiryTime + daysToSeconds(1)) * 1000,
    )

    await calendar.fill(dateToDateInput(monthLater))
    await expect(page.getByTestId('calendar-date')).toHaveValue(
      secondsToDateInput(expiryTime + roundDurationWithDay(monthLater, expiryTime)),
    )
  })

  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.000009')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0001')
    await expect(page.getByText('1 day extension', { exact: true })).toBeVisible()
  })

  await test.step('should extend', async () => {
    await extendNamesModal.getExtendButton.click()
    const transactionModal = makePageObject('TransactionModal')
    await transactionModal.autoComplete()

    const newTimestamp = await profilePage.getExpiryTimestamp()
    const comparativeTimestamp = timestamp + daysToSeconds(1) * 1000
    await expect(comparativeTimestamp).toEqual(newTimestamp)
  })
})
