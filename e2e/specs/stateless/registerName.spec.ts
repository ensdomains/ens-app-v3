import { expect } from '@playwright/test'
import { Web3RequestKind } from 'headless-web3-provider'
import { Hash, isHash } from 'viem'

import { ethRegistrarControllerCommitSnippet } from '@ensdomains/ensjs/contracts'
import { setPrimaryName } from '@ensdomains/ensjs/wallet'

// import { secondsToDateInput } from '@app/utils/date'
import { daysToSeconds, yearsToSeconds } from '@app/utils/time'

import { test } from '../../../playwright'
import { createAccounts } from '../../../playwright/fixtures/accounts'
import {
  testClient,
  waitForTransaction,
  walletClient,
} from '../../../playwright/fixtures/contracts/utils/addTestContracts'

/*
 * NOTE: Do not use transactionModal autocomplete here since the app will auto close the modal and playwright will
 * get stuck looking for the complete button
 */

test.describe.serial('normal registration', () => {
  const name = `registration-normal-${Date.now()}.eth`

  test('should allow normal registration', async ({
    page,
    login,
    accounts,
    provider,
    time,
    makePageObject,
  }) => {
    await setPrimaryName(walletClient, {
      name: '',
      account: createAccounts().getAddress('user') as `0x${string}`,
    })

    const homePage = makePageObject('HomePage')
    const registrationPage = makePageObject('RegistrationPage')
    const transactionModal = makePageObject('TransactionModal')

    await time.sync(500)

    await homePage.goto()
    await login.connect()

    // should redirect to registration page
    await homePage.searchInput.fill(name)
    await homePage.searchInput.press('Enter')
    await expect(page.getByRole('heading', { name: `Register ${name}` })).toBeVisible()

    // should have payment choice ethereum checked and show primary name setting as checked
    await expect(page.getByTestId('payment-choice-ethereum')).toBeChecked()
    await expect(registrationPage.primaryNameToggle).toBeChecked()

    await page.pause()
    // should show adjusted gas estimate when primary name setting checked
    const estimate = await registrationPage.getGas()
    expect(estimate).toBeGreaterThan(0)
    await registrationPage.primaryNameToggle.click()
    const estimate2 = await registrationPage.getGas()
    await expect(estimate2).toBeGreaterThan(0)
    expect(estimate2).toBeLessThan(estimate)
    await registrationPage.primaryNameToggle.click()

    // should show cost comparison accurately
    await expect(registrationPage.yearMarker(0)).toHaveText(/13% gas/)
    await expect(registrationPage.yearMarker(1)).toHaveText(/7% gas/)
    await expect(registrationPage.yearMarker(2)).toHaveText(/3% gas/)

    // should show correct price for yearly registration
    await expect(registrationPage.fee).toHaveText(/0.0033/)
    await registrationPage.plusYearButton.click()
    await expect(registrationPage.fee).toHaveText(/0.0065/)
    await registrationPage.minusYearButton.click()

    // should go to profile editor step
    await page.getByTestId('next-button').click()

    // should show a confirmation dialog that records are public
    await page.getByTestId('show-add-profile-records-modal-button').click()
    await page.getByTestId('confirmation-dialog-confirm-button').click()

    // should all setting a gener text record
    await page.getByTestId('profile-record-option-name').click()
    await page.getByTestId('add-profile-records-button').click()
    await page.getByTestId('profile-record-input-input-name').fill('Test Name')

    // should show ETH record by default
    await expect(page.getByTestId('profile-record-input-input-eth')).toHaveValue(
      accounts.getAddress('user'),
    )

    // should show go to info step and show updated estimate
    await expect(page.getByTestId('profile-submit-button')).toHaveText('Next')
    await page.getByTestId('profile-submit-button').click()
    await expect(registrationPage.gas).not.toHaveText(new RegExp(`${estimate} ETH`))

    // should go to transactions step and open commit transaction immediately
    await expect(page.getByTestId('next-button')).toHaveText('Begin')
    await page.getByTestId('next-button').click()
    await expect(page.getByText('Open Wallet')).toBeVisible()
    await transactionModal.confirm()

    // should show countdown
    await expect(page.getByTestId('countdown-circle')).toBeVisible()
    await expect(page.getByTestId('countdown-complete-check')).toBeVisible()
    await provider.increaseTime(60)
    await expect(page.getByTestId('finish-button')).toBeEnabled()

    // should save the registration state and the transaction status
    await page.reload()
    await expect(page.getByTestId('finish-button')).toBeEnabled()

    // should allow finalising registration and automatically go to the complete step
    await page.getByTestId('finish-button').click()
    await expect(
      page.getByText(
        'You will need to complete two transactions to secure your name. The second transaction must be completed within 24 hours of the first.',
      ),
    ).toBeVisible()
    await expect(page.getByText('Open Wallet')).toBeVisible()
    await transactionModal.confirm()

    // should show the correct details on completion
    await expect(page.getByTestId('invoice-item-0-amount')).toHaveText(/0.0032 ETH/)

    await page.getByTestId('view-name').click()
    await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
      accounts.getAddress('user', 5),
    )
  })

  test('should not direct to the registration page on search, and show all records from registration', async ({
    page,
    accounts,
    makePageObject,
  }) => {
    const homePage = makePageObject('HomePage')

    await homePage.goto()
    await homePage.searchInput.fill(name)
    await homePage.searchInput.press('Enter')

    await expect(page).toHaveURL(`/${name}`)

    await expect(page.getByTestId('profile-snippet-nickname')).toHaveText(/Test Name/)
    await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
      new RegExp(accounts.getAddress('user', 5)),
    )
  })

  test('should allow registering a non-primary name', async ({
    page,
    provider,
    accounts,
    time,
    login,
    makePageObject,
  }) => {
    await time.sync(500)

    const nonPrimaryNme = `registration-not-primary-${Date.now()}.eth`

    const transactionModal = makePageObject('TransactionModal')

    // should show primary name setting as unchecked if primary already set
    await page.goto(`/${nonPrimaryNme}/register`)
    await login.connect()

    await expect(page.getByTestId('payment-choice-ethereum')).toBeChecked()
    await expect(page.getByTestId('primary-name-toggle')).not.toBeChecked({ timeout: 1000 })

    // should show set profile button on info step
    await page.getByTestId('next-button').click()

    // setup profile buttons should be blue
    await expect(page.getByTestId('setup-profile-button')).toBeVisible()
    await expect(page.getByTestId('setup-profile-button').locator('div')).toHaveCSS(
      'color',
      'rgb(56, 136, 255)',
    )

    // should allow registering a name without setting primary name
    await page.getByTestId('next-button').click()
    await transactionModal.confirm()
    await expect(page.getByTestId('countdown-complete-check')).toBeVisible()
    await provider.increaseTime(60)
    await page.getByTestId('finish-button').click()
    await transactionModal.confirm()
    await page.getByTestId('view-name').click()
    await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
      new RegExp(accounts.getAddress('user', 5)),
    )
  })
})

