import { expect } from '@playwright/test'
import { Hash } from 'viem'

import {
  ethRegistrarControllerCommitSnippet,
  legacyEthRegistrarControllerCommitSnippet,
} from '@ensdomains/ensjs/contracts'
import { setPrimaryName } from '@ensdomains/ensjs/wallet'
import { Web3RequestKind } from '@ensdomains/headless-web3-provider'

import { dateToDateInput } from '@app/utils/date'

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

  test('should return price and gas estimate when not logged in', async ({
    page,
    time,
    makePageObject,
    consoleListener,
  }) => {
    await setPrimaryName(walletClient, {
      name: '',
      account: createAccounts().getAddress('user') as `0x${string}`,
    })

    const homePage = makePageObject('HomePage')
    const registrationPage = makePageObject('RegistrationPage')

    await consoleListener.initialize({
      regex: /\[Metrics\] Event:.*?/,
    })

    await time.sync()
    await homePage.goto()

    await test.step('should redirect to registration page', async () => {
      await homePage.searchInput.fill(name)
      await page.locator(`[data-testid="search-result-name"]`, { hasText: name }).waitFor()
      await page.locator(`[data-testid="search-result-name"]`, { hasText: 'Available' }).waitFor()
      await homePage.searchInput.press('Enter')
      await expect(page.getByRole('heading', { name: `Register ${name}` })).toBeVisible()
    })

    await test.step('should fire tracking event: search:select', async () => {
      await expect(consoleListener.getMessages(/search:select/)).toHaveLength(1)
      await expect(consoleListener.getMessages().toString()).toMatch(
        new RegExp(`search:select.*?${name}`),
      )
      consoleListener.clearMessages()
    })

    await test.step('should show cost comparison accurately', async () => {
      // Gas can fluctuate enough to cause the percentage to change, so we check for a range
      await expect(registrationPage.yearMarker(0)).toHaveText(/1[34]% gas/)
      await expect(registrationPage.yearMarker(1)).toHaveText(/8% gas/)
      await expect(registrationPage.yearMarker(2)).toHaveText(/3% gas/)
    })

    await test.step('should show correct price and gas estimate for yearly registration', async () => {
      await expect(registrationPage.fee).toHaveText(/0.0033/)
      const estimate1 = await registrationPage.getGas()
      expect(estimate1).toBeGreaterThan(0)
      await registrationPage.plusYearButton.click()
      await expect(registrationPage.fee).toHaveText(/0.0065/)
      const estimate2 = await registrationPage.getGas()
      expect(estimate2).toEqual(estimate1)
      await registrationPage.minusYearButton.click()
      const estimate3 = await registrationPage.getGas()
      expect(estimate3).toEqual(estimate1)
    })
  })

  test('should allow normal registration, if primary name is set, name is wrapped', async ({
    page,
    login,
    accounts,
    time,
    makePageObject,
    consoleListener,
  }) => {
    await setPrimaryName(walletClient, {
      name: '',
      account: createAccounts().getAddress('user') as `0x${string}`,
    })

    const homePage = makePageObject('HomePage')
    const registrationPage = makePageObject('RegistrationPage')
    const transactionModal = makePageObject('TransactionModal')

    await consoleListener.initialize({
      regex: /\[Metrics\] Event:.*?/,
    })

    await time.sync()
    await homePage.goto()
    await login.connect()

    await test.step('should redirect to registration page', async () => {
      await homePage.searchInput.fill(name)
      await page.locator(`[data-testid="search-result-name"]`, { hasText: name }).waitFor()
      await page.locator(`[data-testid="search-result-name"]`, { hasText: 'Available' }).waitFor()
      await homePage.searchInput.press('Enter')
      await expect(page.getByRole('heading', { name: `Register ${name}` })).toBeVisible()
    })

    await test.step('should fire tracking event: search:select', async () => {
      await expect(consoleListener.getMessages(/search:select/)).toHaveLength(1)
      await expect(consoleListener.getMessages().toString()).toMatch(
        new RegExp(`search:select.*?${name}`),
      )
      consoleListener.clearMessages()
    })

    await test.step('should have payment choice ethereum checked and show primary name setting as checked', async () => {
      await expect(page.getByTestId('payment-choice-ethereum')).toBeChecked()
      await expect(registrationPage.primaryNameToggle).toBeChecked()
    })

    const estimate =
      await test.step('should show adjusted gas estimate when primary name setting checked', async () => {
        const estimate1 = await registrationPage.getGas()
        expect(estimate1).toBeGreaterThan(0)
        await registrationPage.primaryNameToggle.click()
        const estimate2 = await registrationPage.getGas()
        await expect(estimate2).toBeGreaterThan(0)
        expect(estimate2).toBeLessThan(estimate1)
        await registrationPage.primaryNameToggle.click()
        return estimate1
      })

    await test.step('should show cost comparison accurately', async () => {
      // Gas can fluctuate enough to cause the percentage to change, so we check for a range
      await expect(registrationPage.yearMarker(0)).toHaveText(/1[34]% gas/)
      await expect(registrationPage.yearMarker(1)).toHaveText(/7% gas/)
      await expect(registrationPage.yearMarker(2)).toHaveText(/3% gas/)
    })

    await test.step('should show correct price for yearly registration', async () => {
      await expect(registrationPage.fee).toHaveText(/0.0033/)
      await registrationPage.plusYearButton.click()
      await expect(registrationPage.fee).toHaveText(/0.0065/)
      await registrationPage.minusYearButton.click()
    })

    await test.step('should go to profile editor step', async () => {
      await page.getByTestId('next-button').click()
    })

    await test.step('should fire tracking event: register:pricing', async () => {
      await expect(consoleListener.getMessages(/register:pricing/)).toHaveLength(1)
      await expect(consoleListener.getMessages().toString()).toContain('register:pricing')
      consoleListener.clearMessages()
    })

    await test.step('should show a confirmation dialog that records are public', async () => {
      await page.getByTestId('show-add-profile-records-modal-button').click()
      await page.getByTestId('confirmation-dialog-confirm-button').click()
    })

    await test.step('should allow setting a general text record', async () => {
      await page.getByTestId('profile-record-option-name').click()
      await page.getByTestId('add-profile-records-button').click()
      await page.getByTestId('profile-record-input-input-name').fill('Test Name')
    })

    await test.step('should show ETH record by default', async () => {
      await expect(page.getByTestId('profile-record-input-input-eth')).toHaveValue(
        accounts.getAddress('user'),
      )
    })

    await test.step('should show go to info step and show updated estimate', async () => {
      await expect(page.getByTestId('profile-submit-button')).toHaveText('Next')
      await page.getByTestId('profile-submit-button').click()
      await expect(registrationPage.gas).not.toHaveText(new RegExp(`${estimate} ETH`))
    })

    await test.step('should go to transactions step and open commit transaction immediately', async () => {
      await expect(page.getByTestId('next-button')).toHaveText('Begin')
      await page.getByTestId('next-button').click()
      await expect(page.getByTestId('transaction-modal-inner')).toBeVisible()
    })

    await test.step('should fire tracking event: register:info', async () => {
      await expect(consoleListener.getMessages(/register:info/)).toHaveLength(1)
      await expect(consoleListener.getMessages().toString()).toContain('register:info')
      consoleListener.clearMessages()
    })

    await test.step('should display the correct message in the registration page', async () => {
      await transactionModal.closeButton.click()
      await expect(
        page.getByText(
          'You will need to complete two transactions to secure your name. The second transaction must be completed within 24 hours of the first.',
        ),
      ).toBeVisible()
    })

    await test.step('should be able to confirm commit transaction', async () => {
      await page.getByTestId('start-timer-button').click()
      await expect(page.getByText('Open Wallet')).toBeVisible()
      await transactionModal.confirm()
    })

    await test.step('should fire tracking event: wallet:open', async () => {
      await expect(consoleListener.getMessages(/wallet:open/)).toHaveLength(1)
      await expect(consoleListener.getMessages().toString()).toContain('wallet:open')
      consoleListener.clearMessages()
    })

    await test.step('should show countdown text', async () => {
      await expect(
        page.getByText(
          'This wait prevents others from front running your transaction. You will be prompted to complete a second transaction when the timer is complete.',
        ),
      ).toBeVisible()
    })

    await test.step('should show countdown', async () => {
      await time.sync()
      await expect(page.getByTestId('countdown-circle')).toBeVisible()
      await expect(page.getByTestId('countdown-complete-check')).not.toBeVisible()
      const waitButton = page.getByTestId('wait-button')
      await expect(waitButton).toBeVisible()
      await expect(waitButton).toBeDisabled()
    })

    await test.step('should show checkmark and registration ready state after countdown is finished', async () => {
      await time.increaseTime({ seconds: 60 })
      await expect(page.getByTestId('countdown-complete-check')).toBeVisible()
      await expect(page.getByTestId('transactions-subheading')).toHaveText(
        /Your name is not registered until you’ve completed the second transaction. You have (23 hours|1 day) remaining to complete it./,
      )
      await expect(page.getByTestId('finish-button')).toBeEnabled()
    })

    await test.step('should save the registration state and the transaction status', async () => {
      await page.reload()
      await expect(page.getByTestId('finish-button')).toBeEnabled()
    })

    await test.step('should be able to start registration step', async () => {
      await expect(page.getByTestId('transactions-subheading')).toBeVisible()
      await expect(page.getByTestId('transactions-subheading')).toHaveText(
        /Your name is not registered until you’ve completed the second transaction. You have (23 hours|1 day) remaining to complete it./,
      )
      await page.getByTestId('finish-button').click()
    })

    await test.step('should be able to confirm registration transaction', async () => {
      await expect(page.getByText('Open Wallet')).toBeVisible()
      await transactionModal.confirm()
    })

    await test.step('should fire tracking event: wallet:open', async () => {
      await expect(consoleListener.getMessages(/wallet:open/)).toHaveLength(1)
      await expect(consoleListener.getMessages().toString()).toContain('wallet:open')
    })

    await test.step('should redirect to completion page ', async () => {
      await expect(page.getByText(`You are now the owner of ${name}`)).toBeVisible()

      // calculate date one year from now
      const date = await page.evaluate(() => {
        const _date = new Date()
        _date.setFullYear(_date.getFullYear() + 1)
        return _date
      })
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      // should show the correct details on completion
      await expect(page.getByTestId('invoice-item-0-amount')).toHaveText(/0.0032 ETH/)
      await expect(page.getByTestId('invoice-item-0')).toHaveText(/1 year registration/)
      await expect(page.getByTestId('invoice-item-expiry')).toHaveText(/Name expires/)
      await expect(page.getByTestId('invoice-item-expiry-date')).toHaveText(`${formattedDate}`)
    })

    await test.step('should fire tracking event: transaction:register:send', async () => {
      await expect(consoleListener.getMessages(/transaction:register:send/)).toHaveLength(1)
      // We can assume that 'register_override_triggered' was not called because the consoleListener only has one message
      await expect(consoleListener.getMessages().toString()).toContain('transaction:register:send')
      consoleListener.clearMessages()
    })

    await test.step('confirm that the registration is successful', async () => {
      await page.getByTestId('view-name').click()
      await expect(page).toHaveURL(`/${name}`)
      await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
        accounts.getAddress('user', 5),
      )
    })

    await test.step('confirm name is wrapped', async () => {
      await expect(page.getByTestId('permissions-tab')).toBeVisible()
    })
  })

  test('should not direct to the registration page on search, and show all records from registration', async ({
    page,
    accounts,
    makePageObject,
    consoleListener,
  }) => {
    await consoleListener.initialize({
      regex: /\[Metrics\] Event:.*?/,
    })

    const homePage = makePageObject('HomePage')

    await homePage.goto()
    await homePage.searchInput.fill(name)
    await homePage.searchInput.press('Enter')

    await test.step('should not fire tracking event: search_selected_eth', async () => {
      await expect(consoleListener.getMessages(/search:select/)).toHaveLength(0)
    })

    await expect(page).toHaveURL(`/${name}`)

    await expect(page.getByTestId('profile-snippet-nickname')).toHaveText(/Test Name/)
    await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
      new RegExp(accounts.getAddress('user', 5)),
    )
  })

  test('registering a non-primary name should not be wrapped', async ({
    page,
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
      'rgb(56, 137, 255)',
    )

    // should allow registering a name without setting primary name
    await page.getByTestId('next-button').click()
    await transactionModal.confirm()
    await expect(page.getByTestId('countdown-complete-check')).toBeVisible()
    await testClient.increaseTime({ seconds: 60 })
    await page.getByTestId('finish-button').click()
    await transactionModal.confirm()
    await page.getByTestId('view-name').click()
    await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
      new RegExp(accounts.getAddress('user', 5)),
    )

    await test.step('confirm name is unwrapped', async () => {
      await expect(page.getByTestId('permissions-tab')).not.toBeVisible()
    })
  })
})

