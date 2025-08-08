/* eslint-disable no-await-in-loop */
import { expect } from '@playwright/test'

import {
  dateToDateInput,
  roundDurationWithDay,
  secondsFromDateDiff,
  secondsToDateInput,
} from '@app/utils/date'
import { daysToSeconds } from '@app/utils/time'

import { test } from '../../../playwright'

test('should be able to extend multiple names (including names in grace preiod) on the address page', async ({
  page,
  accounts,
  login,
  subgraph,
  makePageObject,
  makeName,
  time,
}) => {
  // Generating names in not neccessary but we want to make sure that there are names to extend
  await makeName([
    {
      label: 'extend-legacy',
      type: 'legacy',
      owner: 'user2',
      duration: -24 * 60 * 60,
    },
    {
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user2',
      duration: -24 * 60 * 60,
    },
  ])

  const address = accounts.getAddress('user2')
  const addresPage = makePageObject('AddressPage')
  const transactionModal = makePageObject('TransactionModal')

  await addresPage.goto(address)
  await login.connect()

  await addresPage.selectToggle.click()

  await expect(await page.locator('.name-detail-item').count()).toBeGreaterThan(0)
  const nameItems = await page.locator('.name-detail-item').all()
  const nameItemTestIds = await Promise.all(
    nameItems.map((item) => item.getAttribute('data-testid')),
  )
  const extendableNameItems = nameItemTestIds
    .filter((testid): testid is string => !!testid)
    .map((testid) => testid.replace('name-item-', ''))
    .filter((name) => {
      const nameParts = name?.split('.') ?? []
      return nameParts.length === 2 && nameParts[1] === 'eth'
    })

  const timestampDict: { [key: string]: number } = {}
  for (const name of extendableNameItems) {
    const timestamp = await addresPage.getTimestamp(name)
    timestampDict[name] = timestamp
  }
  await addresPage.extendNamesButton.click()

  // warning message
  await expect(page.getByText('You do not own all these names')).toBeVisible()
  await page.getByTestId('extend-names-confirm').click()

  // name list
  await expect(page.getByText(`Extend ${extendableNameItems.length} Names`)).toBeVisible()
  await page.locator('button:has-text("Next")').waitFor({ state: 'visible' })
  await page.locator('button:has-text("Next")').click()

  // check the invoice details
  // TODO: Reimplement when date duration bug is fixed
  // await expect(page.getByText('1 year extension', { exact: true })).toBeVisible()
  await expect(page.getByTestId('plus-minus-control-label')).toHaveText('1 year')
  await page.getByTestId('plus-minus-control-plus').click()
  await expect(page.getByTestId('plus-minus-control-label')).toHaveText('2 years')
  await page.getByTestId('plus-minus-control-plus').click()
  await expect(page.getByTestId('plus-minus-control-label')).toHaveText('3 years')
  await expect(page.getByTestId('invoice-item-0-amount')).not.toHaveText('0.0000 ETH')
  await expect(page.getByTestId('invoice-item-1-amount')).not.toHaveText('0.0000 ETH')
  await expect(page.getByTestId('invoice-total')).not.toHaveText('0.0000 ETH')

  await page.getByTestId('extend-names-confirm').click()
  await expect(transactionModal.transactionModal).toBeVisible({ timeout: 10000 })
  await transactionModal.autoComplete()

  await expect(page.getByText('Your "Extend names" transaction was successful')).toBeVisible({
    timeout: 15000,
  })
  await subgraph.sync()

  // Should be able to remove this after useQuery is fixed. Using to force a refetch.
  await time.increaseTime({ seconds: 15 })
  await page.reload()
  await page.waitForLoadState('networkidle')
  for (const name of extendableNameItems) {
    const label = name.replace('.eth', '')
    await addresPage.search(label)
    await expect(addresPage.getNameRow(name)).toBeVisible({ timeout: 5000 })
    await expect(await addresPage.getTimestamp(name)).not.toBe(timestampDict[name])
    await expect(await addresPage.getTimestamp(name)).toBe(timestampDict[name] + 31536000000 * 3)
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
    await expect(page.getByText(`You do not own ${name}`)).toBeVisible()
    await page.getByRole('button', { name: 'I understand' }).click()
  })

  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0034')
    await expect(page.getByText('1 year extension', { exact: true })).toBeVisible({
      timeout: 30000,
    })
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
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('$10.0')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('$0.1')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('$10.1')
    await extendNamesModal.getCounterMinusButton.click()
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('$5.0')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('$0.1')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('$5.1')
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

  await profilePage.getExtendButton.click()

  const extendNamesModal = makePageObject('ExtendNamesModal')

  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0034')
    await expect(page.getByText('1 year extension', { exact: true })).toBeVisible()
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
    await expect(page.getByText(`You do not own ${name}`)).toBeVisible()
    await page.getByRole('button', { name: 'I understand' }).click()
  })

  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0034')
    await expect(page.getByText('1 year extension', { exact: true })).toBeVisible()
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

  const timestamp = await profilePage.getExpiryTimestamp()
  await profilePage.getExtendButton.click()

  await test.step('should be able to pick by date', async () => {
    const dateSelection = page.getByTestId('date-selection')
    await expect(dateSelection).toHaveText('Pick by date')

    await dateSelection.click()
  })

  await test.step('should set and render a date properly', async () => {
    const expiryTimestamp = await profilePage.getExpiryTimestamp()
    const expiryTime = expiryTimestamp / 1000
    const calendar = page.getByTestId('calendar')
    const monthLater = await page.evaluate((ts) => {
      const expiryDate = new Date(ts)
      expiryDate.setMonth(expiryDate.getMonth() + 1)
      return expiryDate
    }, expiryTimestamp)

    await calendar.fill(dateToDateInput(monthLater))
    await expect(page.getByTestId('calendar-date')).toHaveValue(
      secondsToDateInput(expiryTime + roundDurationWithDay(monthLater, expiryTime)),
    )
  })

  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0003')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText(/0\.000[3|4]/)
    await expect(page.getByText(/1 month .* extension/)).toBeVisible()
  })

  await test.step('should extend', async () => {
    await extendNamesModal.getExtendButton.click()
    const transactionModal = makePageObject('TransactionModal')

    // Verify duration and new expiry display in transaction modal
    await expect(page.getByText('1 month')).toBeVisible()

    await transactionModal.autoComplete()

    const newTimestamp = await profilePage.getExpiryTimestamp()
    const comparativeTimestamp =
      timestamp +
      secondsFromDateDiff({ startDate: new Date(timestamp), additionalMonths: 1 }) * 1000
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

  const timestamp = await profilePage.getExpiryTimestamp()
  await profilePage.getExtendButton.click()

  await test.step('should be able to pick by date', async () => {
    const dateSelection = page.getByTestId('date-selection')
    await expect(dateSelection).toHaveText('Pick by date')

    await dateSelection.click()
  })

  await test.step('should set and render a date properly', async () => {
    const expiryTimestamp = await profilePage.getExpiryTimestamp()
    const expiryTime = expiryTimestamp / 1000
    const calendar = page.getByTestId('calendar')
    const dayLater = await page.evaluate((ts) => {
      const expiryDate = new Date(ts)
      expiryDate.setDate(expiryDate.getDate() + 1)
      return expiryDate
    }, expiryTimestamp)

    await calendar.fill(dateToDateInput(dayLater))
    await expect(page.getByTestId('calendar-date')).toHaveValue(
      secondsToDateInput(expiryTime + roundDurationWithDay(dayLater, expiryTime)),
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

    // Verify duration and new expiry display in transaction modal
    await expect(page.getByText('1 day')).toBeVisible()

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

  await profilePage.getExtendButton.click()

  const extendNamesModal = makePageObject('ExtendNamesModal')

  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0034')
    await expect(page.getByText('1 year extension', { exact: true })).toBeVisible()
  })

  await test.step('should be able to pick by date', async () => {
    const dateSelection = page.getByTestId('date-selection')
    await expect(dateSelection).toHaveText('Pick by date')

    await dateSelection.click()
  })

  await test.step('should set and render a date properly', async () => {
    const expiryTimestamp = await profilePage.getExpiryTimestamp()
    const expiryTime = expiryTimestamp / 1000
    const calendar = page.getByTestId('calendar')
    const monthLater = await page.evaluate((ts) => {
      const expiryDate = new Date(ts)
      expiryDate.setMonth(expiryDate.getMonth() + 1)
      return expiryDate
    }, expiryTimestamp)

    await calendar.fill(dateToDateInput(monthLater))
    await expect(page.getByTestId('calendar-date')).toHaveValue(
      secondsToDateInput(expiryTime + roundDurationWithDay(monthLater, expiryTime)),
    )
  })

  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0003')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0004')
    await expect(page.getByText(/1 month .* extension/)).toBeVisible()
  })

  await test.step('should extend', async () => {
    await extendNamesModal.getExtendButton.click()
    const transactionModal = makePageObject('TransactionModal')

    // Verify duration and new expiry display in transaction modal
    await expect(page.getByText('1 month')).toBeVisible()

    await transactionModal.autoComplete()

    const newTimestamp = await profilePage.getExpiryTimestamp()
    const comparativeTimestamp =
      timestamp +
      secondsFromDateDiff({ startDate: new Date(timestamp), additionalMonths: 1 }) * 1000
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

  await profilePage.getExtendButton.click()

  const extendNamesModal = makePageObject('ExtendNamesModal')

  await test.step('should show the correct price data', async () => {
    await expect(extendNamesModal.getInvoiceExtensionFee).toContainText('0.0033')
    await expect(extendNamesModal.getInvoiceTransactionFee).toContainText('0.0001')
    await expect(extendNamesModal.getInvoiceTotal).toContainText('0.0034')
    await expect(page.getByText('1 year extension', { exact: true })).toBeVisible()
  })

  await test.step('should be able to pick by date', async () => {
    const dateSelection = page.getByTestId('date-selection')
    await expect(dateSelection).toHaveText('Pick by date')

    await dateSelection.click()
  })

  await test.step('should set and render a date properly', async () => {
    const expiryTimestamp = await profilePage.getExpiryTimestamp()
    const expiryTime = expiryTimestamp / 1000
    const calendar = page.getByTestId('calendar')
    const dayLater = await page.evaluate((ts) => {
      const expiryDate = new Date(ts)
      expiryDate.setDate(expiryDate.getDate() + 1)
      return expiryDate
    }, expiryTimestamp)

    await calendar.fill(dateToDateInput(dayLater))
    await expect(page.getByTestId('calendar-date')).toHaveValue(
      secondsToDateInput(expiryTime + roundDurationWithDay(dayLater, expiryTime)),
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

    // Verify duration and new expiry display in transaction modal
    await expect(page.getByText('1 day')).toBeVisible()

    await transactionModal.autoComplete()

    const newTimestamp = await profilePage.getExpiryTimestamp()
    const comparativeTimestamp = timestamp + daysToSeconds(1) * 1000
    await expect(comparativeTimestamp).toEqual(newTimestamp)
  })
})

test('should be able to extend a single wrapped name using deep link', async ({
  page,
  login,
  makePageObject,
  makeName,
}) => {
  const name = await makeName({
    label: 'legacy',
    type: 'wrapped',
    owner: 'user2',
  })

  const profilePage = makePageObject('ProfilePage')
  const transactionModal = makePageObject('TransactionModal')

  const homePage = makePageObject('HomePage')
  await homePage.goto()
  await login.connect()
  await page.goto(`/${name}?renew=123`)

  const timestamp = await profilePage.getExpiryTimestamp()

  const extendNamesModal = makePageObject('ExtendNamesModal')
  await test.step('should show warning message', async () => {
    await expect(page.getByText(`You do not own ${name}`)).toBeVisible()
    await page.getByRole('button', { name: 'I understand' }).click()
  })

  await test.step('should show 1 year extension', async () => {
    await expect(page.getByText('1 year extension', { exact: true })).toBeVisible({
      timeout: 30000,
    })
  })

  await test.step('should be able to add more years', async () => {
    await expect(extendNamesModal.getCounterMinusButton).toBeDisabled()
    await extendNamesModal.getCounterPlusButton.click()
    await expect(page.getByText('2 years extension', { exact: true })).toBeVisible({
      timeout: 30000,
    })
  })

  await test.step('should be able to reduce number of years', async () => {
    await extendNamesModal.getCurrencyToggle.click({ force: true })
    await extendNamesModal.getCounterMinusButton.click()
  })

  await test.step('should extend', async () => {
    await extendNamesModal.getExtendButton.click()
    await transactionModal.autoComplete()
    const newTimestamp = await profilePage.getExpiryTimestamp()
    expect(newTimestamp).toEqual(timestamp + 31536000000)
  })
})

test('should not be able to extend a name which is not registered', async ({
  page,
  makePageObject,
  login,
}) => {
  const name = 'this-name-does-not-exist.eth'
  const homePage = makePageObject('HomePage')
  await homePage.goto()
  await login.connect()
  await page.goto(`/${name}?renew=123`)
  await expect(page.getByRole('heading', { name: `Register ${name}` })).toBeVisible()
})

test('renew deep link should redirect to registration when not logged in', async ({
  page,
  makePageObject,
}) => {
  const name = 'this-name-does-not-exist.eth'
  const homePage = makePageObject('HomePage')
  await homePage.goto()
  await page.goto(`/${name}?renew=123`)
  await expect(page.getByRole('heading', { name: `Register ${name}` })).toBeVisible()
})

test('should handle URL-based renew parameter', async ({ page, login, makeName }) => {
  const name = await makeName({
    label: 'legacy',
    type: 'legacy',
    owner: 'user',
  })

  await test.step('should handle large duration', async () => {
    await page.goto(`/${name}?renew=315360000`) // 10 years
    await login.connect()
    await expect(page.getByText('10 years extension', { exact: true })).toBeVisible()
  })
})

test('should handle URL-based renew for names in grace period', async ({
  page,
  login,
  makeName,
}) => {
  const name = await makeName({
    label: 'legacy',
    type: 'legacy',
    owner: 'user',
    duration: -24 * 60 * 60,
  })

  await test.step('should allow extend in grace period', async () => {
    await page.goto(`/${name}?renew=94608000`) // 3 years
    await login.connect()

    await expect(page.getByText(`${name} has expired`)).toBeVisible()
    await expect(page.getByText(`You do not own ${name}`)).toBeVisible()
    await page.getByTestId('extend-names-confirm').click()

    await expect(page.getByText('3 years extension', { exact: true })).toBeVisible()
  })
})

test('should handle URL-based renew for disconnected users', async ({ page, makeName }) => {
  const name = await makeName({
    label: 'legacy',
    type: 'legacy',
    owner: 'user',
  })

  await page.goto(`/${name}?tab=ownership`)
  await expect(page.getByText('Extend')).not.toBeVisible()

  await page.goto(`/${name}?renew=94608000`)
  await expect(page.getByText('Connect a wallet')).toBeVisible()
})