test('should allow registering a premium name', async ({
  page,
  login,
  provider,
  accounts,
  makeName,
  makePageObject,
}) => {
  const premiumName = await makeName(
    {
      label: 'premium',
      owner: 'user2',
      type: 'legacy',
      duration: -7890000 - 4 * 345600, // 3 months 4 days
    },
    { timeOffset: 500 },
  )

  const transactionModal = makePageObject('TransactionModal')

  await page.goto(`/${premiumName}/register`)
  await login.connect()

  await page.getByTestId('payment-choice-ethereum').click()
  await expect(page.getByTestId('invoice-item-2-amount')).toBeVisible()
  await page.getByTestId('next-button').click()
  if (await page.getByTestId('profile-submit-button').isVisible()) {
    await page.getByTestId('profile-submit-button').click()
  }

  await page.getByTestId('next-button').click()
  await transactionModal.confirm()

  await expect(page.getByTestId('countdown-complete-check')).toBeVisible()
  await provider.increaseTime(120)
  await page.getByTestId('finish-button').click()
  await transactionModal.confirm()

  await page.getByTestId('view-name').click()
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    new RegExp(accounts.getAddress('user', 5)),
  )
})

test('should allow registering a name and resuming from the commit toast', async ({
  page,
  login,
  provider,
  time,
  makePageObject,
}) => {
  await time.sync(500)

  const name = `registration-resume-${Date.now()}.eth`

  const transactionModal = makePageObject('TransactionModal')

  await page.goto(`/${name}/register`)
  await login.connect()

  await page.getByTestId('payment-choice-ethereum').click()
  await page.getByTestId('next-button').click()
  await page.getByTestId('next-button').click()

  await provider.setAutomine(false)

  await transactionModal.confirm()

  await page.getByTestId('transaction-modal-sent-button').click()
  await page.goto('/')
  await provider.setAutomine(true)

  await page.getByTestId('notification-continue-button').click()
  await expect(page).toHaveURL(`/${name}/register`)
  await expect(page.getByTestId('countdown-circle')).toBeVisible()
  // we don't need to test the rest of registration, just the resume part
})