test('should allow normal registration, from disconnected to connected state', async ({
  page,
  login,
  accounts,
  time,
  makePageObject,
  consoleListener,
}) => {
  const name = `registration-normal-${Date.now()}.eth`

  await setPrimaryName(walletClient, {
    name: '',
    account: createAccounts().getAddress('user') as `0x${string}`,
  })

  const homePage = makePageObject('HomePage')
  const registrationPage = makePageObject('RegistrationPage')
  const transactionModal = makePageObject('TransactionModal')

  await consoleListener.initialize({
    regex: /\[Metrics\] Event:.*?/,
  })

  await time.sync()
  await homePage.goto()

  await test.step('should redirect to registration page', async () => {
    await homePage.searchInput.fill(name)
    await page.locator(`[data-testid="search-result-name"]`, { hasText: name }).waitFor()
    await page.waitForTimeout(2000)
    await page.locator(`[data-testid="search-result-name"]`, { hasText: 'Available' }).waitFor()
    await homePage.searchInput.press('Enter')
    await expect(page.getByRole('heading', { name: `Register ${name}` })).toBeVisible()
  })

  await test.step('should fire tracking event: search:select', async () => {
    await expect(consoleListener.getMessages(/search:select/)).toHaveLength(1)
    await expect(consoleListener.getMessages().toString()).toMatch(
      new RegExp(`search:select.*?${name}`),
    )
    consoleListener.clearMessages()
  })

  await test.step('should show cost comparison accurately', async () => {
    // Gas can fluctuate enough to cause the percentage to change, so we check for a range
    await expect(registrationPage.yearMarker(0)).toHaveText(/1[34]% gas/)
    await expect(registrationPage.yearMarker(1)).toHaveText(/8% gas/)
    await expect(registrationPage.yearMarker(2)).toHaveText(/3% gas/)
  })

  await test.step('should show correct price and gas estimate for yearly registration', async () => {
    await expect(registrationPage.fee).toHaveText(/0.0033/)
    const estimate1 = await registrationPage.getGas()
    expect(estimate1).toBeGreaterThan(0)
    await registrationPage.plusYearButton.click()
    await expect(registrationPage.fee).toHaveText(/0.0065/)
    const estimate2 = await registrationPage.getGas()
    expect(estimate2).toEqual(estimate1)
    await registrationPage.minusYearButton.click()
    const estimate3 = await registrationPage.getGas()
    expect(estimate3).toEqual(estimate1)
  })

  await login.connect()

  await test.step('should have payment choice ethereum checked and show primary name setting as checked', async () => {
    await expect(page.getByTestId('payment-choice-ethereum')).toBeChecked()
    await expect(registrationPage.primaryNameToggle).toBeChecked()
  })

  const estimate =
    await test.step('should show adjusted gas estimate when primary name setting checked', async () => {
      const estimate1 = await registrationPage.getGas()
      expect(estimate1).toBeGreaterThan(0)
      await registrationPage.primaryNameToggle.click()
      const estimate2 = await registrationPage.getGas()
      await expect(estimate2).toBeGreaterThan(0)
      expect(estimate2).toBeLessThan(estimate1)
      await registrationPage.primaryNameToggle.click()
      return estimate1
    })

  await test.step('should show cost comparison accurately', async () => {
    // Gas can fluctuate enough to cause the percentage to change, so we check for a range
    await expect(registrationPage.yearMarker(0)).toHaveText(/1[34]% gas/)
    await expect(registrationPage.yearMarker(1)).toHaveText(/7% gas/)
    await expect(registrationPage.yearMarker(2)).toHaveText(/3% gas/)
  })

  await test.step('should show correct price for yearly registration', async () => {
    await expect(registrationPage.fee).toHaveText(/0.0033/)
    await registrationPage.plusYearButton.click()
    await expect(registrationPage.fee).toHaveText(/0.0065/)
    await registrationPage.minusYearButton.click()
  })

  await test.step('should go to profile editor step', async () => {
    await page.getByTestId('next-button').click()
  })

  await test.step('should fire tracking event: register:pricing', async () => {
    await expect(consoleListener.getMessages(/register:pricing/)).toHaveLength(1)
    await expect(consoleListener.getMessages().toString()).toContain('register:pricing')
    consoleListener.clearMessages()
  })

  await test.step('should show a confirmation dialog that records are public', async () => {
    await page.getByTestId('show-add-profile-records-modal-button').click()
    await page.getByTestId('confirmation-dialog-confirm-button').click()
  })

  await test.step('should allow setting a general text record', async () => {
    await page.getByTestId('profile-record-option-name').click()
    await page.getByTestId('add-profile-records-button').click()
    await page.getByTestId('profile-record-input-input-name').fill('Test Name')
  })

  await test.step('should show ETH record by default', async () => {
    await expect(page.getByTestId('profile-record-input-input-eth')).toHaveValue(
      accounts.getAddress('user'),
    )
  })

  await test.step('should show go to info step and show updated estimate', async () => {
    await expect(page.getByTestId('profile-submit-button')).toHaveText('Next')
    await page.getByTestId('profile-submit-button').click()
    await expect(registrationPage.gas).not.toHaveText(new RegExp(`${estimate} ETH`))
  })

  await test.step('should go to transactions step and open commit transaction immediately', async () => {
    await expect(page.getByTestId('next-button')).toHaveText('Begin')
    await page.getByTestId('next-button').click()
    await expect(page.getByTestId('transaction-modal-inner')).toBeVisible()
  })

  await test.step('should fire tracking event: register:info', async () => {
    await expect(consoleListener.getMessages(/register:info/)).toHaveLength(1)
    await expect(consoleListener.getMessages().toString()).toContain('register:info')
    consoleListener.clearMessages()
  })

  await test.step('should display the correct message in the registration page', async () => {
    await transactionModal.closeButton.click()
    await expect(
      page.getByText(
        'You will need to complete two transactions to secure your name. The second transaction must be completed within 24 hours of the first.',
      ),
    ).toBeVisible()
  })

  await test.step('should be able to confirm commit transaction', async () => {
    await page.getByTestId('start-timer-button').click()
    await expect(page.getByText('Open Wallet')).toBeVisible()
    await transactionModal.confirm()
  })

  await test.step('should fire tracking event: wallet:open', async () => {
    await expect(consoleListener.getMessages(/wallet:open/)).toHaveLength(1)
    await expect(consoleListener.getMessages().toString()).toContain('wallet:open')
    consoleListener.clearMessages()
  })

  await test.step('should show countdown text', async () => {
    await expect(
      page.getByText(
        'This wait prevents others from front running your transaction. You will be prompted to complete a second transaction when the timer is complete.',
      ),
    ).toBeVisible()
  })

  await test.step('should show countdown', async () => {
    await time.sync()
    await expect(page.getByTestId('countdown-circle')).toBeVisible()
    await expect(page.getByTestId('countdown-complete-check')).not.toBeVisible()
    const waitButton = page.getByTestId('wait-button')
    await expect(waitButton).toBeVisible()
    await expect(waitButton).toBeDisabled()
  })

  await test.step('should show checkmark and registration ready state after countdown is finished', async () => {
    await time.increaseTime({ seconds: 60 })
    await expect(page.getByTestId('countdown-complete-check')).toBeVisible()
    await expect(page.getByTestId('transactions-subheading')).toHaveText(
      /Your name is not registered until you’ve completed the second transaction. You have (23 hours|1 day) remaining to complete it./,
    )
    await expect(page.getByTestId('finish-button')).toBeEnabled()
  })

  await test.step('should save the registration state and the transaction status', async () => {
    await page.reload()
    await expect(page.getByTestId('finish-button')).toBeEnabled()
  })

  await test.step('should be able to start registration step', async () => {
    await expect(page.getByTestId('transactions-subheading')).toBeVisible()
    await expect(page.getByTestId('transactions-subheading')).toHaveText(
      /Your name is not registered until you’ve completed the second transaction. You have (23 hours|1 day) remaining to complete it./,
    )
    await page.getByTestId('finish-button').click()
  })

  await test.step('should be able to confirm registration transaction', async () => {
    await expect(page.getByText('Open Wallet')).toBeVisible()
    await transactionModal.confirm()
  })

  await test.step('should fire tracking event: wallet:open', async () => {
    await expect(consoleListener.getMessages(/wallet:open/)).toHaveLength(1)
    await expect(consoleListener.getMessages().toString()).toContain('wallet:open')
  })

  await test.step('should redirect to completion page ', async () => {
    await expect(page.getByText(`You are now the owner of ${name}`)).toBeVisible()

    // calculate date one year from now
    const date = await page.evaluate(() => {
      const _date = new Date()
      _date.setFullYear(_date.getFullYear() + 1)
      return _date
    })
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // should show the correct details on completion
    await expect(page.getByTestId('invoice-item-0-amount')).toHaveText(/0.0032 ETH/)
    await expect(page.getByTestId('invoice-item-0')).toHaveText(/1 year registration/)
    await expect(page.getByTestId('invoice-item-expiry')).toHaveText(/Name expires/)
    await expect(page.getByTestId('invoice-item-expiry-date')).toHaveText(`${formattedDate}`)
  })

  await test.step('should fire tracking event: transaction:register:send', async () => {
    await expect(consoleListener.getMessages(/transaction:register:send/)).toHaveLength(1)
    // We can assume that 'register_override_triggered' was not called because the consoleListener only has one message
    await expect(consoleListener.getMessages().toString()).toContain('transaction:register:send')
    consoleListener.clearMessages()
  })

  await test.step('confirm that the registration is successful', async () => {
    await page.getByTestId('view-name').click()
    await expect(page).toHaveURL(`/${name}`)
    await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
      accounts.getAddress('user', 5),
    )
  })

  await test.step('confirm name is wrapped', async () => {
    await expect(page.getByTestId('permissions-tab')).toBeVisible()
  })
})

