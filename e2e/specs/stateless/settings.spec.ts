import { expect } from '@playwright/test'
import { test } from '@root/playwright'

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

    await expect(page.getByText('Test transaction')).toBeVisible()

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