test('should allow registering with a specific date', async ({ page, login, makePageObject }) => {
  const registrationPage = makePageObject('RegistrationPage')
  const name = `registration-resume-${Date.now()}.eth`

  await page.goto(`/${name}/register`)
  await login.connect()

  await page.pause()
  await page.getByTestId('payment-choice-ethereum').check()
  await registrationPage.primaryNameToggle.uncheck()

  await test.step('should be able to pick by date', async () => {
    const dateSelection = page.getByTestId('date-selection')
    await expect(dateSelection).toHaveText('Pick by date')

    await dateSelection.click()
  })

  const calendar = await page.getByTestId('calendar')
  const browserTime = await page.evaluate(() => Math.floor(Date.now() / 1000))
  const oneYearLaterInput = await page.evaluate(
    (timestamp) => {
      const _date = new Date(timestamp)
      const year = _date.getFullYear()
      const month = String(_date.getMonth() + 1).padStart(2, '0') // Month is zero-indexed
      const day = String(_date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    (browserTime + yearsToSeconds(1)) * 1000,
  )
  // const oneYear = browserTime + yearsToSeconds(1)

  await test.step('should have a correct default date', async () => {
    expect(calendar).toHaveValue(oneYearLaterInput)
    expect(page.getByText('1 year registration', { exact: true })).toBeVisible()
  })

  await test.step('should set a date', async () => {
    const oneYearAndHalfLaterInput = await page.evaluate(
      (timestamp) => {
        const _date = new Date(timestamp)
        const year = _date.getFullYear()
        const month = String(_date.getMonth() + 1).padStart(2, '0') // Month is zero-indexed
        const day = String(_date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      },
      (browserTime + yearsToSeconds(2.5)) * 1000,
    )
    // const oneYearAndAHalfLater = secondsToDateInput(oneYear + yearsToSeconds(1.5))

    await calendar.fill(oneYearAndHalfLaterInput)

    await expect(page.getByTestId('calendar-date')).toHaveValue(oneYearAndHalfLaterInput)

    expect(page.getByText('2 years, 6 months registration', { exact: true })).toBeVisible()
  })

  // should have payment choice ethereum checked and show primary name setting as checked
  await expect(page.getByTestId('payment-choice-ethereum')).toBeChecked()
  await expect(registrationPage.primaryNameToggle).not.toBeChecked()

  await test.step('should show correct price data (for 2.5 years)', async () => {
    await expect(registrationPage.yearMarker(0)).toHaveText(/11% gas/)
    await expect(registrationPage.yearMarker(1)).toHaveText(/6% gas/)
    await expect(registrationPage.yearMarker(2)).toHaveText(/2% gas/)
  })
})

test('should allow registering a premium name with a specific date', async ({
  page,
  login,
  provider,
  accounts,
  makeName,
  makePageObject,
}) => {
  const premiumName = await makeName(
    {
      label: 'premium',
      owner: 'user2',
      type: 'legacy',
      duration: -7890000 - 4 * 345600, // 3 months 4 days
    },
    { timeOffset: 500 },
  )

  const transactionModal = makePageObject('TransactionModal')

  await page.goto(`/${premiumName}/register`)
  await login.connect()

  await test.step('should be able to pick by date', async () => {
    const dateSelection = page.getByTestId('date-selection')
    await expect(dateSelection).toHaveText('Pick by date')

    await dateSelection.click()
  })

  const browserTime = await page.evaluate(() => Math.floor(Date.now() / 1000))
  const calendar = page.getByTestId('calendar')

  await test.step('should set a date', async () => {
    const oneYearAndHalfLaterInput = await page.evaluate(
      (timestamp) => {
        const _date = new Date(timestamp)
        const year = _date.getFullYear()
        const month = String(_date.getMonth() + 1).padStart(2, '0') // Month is zero-indexed
        const day = String(_date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      },
      (browserTime + yearsToSeconds(2.5)) * 1000,
    )

    await calendar.fill(oneYearAndHalfLaterInput)

    await expect(page.getByTestId('calendar-date')).toHaveValue(oneYearAndHalfLaterInput)

    expect(page.getByText('2 years, 6 months registration', { exact: true })).toBeVisible()
  })

  await page.getByTestId('payment-choice-ethereum').click()
  await expect(page.getByTestId('invoice-item-2-amount')).toBeVisible()
  await page.getByTestId('next-button').click()
  if (await page.getByTestId('profile-submit-button').isVisible()) {
    await page.getByTestId('profile-submit-button').click()
  }

  await page.getByTestId('next-button').click()
  await transactionModal.confirm()

  await expect(page.getByTestId('countdown-complete-check')).toBeVisible()
  await provider.increaseTime(120)
  await page.getByTestId('finish-button').click()
  await transactionModal.confirm()

  await page.getByTestId('view-name').click()
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    new RegExp(accounts.getAddress('user', 5)),
  )
})

test('should allow registering a premium name for two months', async ({
  page,
  login,
  provider,
  accounts,
  makeName,
  makePageObject,
}) => {
  const premiumName = await makeName(
    {
      label: 'premium',
      owner: 'user2',
      type: 'legacy',
      duration: -7890000 - 4 * 345600, // 3 months 4 days
    },
    { timeOffset: 500 },
  )

  const transactionModal = makePageObject('TransactionModal')

  await page.goto(`/${premiumName}/register`)
  await login.connect()

  await test.step('should be able to pick by date', async () => {
    const dateSelection = page.getByTestId('date-selection')
    await expect(dateSelection).toHaveText('Pick by date')

    await dateSelection.click()
  })

  const browserTime = await page.evaluate(() => Math.floor(Date.now() / 1000))
  const calendar = page.getByTestId('calendar')

  await test.step('should set a date', async () => {
    const oneYearAndHalfLaterInput = await page.evaluate(
      (timestamp) => {
        const _date = new Date(timestamp)
        const year = _date.getFullYear()
        const month = String(_date.getMonth() + 1).padStart(2, '0') // Month is zero-indexed
        const day = String(_date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      },
      (browserTime + daysToSeconds(61)) * 1000,
    )

    await calendar.fill(oneYearAndHalfLaterInput)

    await expect(page.getByTestId('calendar-date')).toHaveValue(oneYearAndHalfLaterInput)

    expect(page.getByText('2 months registration', { exact: true })).toBeVisible()
  })

  await page.getByTestId('payment-choice-ethereum').click()
  await expect(page.getByTestId('invoice-item-2-amount')).toBeVisible()
  await page.getByTestId('next-button').click()
  if (await page.getByTestId('profile-submit-button').isVisible()) {
    await page.getByTestId('profile-submit-button').click()
  }

  await page.getByTestId('next-button').click()
  await transactionModal.confirm()

  await expect(page.getByTestId('countdown-complete-check')).toBeVisible()
  await provider.increaseTime(120)
  await page.getByTestId('finish-button').click()
  await transactionModal.confirm()

  await page.getByTestId('view-name').click()
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    new RegExp(accounts.getAddress('user', 5)),
  )
})

test('should not allow registering a premium name for less than 28 days', async ({
  page,
  login,
  provider,
  accounts,
  makeName,
  makePageObject,
}) => {
  const premiumName = await makeName(
    {
      label: 'premium',
      owner: 'user2',
      type: 'legacy',
      duration: -7890000 - 4 * 345600, // 3 months 4 days
    },
    { timeOffset: 500 },
  )

  const transactionModal = makePageObject('TransactionModal')

  await page.goto(`/${premiumName}/register`)
  await login.connect()

  await test.step('should be able to pick by date', async () => {
    const dateSelection = page.getByTestId('date-selection')
    await expect(dateSelection).toHaveText('Pick by date')

    await dateSelection.click()
  })

  const browserTime = await page.evaluate(() => Math.floor(Date.now() / 1000))
  const calendar = page.getByTestId('calendar')

  await test.step('should not allow less than 28 days', async () => {
    const lessThan27Days = await page.evaluate(
      (timestamp) => {
        const _date = new Date(timestamp)
        const year = _date.getFullYear()
        const month = String(_date.getMonth() + 1).padStart(2, '0') // Month is zero-indexed
        const day = String(_date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      },
      (browserTime + daysToSeconds(27)) * 1000,
    )

    await calendar.fill(lessThan27Days)

    await expect(page.getByTestId('calendar-date')).not.toHaveValue(lessThan27Days)
  })

  await test.step('should allow 28 days', async () => {
    const set28days = await page.evaluate(
      (timestamp) => {
        const _date = new Date(timestamp)
        const year = _date.getFullYear()
        const month = String(_date.getMonth() + 1).padStart(2, '0') // Month is zero-indexed
        const day = String(_date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      },
      (browserTime + daysToSeconds(28)) * 1000,
    )

    await calendar.fill(set28days)

    await expect(page.getByTestId('calendar-date')).toHaveValue(set28days)

    expect(page.getByText('28 days registration', { exact: true })).toBeVisible()
  })

  await page.getByTestId('payment-choice-ethereum').click()
  await expect(page.getByTestId('invoice-item-2-amount')).toBeVisible()
  await page.getByTestId('next-button').click()
  if (await page.getByTestId('profile-submit-button').isVisible()) {
    await page.getByTestId('profile-submit-button').click()
  }

  await page.getByTestId('next-button').click()
  await transactionModal.confirm()

  await expect(page.getByTestId('countdown-complete-check')).toBeVisible()
  await provider.increaseTime(120)
  await page.getByTestId('finish-button').click()
  await transactionModal.confirm()

  await page.getByTestId('view-name').click()
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    new RegExp(accounts.getAddress('user', 5)),
  )
})

test('should allow normal registration for a month', async ({
  page,
  login,
  accounts,
  provider,
  time,
  makePageObject,
}) => {
  const name = `registration-normal-1month-${Date.now()}.eth`
  await setPrimaryName(walletClient, {
    name: '',
    account: createAccounts().getAddress('user') as `0x${string}`,
  })

  const homePage = makePageObject('HomePage')
  const registrationPage = makePageObject('RegistrationPage')
  const transactionModal = makePageObject('TransactionModal')

  await time.sync(500)

  await homePage.goto()
  await login.connect()

  // should redirect to registration page
  await homePage.searchInput.fill(name)
  await homePage.searchInput.press('Enter')
  await expect(page.getByRole('heading', { name: `Register ${name}` })).toBeVisible()

  await test.step('should be able to pick by date', async () => {
    const dateSelection = page.getByTestId('date-selection')
    await expect(dateSelection).toHaveText('Pick by date')

    await dateSelection.click()
  })

  const calendar = await page.getByTestId('calendar')
  const browserTime = await page.evaluate(() => Math.floor(Date.now() / 1000))

  await test.step('should set a date', async () => {
    const oneMonthLaterInput = await page.evaluate(
      (timestamp) => {
        const _date = new Date(timestamp)
        const year = _date.getFullYear()
        const month = String(_date.getMonth() + 1).padStart(2, '0') // Month is zero-indexed
        const day = String(_date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      },
      (browserTime + daysToSeconds(31)) * 1000,
    )
    // const oneYearAndAHalfLater = secondsToDateInput(oneYear + yearsToSeconds(1.5))

    await calendar.fill(oneMonthLaterInput)

    await expect(page.getByTestId('calendar-date')).toHaveValue(oneMonthLaterInput)

    expect(page.getByText('1 month registration', { exact: true })).toBeVisible()
  })

  // should have payment choice ethereum checked and show primary name setting as checked
  await expect(page.getByTestId('payment-choice-ethereum')).toBeChecked()
  await expect(registrationPage.primaryNameToggle).toBeChecked()

  await page.pause()
  // should show adjusted gas estimate when primary name setting checked
  const estimate = await registrationPage.getGas()
  expect(estimate).toBeGreaterThan(0)
  await registrationPage.primaryNameToggle.click()
  const estimate2 = await registrationPage.getGas()
  await expect(estimate2).toBeGreaterThan(0)
  expect(estimate2).toBeLessThan(estimate)
  await registrationPage.primaryNameToggle.click()

  // should show cost comparison accurately
  await expect(registrationPage.yearMarker(0)).toHaveText(/13% gas/)
  await expect(registrationPage.yearMarker(1)).toHaveText(/7% gas/)
  await expect(registrationPage.yearMarker(2)).toHaveText(/3% gas/)

  // should go to profile editor step
  await page.getByTestId('next-button').click()

  // should show a confirmation dialog that records are public
  await page.getByTestId('show-add-profile-records-modal-button').click()
  await page.getByTestId('confirmation-dialog-confirm-button').click()

  // should all setting a gener text record
  await page.getByTestId('profile-record-option-name').click()
  await page.getByTestId('add-profile-records-button').click()
  await page.getByTestId('profile-record-input-input-name').fill('Test Name')

  // should show ETH record by default
  await expect(page.getByTestId('profile-record-input-input-eth')).toHaveValue(
    accounts.getAddress('user'),
  )

  // should show go to info step and show updated estimate
  await expect(page.getByTestId('profile-submit-button')).toHaveText('Next')
  await page.getByTestId('profile-submit-button').click()
  await expect(registrationPage.gas).not.toHaveText(new RegExp(`${estimate} ETH`))

  // should go to transactions step and open commit transaction immediately
  await expect(page.getByTestId('next-button')).toHaveText('Begin')
  await page.getByTestId('next-button').click()
  await expect(page.getByText('Open Wallet')).toBeVisible()
  await transactionModal.confirm()

  // should show countdown
  await expect(page.getByTestId('countdown-circle')).toBeVisible()
  await expect(page.getByTestId('countdown-complete-check')).toBeVisible()
  await provider.increaseTime(60)
  await expect(page.getByTestId('finish-button')).toBeEnabled()

  // should save the registration state and the transaction status
  await page.reload()
  await expect(page.getByTestId('finish-button')).toBeEnabled()

  // should allow finalising registration and automatically go to the complete step
  await page.getByTestId('finish-button').click()
  await expect(page.getByText('Open Wallet')).toBeVisible()
  await transactionModal.confirm()

  // should show the correct details on completion
  await expect(page.getByTestId('invoice-item-0-amount')).toHaveText(/0.0003 ETH/)

  await page.getByTestId('view-name').click()
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    accounts.getAddress('user', 5),
  )
})

test('should not allow normal registration less than 28 days', async ({
  page,
  login,
  accounts,
  provider,
  time,
  makePageObject,
}) => {
  const name = `registration-normal-1month-${Date.now()}.eth`
  await setPrimaryName(walletClient, {
    name: '',
    account: createAccounts().getAddress('user') as `0x${string}`,
  })

  const homePage = makePageObject('HomePage')
  const registrationPage = makePageObject('RegistrationPage')
  const transactionModal = makePageObject('TransactionModal')

  await time.sync(500)

  await homePage.goto()
  await login.connect()

  // should redirect to registration page
  await homePage.searchInput.fill(name)
  await homePage.searchInput.press('Enter')
  await expect(page.getByRole('heading', { name: `Register ${name}` })).toBeVisible()

  await test.step('should be able to pick by date', async () => {
    const dateSelection = page.getByTestId('date-selection')
    await expect(dateSelection).toHaveText('Pick by date')

    await dateSelection.click()
  })

  const calendar = await page.getByTestId('calendar')
  const browserTime = await page.evaluate(() => Math.floor(Date.now() / 1000))

  await test.step('should set a date', async () => {
    const lessThanMinDaysLaterInput = await page.evaluate(
      (timestamp) => {
        const _date = new Date(timestamp)
        const year = _date.getFullYear()
        const month = String(_date.getMonth() + 1).padStart(2, '0') // Month is zero-indexed
        const day = String(_date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      },
      (browserTime + daysToSeconds(27)) * 1000,
    )
    await calendar.fill(lessThanMinDaysLaterInput)
    await expect(page.getByTestId('calendar-date')).not.toHaveValue(lessThanMinDaysLaterInput)

    const minDaysLaterInput = await page.evaluate(
      (timestamp) => {
        const _date = new Date(timestamp)
        const year = _date.getFullYear()
        const month = String(_date.getMonth() + 1).padStart(2, '0') // Month is zero-indexed
        const day = String(_date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      },
      (browserTime + daysToSeconds(28)) * 1000,
    )

    await calendar.fill(minDaysLaterInput)

    await expect(page.getByTestId('calendar-date')).toHaveValue(minDaysLaterInput)
    expect(page.getByText('28 days registration', { exact: true })).toBeVisible()
  })

  // should have payment choice ethereum checked and show primary name setting as checked
  await expect(page.getByTestId('payment-choice-ethereum')).toBeChecked()
  await expect(registrationPage.primaryNameToggle).toBeChecked()

  await page.pause()
  // should show adjusted gas estimate when primary name setting checked
  const estimate = await registrationPage.getGas()
  expect(estimate).toBeGreaterThan(0)
  await registrationPage.primaryNameToggle.click()
  const estimate2 = await registrationPage.getGas()
  await expect(estimate2).toBeGreaterThan(0)
  expect(estimate2).toBeLessThan(estimate)
  await registrationPage.primaryNameToggle.click()

  // should show cost comparison accurately
  await expect(registrationPage.yearMarker(0)).toHaveText(/13% gas/)
  await expect(registrationPage.yearMarker(1)).toHaveText(/7% gas/)
  await expect(registrationPage.yearMarker(2)).toHaveText(/3% gas/)

  // should go to profile editor step
  await page.getByTestId('next-button').click()

  // should show a confirmation dialog that records are public
  await page.getByTestId('show-add-profile-records-modal-button').click()
  await page.getByTestId('confirmation-dialog-confirm-button').click()

  // should all setting a gener text record
  await page.getByTestId('profile-record-option-name').click()
  await page.getByTestId('add-profile-records-button').click()
  await page.getByTestId('profile-record-input-input-name').fill('Test Name')

  // should show ETH record by default
  await expect(page.getByTestId('profile-record-input-input-eth')).toHaveValue(
    accounts.getAddress('user'),
  )

  // should show go to info step and show updated estimate
  await expect(page.getByTestId('profile-submit-button')).toHaveText('Next')
  await page.getByTestId('profile-submit-button').click()
  await expect(registrationPage.gas).not.toHaveText(new RegExp(`${estimate} ETH`))

  // should go to transactions step and open commit transaction immediately
  await expect(page.getByTestId('next-button')).toHaveText('Begin')
  await page.getByTestId('next-button').click()
  await expect(page.getByText('Open Wallet')).toBeVisible()
  await transactionModal.confirm()

  // should show countdown
  await expect(page.getByTestId('countdown-circle')).toBeVisible()
  await expect(page.getByTestId('countdown-complete-check')).toBeVisible()
  await provider.increaseTime(60)
  await expect(page.getByTestId('finish-button')).toBeEnabled()

  // should save the registration state and the transaction status
  await page.reload()
  await expect(page.getByTestId('finish-button')).toBeEnabled()

  // should allow finalising registration and automatically go to the complete step
  await page.getByTestId('finish-button').click()
  await expect(page.getByText('Open Wallet')).toBeVisible()
  await transactionModal.confirm()

  // should show the correct details on completion
  await expect(page.getByTestId('invoice-item-0-amount')).toHaveText(/0.0002 ETH/)

  await page.getByTestId('view-name').click()
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    accounts.getAddress('user', 5),
  )
})

test('should be able to detect an existing commit created on a private mempool', async ({
  page,
  login,
  accounts,
  provider,
  time,
  wallet,
  makePageObject,
}) => {
  test.slow()

  const name = `registration-normal-${Date.now()}.eth`
  const homePage = makePageObject('HomePage')
  const registrationPage = makePageObject('RegistrationPage')
  const transactionModal = makePageObject('TransactionModal')

  await time.sync(500)

  await homePage.goto()
  await login.connect()

  await page.pause()
  // should redirect to registration page
  await homePage.searchInput.fill(name)
  await homePage.searchInput.press('Enter')
  await expect(page.getByRole('heading', { name: `Register ${name}` })).toBeVisible()

  await registrationPage.primaryNameToggle.uncheck()

  // should go to profile editor step
  await page.getByTestId('next-button').click()

  await test.step('should be able to find an existing commit', async () => {
    await page.getByTestId('next-button').click()

    await transactionModal.closeButton.click()

    let commitHash: Hash | undefined
    let attempts = 0
    while (!commitHash && attempts < 4) {
      // eslint-disable-next-line no-await-in-loop
      const message = await page.waitForEvent('console')
      // eslint-disable-next-line no-await-in-loop
      const txt = await message.text()
      const hash = txt.split(':')[1]?.trim() as Hash
      if (isHash(hash)) commitHash = hash
      attempts += 1
    }
    expect(commitHash!).toBeDefined()

    const approveTx = await walletClient.writeContract({
      abi: ethRegistrarControllerCommitSnippet,
      address: testClient.chain.contracts.ensEthRegistrarController.address,
      args: [commitHash!],
      functionName: 'commit',
      account: createAccounts().getAddress('user') as `0x${string}`,
    })
    await waitForTransaction(approveTx)

    await page.route('https://api.findblock.xyz/**/*', async (route) => {
      await route.fulfill({
        json: {
          ok: true,
          data: {
            hash: approveTx,
          },
        },
      })
    })

    // should show countdown
    await expect(page.getByTestId('countdown-circle')).toBeVisible()
    await expect(page.getByTestId('countdown-circle')).toContainText(/^[0-6]?[0-9]$/)
    await provider.increaseTime(60)
    await expect(page.getByTestId('countdown-complete-check')).toBeVisible({ timeout: 10000 })
  })

  await test.step('should be able to complete registration when modal is closed', async () => {
    await expect(page.getByTestId('finish-button')).toBeEnabled()

    // should save the registration state and the transaction status
    await page.reload()
    await expect(page.getByTestId('finish-button')).toBeEnabled()

    // should allow finalising registration and automatically go to the complete step
    await page.getByTestId('finish-button').click()
    await expect(page.getByText('Open Wallet')).toBeVisible()
    await transactionModal.confirmButton.click()

    await transactionModal.closeButton.click()

    await expect(transactionModal.transactionModal).toHaveCount(0)

    await wallet.authorize(Web3RequestKind.SendTransaction)
    // await transactionModal.confirm()

    await page.getByTestId('view-name').click()
    await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
      accounts.getAddress('user', 5),
    )
  })
})