test('registering a premium name with no records should not be wrapped', async ({
  page,
  login,
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

  await page.getByTestId('primary-name-toggle').uncheck()
  await page.getByTestId('payment-choice-ethereum').click()
  await expect(page.getByTestId('invoice-item-2-amount')).toBeVisible()
  await page.getByTestId('next-button').click()
  if (await page.getByTestId('profile-submit-button').isVisible()) {
    await page.getByTestId('profile-submit-button').click()
  }

  await page.getByTestId('next-button').click()
  await transactionModal.confirm()

  await expect(page.getByTestId('countdown-complete-check')).toBeVisible()
  await testClient.increaseTime({ seconds: 120 })
  await page.getByTestId('finish-button').click()
  await transactionModal.confirm()

  await page.getByTestId('view-name').click()
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    new RegExp(accounts.getAddress('user', 5)),
  )

  await test.step('confirm name is unwrapped', async () => {
    await expect(page.getByTestId('permissions-tab')).not.toBeVisible()
  })

  const morePage = makePageObject('MorePage')
  await morePage.goto(premiumName)

  await expect(morePage.wrapButton).toBeVisible()
})

test('registering a premium name with primary name not set should not be wrapped', async ({
  page,
  login,
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

  await setPrimaryName(walletClient, {
    name: 'premium',
    account: createAccounts().getAddress('user2') as `0x${string}`,
  })

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
  await testClient.increaseTime({ seconds: 120 })
  await page.getByTestId('finish-button').click()
  await transactionModal.confirm()

  await page.getByTestId('view-name').click()
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    new RegExp(accounts.getAddress('user', 5)),
  )

  await test.step('confirm name is wrapped', async () => {
    await expect(page.getByTestId('permissions-tab')).not.toBeVisible()
  })

  const morePage = makePageObject('MorePage')
  await morePage.goto(premiumName)
  await expect(morePage.wrapButton).toBeVisible()

  const recordsPage = makePageObject('RecordsPage')
  await recordsPage.goto(premiumName)

  await expect(recordsPage.getRecordValue('address', 'ETH')).toHaveText(
    createAccounts().getAddress('user') as `0x${string}`,
  )
})

