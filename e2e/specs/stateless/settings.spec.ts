import { expect } from '@playwright/test'

import { test } from '../../../playwright'

test.describe('Transactions', () => {
  test('should show the correct transaction details for a transaction modal', async ({
    page,
    login,
    makePageObject,
  }) => {
    const transactionMocal = makePageObject('TransactionModal')

    await page.goto('/')
    await login.connect()

    await page.goto('/my/settings')
    await page.getByText('Test Send Name').click()
    await expect(page.getByTestId('display-item-action-normal')).toHaveText(/Send name/)
    await expect(page.getByTestId('display-item-info-normal')).toHaveText(
      /Set the controller and registrant of the name/,
    )
    await transactionMocal.confirm()
    await expect(page.getByText('Your transaction is now complete!')).toBeVisible()
    await transactionMocal.complete()
    await expect(page.getByTestId('toast-desktop')).toBeVisible()
    await expect(page.getByTestId('toast-desktop')).toHaveText(/Transaction Successful/)
    await expect(page.getByTestId('toast-desktop')).toHaveText(
      /Your "Send name" transaction was successful/,
    )
    await page.getByTestId('toast-close-icon').click()
  })

  test('should add a successful transaction to the transaction list, and show the corresponding notification', async ({
    page,
    login,
    makePageObject,
  }) => {
    const transactionMocal = makePageObject('TransactionModal')

    await page.goto('/')
    await login.connect()

    await page.goto('/my/settings')
    await page.getByText('Add Successful Transaction').click()

    await transactionMocal.authorize()

    await expect(page.getByText('Test transaction', { exact: true })).toBeVisible()

    await expect(page.getByTestId('toast-desktop')).toBeVisible()
    await expect(page.getByTestId('toast-desktop')).toHaveText(/Transaction Successful/)
    await expect(page.getByTestId('toast-desktop')).toHaveText(
      /Your "Test transaction" transaction was successful/,
    )
    await page.getByTestId('toast-close-icon').click()
  })

  test.skip('should add a failed transaction to the transaction list, and show the corresponding notification', async ({
    page,
    login,
    makePageObject,
  }) => {
    const transactionMocal = makePageObject('TransactionModal')

    await page.goto('/')
    await login.connect()

    await page.goto('/my/settings')
    await page.getByText('Add Failing Transaction').click()
    await transactionMocal.authorize()

    await expect(page.getByTestId('transaction-failed')).toHaveText(/Test transaction/)

    await expect(page.getByTestId('toast-desktop')).toHaveText(/Transaction Failure/)
    await expect(page.getByTestId('toast-desktop')).toHaveText(
      /Your "Test transaction" transaction failed and was reverted/,
    )
    await page.getByTestId('toast-close-icon').click()
  })

  // TODO: provider does not save transaction list
  test.skip('should add a pending transaction to the transaction list, and show the corresponding notification once confirmed', async ({
    page,
    login,
    makePageObject,
  }) => {
    const transactionMocal = makePageObject('TransactionModal')

    await page.goto('/')
    await login.connect()

    await page.goto('/my/settings')
    await page.getByText('Stop Automine').click()
    await page.getByText('Add Successful Transaction').click()

    await transactionMocal.authorize()

    await expect(page.getByTestId('transaction-pending')).toHaveText(/Test transaction/)
    await page.getByText('Start Automine').click()
    await expect(page.getByTestId('toast-desktop')).toHaveText(/Transaction Successful/)
    await expect(page.getByTestId('toast-desktop')).toHaveText(
      /Your "Test transaction" transaction was successful/,
    )
    await page.getByTestId('toast-close-icon').click()
  })

  test.skip('should clear transactions when clear is pressed', async ({ page, login }) => {
    await page.goto('/')
    await login.connect()

    await page.goto('/my/settings')
    await page.getByTestId('transaction-clear-button').click()
    await page.getByText('Clear History').click()
    await expect(
      await page
        .getByTestId('transaction-section-container')
        .locator('/div')
        .evaluate((div) => div.children.length),
    ).toBe(1)
  })
})

