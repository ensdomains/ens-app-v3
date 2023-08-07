import { expect } from '@playwright/test'
import { test } from '@root/playwright'

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
    contracts,
    time,
    makePageObject,
  }) => {
    const reverseRegistrar = await contracts.get('ReverseRegistrar', { signer: 'user' })
    await reverseRegistrar.setName('')

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

    // should show adjusted gas estimate when primary name setting checked
    const estimate = await registrationPage.getGas()
    expect(estimate).toBeGreaterThan(0)
    await registrationPage.primaryNameToggle.click()
    const estimate2 = await registrationPage.getGas()
    await expect(estimate2).toBeGreaterThan(0)
    expect(estimate2).toBeLessThan(estimate)
    await registrationPage.primaryNameToggle.click()

    // should show cost comparison accurately
    await expect(registrationPage.yearMarker(0)).toHaveText(/14% gas/)
    await expect(registrationPage.yearMarker(1)).toHaveText(/8% gas/)
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
    await expect(page.getByTestId('profile-record-input-input-ETH')).toHaveValue(
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