test('registering a premium name with primary name set should be wrapped', async ({
  page,
  login,
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

  await setPrimaryName(walletClient, {
    name: 'premium',
    account: createAccounts().getAddress('user') as `0x${string}`,
  })

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
  await testClient.increaseTime({ seconds: 120 })
  await page.getByTestId('finish-button').click()
  await transactionModal.confirm()

  await page.getByTestId('view-name').click()
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    new RegExp(accounts.getAddress('user', 5)),
  )

  await test.step('confirm name is wrapped', async () => {
    await expect(page.getByTestId('permissions-tab')).toBeVisible()
  })

  const morePage = makePageObject('MorePage')
  await morePage.goto(premiumName)
  await expect(morePage.wrapButton).toHaveCount(0)

  const recordsPage = makePageObject('RecordsPage')
  await recordsPage.goto(premiumName)

  await expect(recordsPage.getRecordValue('address', 'ETH')).toHaveText(
    createAccounts().getAddress('user') as `0x${string}`,
  )
})

test('registering a premium name with existing records should not be wrapped', async ({
  page,
  login,
  accounts,
  makeName,
  makePageObject,
}) => {
  const premiumName = await makeName(
    {
      label: 'premium',
      owner: 'user2',
      type: 'legacy',
      records: {
        coins: [
          {
            coin: 'etcLegacy',
            value: '0x42D63ae25990889E35F215bC95884039Ba354115',
          },
          {
            coin: 'ETH',
            value: createAccounts().getAddress('user') as `0x${string}`,
          },
        ],
      },
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
  await testClient.increaseTime({ seconds: 120 })
  await page.getByTestId('finish-button').click()
  await transactionModal.confirm()

  await page.getByTestId('view-name').click()
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    new RegExp(accounts.getAddress('user', 5)),
  )

  const recordsPage = makePageObject('RecordsPage')
  await recordsPage.goto(premiumName)

  await expect(recordsPage.getRecordValue('address', 'ETH')).toHaveText(
    createAccounts().getAddress('user') as `0x${string}`,
  )
})

test('registering a wrapped premium name with no records should not be wrapped', async ({
  page,
  login,
  accounts,
  makeName,
  makePageObject,
}) => {
  const premiumName = await makeName(
    {
      label: 'premium',
      owner: 'user2',
      type: 'wrapped',
      duration: -7890000 - 4 * 345600, // 3 months 4 days
    },
    { timeOffset: 500 },
  )

  const transactionModal = makePageObject('TransactionModal')

  await page.goto(`/${premiumName}/register`)
  await login.connect()

  await page.getByTestId('primary-name-toggle').uncheck()
  await page.getByTestId('payment-choice-ethereum').click()
  await expect(page.getByTestId('invoice-item-2-amount')).toBeVisible()
  await page.getByTestId('next-button').click()
  if (await page.getByTestId('profile-submit-button').isVisible()) {
    await page.getByTestId('profile-submit-button').click()
  }

  await page.getByTestId('next-button').click()
  await transactionModal.confirm()

  await expect(page.getByTestId('countdown-complete-check')).toBeVisible()
  await testClient.increaseTime({ seconds: 120 })
  await page.getByTestId('finish-button').click()
  await transactionModal.confirm()

  await page.getByTestId('view-name').click()
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    new RegExp(accounts.getAddress('user', 5)),
  )

  await test.step('confirm name is unwrapped', async () => {
    await expect(page.getByTestId('permissions-tab')).not.toBeVisible()
  })

  const morePage = makePageObject('MorePage')
  await morePage.goto(premiumName)

  await expect(morePage.wrapButton).toBeVisible()

  const recordsPage = makePageObject('RecordsPage')
  await recordsPage.goto(premiumName)

  await expect(recordsPage.getRecordValue('address', 'ETH')).toHaveText(
    createAccounts().getAddress('user') as `0x${string}`,
  )
})