test.describe('Select Primary Name', () => {
  test('should allow setting unmanaged name that has eth record set to address', async ({
    login,
    makeName,
    makePageObject,
    accounts,
  }) => {
    test.slow()

    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user',
    })

    const transactionModal = makePageObject('TransactionModal')
    const profilePage = makePageObject('ProfilePage')
    await profilePage.goto(name)
    await login.connect()
    const settingsPage = makePageObject('SettingsPage')
    const selectPrimaryNameModal = makePageObject('SelectPrimaryNameModal')
    await settingsPage.goto()
    await expect(settingsPage.walletAddress).toHaveText(new RegExp(accounts.getAddress('user')))
    await settingsPage.choosePrimaryNameButton.click()
    await selectPrimaryNameModal.waitForPageLoad()
    const nameWithoutSuffix = name.slice(0, -4)
    await selectPrimaryNameModal.searchInput.click()
    await selectPrimaryNameModal.searchInput.fill(nameWithoutSuffix)
    await selectPrimaryNameModal.searchInput.press('Enter')
    await selectPrimaryNameModal.waitForPageLoad()
    expect(await selectPrimaryNameModal.getPrimaryNameItem(nameWithoutSuffix)).toBeVisible()
    const nameItem = await selectPrimaryNameModal.getPrimaryNameItem(nameWithoutSuffix)
    await nameItem.click()
    await expect(selectPrimaryNameModal.nextButton).toBeEnabled()
    await selectPrimaryNameModal.nextButton.click()
    await transactionModal.autoComplete()
    await settingsPage.goto()
    await expect(settingsPage.getPrimaryNameLabel()).toHaveText(name, { timeout: 15000 })
  })
})

test.describe('Custom RPC endpoint', () => {
  test('validates, probes, persists and resets a custom RPC endpoint', async ({
    page,
    login,
    makePageObject,
  }) => {
    const settingsPage = makePageObject('SettingsPage')

    await page.goto('/')
    await login.connect()
    await settingsPage.goto()
    await expect(settingsPage.rpcSection).toBeVisible()

    // Use a same-origin sentinel so the probe fetch needs no CORS, and intercept it to report
    // the active (anvil) chain id 0x539 = 1337 so the save-time liveness probe passes.
    const { origin } = new URL(page.url())
    const customUrl = `${origin}/__ens_custom_rpc`
    let probed = false
    await page.route('**/__ens_custom_rpc', async (route) => {
      probed = true
      const body = route.request().postDataJSON()
      const reply = (req: { id?: number }) => ({
        jsonrpc: '2.0',
        id: req?.id ?? 1,
        result: '0x539',
      })
      const payload = Array.isArray(body) ? body.map(reply) : reply(body)
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify(payload) })
    })

    const readStore = () => page.evaluate(() => window.localStorage.getItem('customRpcUrls'))

    // Invalid URL: inline error and save disabled.
    await settingsPage.rpcUrlInput.fill('not a url')
    await expect(page.getByText(/Enter a valid URL/i)).toBeVisible()
    await expect(settingsPage.rpcSaveButton).toBeDisabled()

    // Valid URL: probe succeeds and a reload prompt appears.
    await settingsPage.rpcUrlInput.fill(customUrl)
    await expect(settingsPage.rpcSaveButton).toBeEnabled()
    await settingsPage.rpcSaveButton.click()
    await expect(settingsPage.rpcReloadButton).toBeVisible()
    expect(probed).toBe(true)
    expect(await readStore()).toContain('__ens_custom_rpc')

    // Reset clears the stored entry for the active chain.
    await settingsPage.rpcResetButton.click()
    await expect(settingsPage.rpcUrlInput).toHaveValue('')
    expect(await readStore()).not.toContain('__ens_custom_rpc')

    // Re-save, then confirm the override survives a full page reload (per-device persistence).
    await settingsPage.rpcUrlInput.fill(customUrl)
    await expect(settingsPage.rpcSaveButton).toBeEnabled()
    await settingsPage.rpcSaveButton.click()
    await expect(settingsPage.rpcReloadButton).toBeVisible()
    await page.reload()
    expect(await readStore()).toContain('__ens_custom_rpc')
  })
})