test('registering a wrapped premium name with records set should be wrapped', async ({
  page,
  login,
  accounts,
  makeName,
  makePageObject,
}) => {
  const premiumName = await makeName(
    {
      label: 'premium',
      owner: 'user',
      type: 'wrapped',
      duration: -7890000 - 4 * 345600, // 3 months 4 days
      records: {
        coins: [
          {
            coin: 'ETH',
            value: createAccounts().getAddress('user') as `0x${string}`,
          },
          {
            coin: 'etcLegacy',
            value: '0x42D63ae25990889E35F215bC95884039Ba354115',
          },
        ],
      },
    },
    { timeOffset: 500 },
  )

  const transactionModal = makePageObject('TransactionModal')

  await page.goto(`/${premiumName}/register`)
  await login.connect()

  await page.getByTestId('primary-name-toggle').uncheck()
  await page.getByTestId('payment-choice-ethereum').click()
  await expect(page.getByTestId('invoice-item-2-amount')).toBeVisible()
  await page.getByTestId('next-button').click()

  await page.getByTestId('setup-profile-button').click()

  await test.step('add a text record', async () => {
    await page.getByTestId('show-add-profile-records-modal-button').click()
    await page.getByTestId('confirmation-dialog-confirm-button').click()
    await page.getByTestId('profile-record-option-name').click()
    await page.getByTestId('add-profile-records-button').click()
    await page.getByTestId('profile-record-input-input-name').fill('Test Name')
    await page.getByTestId('profile-submit-button').click()
  })

  await page.getByTestId('next-button').click()
  await transactionModal.confirm()

  await expect(page.getByTestId('countdown-complete-check')).toBeVisible()
  await testClient.increaseTime({ seconds: 120 })
  await page.getByTestId('finish-button').click()
  await transactionModal.confirm()

  await page.getByTestId('view-name').click()

  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    new RegExp(accounts.getAddress('user', 5)),
  )

  await test.step('confirm name is wrapped', async () => {
    await expect(page.getByTestId('permissions-tab')).toBeVisible()
  })

  const morePage = makePageObject('MorePage')
  await morePage.goto(premiumName)
  await expect(morePage.wrapButton).toHaveCount(0)

  const recordsPage = makePageObject('RecordsPage')
  await recordsPage.goto(premiumName)

  await expect(recordsPage.getRecordValue('text', 'name')).toHaveText('Test Name')
  await expect(recordsPage.getRecordValue('address', 'ETH')).toHaveText(
    createAccounts().getAddress('user') as `0x${string}`,
  )
})

test('should allow registering a name and resuming from the commit toast', async ({
  page,
  login,
  time,
  makePageObject,
}) => {
  await time.sync(500)

  const name = `registration-resume-${Date.now()}.eth`

  const transactionModal = makePageObject('TransactionModal')

  await page.goto(`/${name}/register`)
  await login.connect()

  await page.getByTestId('payment-choice-ethereum').click()
  await page.getByTestId('primary-name-toggle').uncheck()
  await page.getByTestId('next-button').click()
  await page.getByTestId('next-button').click()

  await testClient.setAutomine(false)

  await transactionModal.confirm()

  await page.getByTestId('transaction-modal-sent-button').click()
  await page.goto('/')
  await testClient.setAutomine(true)

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

  await page.getByTestId('payment-choice-ethereum').check()
  await registrationPage.primaryNameToggle.uncheck()

  await test.step('should be able to pick by date', async () => {
    const dateSelection = page.getByTestId('date-selection')
    await expect(dateSelection).toHaveText('Pick by date')

    await dateSelection.click()
  })

  const calendar = await page.getByTestId('calendar')
  const browserTime = await page.evaluate(() => Math.floor(Date.now() / 1000))

  const oneYearLater = await page.evaluate((timestamp) => {
    const _date = new Date(timestamp)
    _date.setFullYear(_date.getFullYear() + 1)
    return _date
  }, browserTime * 1000)

  await test.step('should have a correct default date', async () => {
    expect(calendar).toHaveValue(dateToDateInput(oneYearLater))
    expect(page.getByText('1 year registration', { exact: true })).toBeVisible()
  })

  await test.step('should set a date', async () => {
    const twoYearsAndHalfLater = await page.evaluate((timestamp) => {
      const _date = new Date(timestamp)
      _date.setFullYear(_date.getFullYear() + 2)
      _date.setMonth(_date.getMonth() + 6)
      return _date
    }, browserTime * 1000)

    await calendar.fill(dateToDateInput(twoYearsAndHalfLater))

    await expect(page.getByTestId('calendar-date')).toHaveValue(
      dateToDateInput(twoYearsAndHalfLater),
    )

    expect(page.getByText('2 years, 6 months registration', { exact: true })).toBeVisible()
  })

  // should have payment choice ethereum checked and show primary name setting as checked
  await expect(page.getByTestId('payment-choice-ethereum')).toBeChecked()
  await expect(registrationPage.primaryNameToggle).not.toBeChecked()

  await test.step('should show correct price marker data for unwrapped registration (for 2.5 years)', async () => {
    await expect(registrationPage.yearMarker(0)).toHaveText(/9% gas/)
    await expect(registrationPage.yearMarker(1)).toHaveText(/5% gas/)
    await expect(registrationPage.yearMarker(2)).toHaveText(/2% gas/)
  })
})

test('should allow registering a premium name with a specific date', async ({
  page,
  login,
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
    const twoYearsAndHalfLater = await page.evaluate((timestamp) => {
      const _date = new Date(timestamp)
      _date.setFullYear(_date.getFullYear() + 2)
      _date.setMonth(_date.getMonth() + 6)
      return _date
    }, browserTime * 1000)

    await calendar.fill(dateToDateInput(twoYearsAndHalfLater))

    await expect(page.getByTestId('calendar-date')).toHaveValue(
      dateToDateInput(twoYearsAndHalfLater),
    )

    expect(page.getByText('2 years, 6 months registration', { exact: true })).toBeVisible()
  })

  await page.getByTestId('payment-choice-ethereum').click()
  await page.getByTestId('primary-name-toggle').check()

  await expect(page.getByTestId('invoice-item-2-amount')).toBeVisible()
  await page.getByTestId('next-button').click()
  if (await page.getByTestId('profile-submit-button').isVisible()) {
    await page.getByTestId('profile-submit-button').click()
  }

  await page.getByTestId('next-button').click()
  await transactionModal.confirm()

  await expect(page.getByTestId('countdown-complete-check')).toBeVisible()
  await testClient.increaseTime({ seconds: 120 })
  await page.getByTestId('finish-button').click()
  await transactionModal.confirm()

  await page.getByTestId('view-name').click()
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    new RegExp(accounts.getAddress('user', 5)),
  )

  await test.step('confirm name is wrapped', async () => {
    await expect(page.getByTestId('permissions-tab')).toBeVisible()
  })
})

test('should allow registering a premium name for two months', async ({
  page,
  login,
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
    const twoMonthsLater = await page.evaluate((timestamp) => {
      const _date = new Date(timestamp)
      _date.setMonth(_date.getMonth() + 2)
      return _date
    }, browserTime * 1000)

    await calendar.fill(dateToDateInput(twoMonthsLater))

    await expect(page.getByTestId('calendar-date')).toHaveValue(dateToDateInput(twoMonthsLater))

    expect(page.getByText(/2 months .* registration/)).toBeVisible()
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
  await testClient.increaseTime({ seconds: 120 })
  await page.getByTestId('finish-button').click()
  await transactionModal.confirm()

  await page.getByTestId('view-name').click()
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    new RegExp(accounts.getAddress('user', 5)),
  )

  await test.step('confirm name is unwrapped', async () => {
    await expect(page.getByTestId('permissions-tab')).not.toBeVisible()
  })
})

test('should not allow registering a premium name for less than 28 days', async ({
  page,
  login,
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
    const lessThan27Days = await page.evaluate((timestamp) => {
      const _date = new Date(timestamp)
      _date.setDate(_date.getDate() + 27)
      return _date
    }, browserTime * 1000)

    await calendar.fill(dateToDateInput(lessThan27Days))

    await expect(page.getByTestId('calendar-date')).not.toHaveValue(dateToDateInput(lessThan27Days))
  })

  await test.step('should allow 28 days', async () => {
    const set28days = await page.evaluate((timestamp) => {
      const _date = new Date(timestamp)
      _date.setDate(_date.getDate() + 28)
      return _date
    }, browserTime * 1000)

    await calendar.fill(dateToDateInput(set28days))

    await expect(page.getByTestId('calendar-date')).toHaveValue(dateToDateInput(set28days))

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
  await testClient.increaseTime({ seconds: 120 })
  await page.getByTestId('finish-button').click()
  await transactionModal.confirm()

  await page.getByTestId('view-name').click()
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    new RegExp(accounts.getAddress('user', 5)),
  )

  await test.step('confirm name is unwrapped', async () => {
    await expect(page.getByTestId('permissions-tab')).not.toBeVisible()
  })
})

test('should allow normal registration for a month', async ({
  page,
  login,
  accounts,
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
    const oneMonthLater = await page.evaluate((timestamp) => {
      const _date = new Date(timestamp)
      _date.setMonth(_date.getMonth() + 1)
      return _date
    }, browserTime * 1000)

    await calendar.fill(dateToDateInput(oneMonthLater))

    await expect(page.getByTestId('calendar-date')).toHaveValue(dateToDateInput(oneMonthLater))
    await expect(page.getByText(/1 month .* registration/)).toBeVisible()
  })

  // should have payment choice ethereum checked and show primary name setting as checked
  await expect(page.getByTestId('payment-choice-ethereum')).toBeChecked()
  await expect(registrationPage.primaryNameToggle).toBeChecked()

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
  await expect(page.getByTestId('countdown-complete-check')).not.toBeVisible()
  await testClient.increaseTime({ seconds: 60 })
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

  await test.step('confirm name is wrapped', async () => {
    await expect(page.getByTestId('permissions-tab')).toBeVisible()
  })
})

test('should not allow normal registration less than 28 days', async ({
  page,
  login,
  accounts,
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
    const lessThanMinDaysLater = await page.evaluate((timestamp) => {
      const _date = new Date(timestamp)
      _date.setDate(_date.getDate() + 27)
      return _date
    }, browserTime * 1000)

    await calendar.fill(dateToDateInput(lessThanMinDaysLater))
    await expect(page.getByTestId('calendar-date')).not.toHaveValue(
      dateToDateInput(lessThanMinDaysLater),
    )

    const minDaysLater = await page.evaluate((timestamp) => {
      const _date = new Date(timestamp)
      _date.setDate(_date.getDate() + 28)
      return _date
    }, browserTime * 1000)

    await calendar.fill(dateToDateInput(minDaysLater))

    await expect(page.getByTestId('calendar-date')).toHaveValue(dateToDateInput(minDaysLater))
    expect(page.getByText('28 days registration', { exact: true })).toBeVisible()
  })

  // should have payment choice ethereum checked and show primary name setting as checked
  await expect(page.getByTestId('payment-choice-ethereum')).toBeChecked()
  await expect(registrationPage.primaryNameToggle).toBeChecked()

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
  await testClient.increaseTime({ seconds: 60 })
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

  await test.step('confirm name is wrapped (set primary name)', async () => {
    await expect(page.getByTestId('permissions-tab')).toBeVisible()
  })
})

test('should be able to detect an existing commit created on a private mempool for a wrapped registration', async ({
  page,
  login,
  accounts,
  time,
  wallet,
  consoleListener,
  makePageObject,
}) => {
  test.slow()

  const name = `registration-normal-${Date.now()}.eth`
  const homePage = makePageObject('HomePage')
  const registrationPage = makePageObject('RegistrationPage')
  const transactionModal = makePageObject('TransactionModal')
  await consoleListener.initialize({
    regex: /commit is:/,
  })

  await time.sync(500)

  await homePage.goto()
  await login.connect()

  // should redirect to registration page
  await homePage.searchInput.fill(name)
  await homePage.searchInput.press('Enter')
  await expect(page.getByRole('heading', { name: `Register ${name}` })).toBeVisible()

  await registrationPage.primaryNameToggle.check()

  // should go to profile editor step
  await page.getByTestId('next-button').click()

  await page.getByTestId('profile-submit-button').click()

  await test.step('should be able to find an existing commit', async () => {
    await page.getByTestId('next-button').click()

    await transactionModal.closeButton.click()

    await expect(consoleListener.getMessages().length).toBeGreaterThan(0)
    const commitHash = consoleListener.getMessages()[0].split(':')[1]?.trim() as Hash

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
    await testClient.increaseTime({ seconds: 60 })
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

    await page.getByTestId('view-name').click()
    await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
      accounts.getAddress('user', 5),
    )

    await test.step('confirm name is unwrapped', async () => {
      await expect(page.getByTestId('permissions-tab')).toBeVisible()
    })
  })
})

test('should be able to detect an existing commit created on a private mempool for a legacy registration', async ({
  page,
  login,
  accounts,
  time,
  wallet,
  consoleListener,
  makePageObject,
}) => {
  test.slow()

  const name = `registration-normal-${Date.now()}.eth`
  const homePage = makePageObject('HomePage')
  const registrationPage = makePageObject('RegistrationPage')
  const transactionModal = makePageObject('TransactionModal')
  await consoleListener.initialize({
    regex: /commit is:/,
  })

  await time.sync(500)

  await homePage.goto()
  await login.connect()

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

    await expect(consoleListener.getMessages().length).toBeGreaterThan(0)
    const commitHash = consoleListener.getMessages()[0].split(':')[1]?.trim() as Hash

    const approveTx = await walletClient.writeContract({
      abi: legacyEthRegistrarControllerCommitSnippet,
      address: testClient.chain.contracts.legacyEthRegistrarController.address,
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
    await testClient.increaseTime({ seconds: 60 })

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

    await page.getByTestId('view-name').click()
    await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
      accounts.getAddress('user', 5),
    )

    await test.step('confirm name is unwrapped', async () => {
      await expect(page.getByTestId('permissions-tab')).not.toBeVisible()
    })
  })
})
test.describe('Error handling', () => {
  test('should be able to detect an existing commit created on a private mempool', async ({
    page,
    login,
    time,
    makePageObject,
  }) => {
    test.slow()

    const homePage = makePageObject('HomePage')
    const registrationPage = makePageObject('RegistrationPage')
    const transactionModal = makePageObject('TransactionModal')

    await time.sync()

    await homePage.goto()
    await login.connect()

    const name = `expired-commit-${Date.now()}.eth`
    // should redirect to registration page
    await homePage.searchInput.fill(name)
    await homePage.searchInput.press('Enter')
    await expect(page.getByRole('heading', { name: `Register ${name}` })).toBeVisible()

    await test.step('pricing page', async () => {
      await page.getByTestId('payment-choice-ethereum').check()
      await registrationPage.primaryNameToggle.uncheck()
      await page.getByTestId('next-button').click()
    })

    await test.step('info page', async () => {
      await expect(page.getByTestId('next-button')).toHaveText('Begin')
      await page.getByTestId('next-button').click()
    })

    await test.step('transaction: commit', async () => {
      await expect(page.getByText('Open Wallet')).toBeVisible()
      await transactionModal.confirm()
      await expect(page.getByText(`Your "Start timer" transaction was successful`)).toBeVisible()
      await time.sync()
      await page.waitForTimeout(1000)
      await time.increaseTime({ seconds: 60 * 60 * 24 })
    })

    await expect(
      page.getByText('Your registration has expired. You will need to start the process again.'),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Restart' })).toBeVisible()
    await expect(page.getByTestId('finish-button')).toHaveCount(0)
  })

  test('should be able to register name if the commit transaction does not update', async ({
    page,
    login,
    accounts,
    time,
    makePageObject,
    consoleListener,
  }) => {
    test.slow()

    const homePage = makePageObject('HomePage')
    const registrationPage = makePageObject('RegistrationPage')
    const transactionModal = makePageObject('TransactionModal')

    await time.sync()
    await consoleListener.initialize({
      regex: /\[Metrics\] Event:.*?/,
    })
    await homePage.goto()
    await login.connect()

    const name = `stuck-commit-${Date.now()}.eth`
    // should redirect to registration page
    await homePage.searchInput.fill(name)
    await homePage.searchInput.press('Enter')
    await expect(page.getByRole('heading', { name: `Register ${name}` })).toBeVisible()

    await test.step('pricing page', async () => {
      await page.getByTestId('payment-choice-ethereum').check()
      await registrationPage.primaryNameToggle.uncheck()
      await page.getByTestId('next-button').click()
    })

    await test.step('info page', async () => {
      await expect(page.getByTestId('next-button')).toHaveText('Begin')
      await page.getByTestId('next-button').click()
    })

    await test.step('transaction: commit', async () => {
      await expect(page.getByText('Open Wallet')).toBeVisible()
      await transactionModal.confirm()
      await expect(page.getByText(`Your "Start timer" transaction was successful`)).toBeVisible()
      await time.increaseTimeByTimestamp({ seconds: 120 })
    })

    await test.step('transaction: register', async () => {
      await expect(page.getByTestId('finish-button')).toBeVisible({ timeout: 10000 })
      await expect(page.getByTestId('finish-button')).toBeEnabled()

      await page.getByTestId('finish-button').click()
      await expect(page.getByText('Open Wallet')).toBeVisible()
      await transactionModal.confirm()

      await page.getByTestId('view-name').click()
      await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
        accounts.getAddress('user', 5),
      )
    })

    await test.step('confirm posthog event was fired once', async () => {
      expect(consoleListener.getMessages(/transaction:register:override/)).toHaveLength(1)
    })
  })
})

test('should display correct price and gas estimate when registering a premium name when not logged in', async ({
  page,
  makeName,
  makePageObject,
}) => {
  const registrationPage = makePageObject('RegistrationPage')
  const premiumName = await makeName(
    {
      label: 'premium',
      owner: 'user2',
      type: 'legacy',
      duration: -7890000 - 4 * 345600, // 3 months 4 days
    },
    { timeOffset: 500 },
  )

  await page.goto(`/${premiumName}/register`)

  await test.step('should be able to pick by date', async () => {
    const dateSelection = page.getByTestId('date-selection')
    await expect(dateSelection).toHaveText('Pick by date')

    await dateSelection.click()
  })

  const browserTime = await page.evaluate(() => Math.floor(Date.now() / 1000))

  const calendar = page.getByTestId('calendar')

  await test.step('should set a date', async () => {
    const twoMonthsLater = await page.evaluate((timestamp) => {
      const _date = new Date(timestamp)
      _date.setMonth(_date.getMonth() + 2)
      return _date
    }, browserTime * 1000)

    await calendar.fill(dateToDateInput(twoMonthsLater))

    await expect(page.getByTestId('calendar-date')).toHaveValue(dateToDateInput(twoMonthsLater))

    expect(page.getByText(/2 months .* registration/)).toBeVisible()
  })
  await expect(page.getByTestId('invoice-item-2-amount')).toBeVisible()
  const estimate = await registrationPage.getGas()
  expect(estimate).toBeGreaterThan(0)

  await page.getByTestId('date-selection').click()

  await test.step('should show correct price and gas estimate for yearly registration', async () => {
    await expect(registrationPage.fee).toHaveText(/0.0033/)
    const estimate1 = await registrationPage.getGas()
    expect(estimate1).toBeGreaterThan(0)
    await registrationPage.plusYearButton.click()
    await expect(registrationPage.fee).toHaveText(/0.0065/)
    const estimate2 = await registrationPage.getGas()
    expect(estimate2).toEqual(estimate1)
    await registrationPage.minusYearButton.click()
    const estimate3 = await registrationPage.getGas()
    expect(estimate3).toEqual(estimate1)
  })
})

test('should allow registering a premium name for two months, user should connect from a not-logged in state', async ({
  page,
  login,
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

  await test.step('should be able to pick by date', async () => {
    const dateSelection = page.getByTestId('date-selection')
    await expect(dateSelection).toHaveText('Pick by date')

    await dateSelection.click()
  })

  const browserTime = await page.evaluate(() => Math.floor(Date.now() / 1000))

  const calendar = page.getByTestId('calendar')

  await test.step('should set a date', async () => {
    const twoMonthsLater = await page.evaluate((timestamp) => {
      const _date = new Date(timestamp)
      _date.setMonth(_date.getMonth() + 2)
      return _date
    }, browserTime * 1000)

    await calendar.fill(dateToDateInput(twoMonthsLater))

    await expect(page.getByTestId('calendar-date')).toHaveValue(dateToDateInput(twoMonthsLater))

    expect(page.getByText(/2 months .* registration/)).toBeVisible()
  })

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
  await testClient.increaseTime({ seconds: 120 })
  await page.getByTestId('finish-button').click()
  await transactionModal.confirm()

  await page.getByTestId('view-name').click()
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    new RegExp(accounts.getAddress('user', 5)),
  )

  await test.step('confirm name is unwrapped', async () => {
    await expect(page.getByTestId('permissions-tab')).not.toBeVisible()
  })
})
