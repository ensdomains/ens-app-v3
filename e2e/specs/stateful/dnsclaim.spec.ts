import { expect } from '@playwright/test'
import { test } from '@root/playwright'

test.describe('Import DNSSEC name', () => {
  test('should not proceed if DNSSEC is not enabled on that domain', async ({ page, login }) => {
    await page.goto('/notdnssec.com')
    await login.connect()

    await page.getByTestId('dnssec-check-button').click()
    await expect(page.getByText('DNSSEC has not been enabled on this domain.')).toBeVisible({
      timeout: 25000,
    })
  })

  test('should not allow the user to proceed if they have not set the correct subdomain', async ({
    page,
    login,
  }) => {
    await page.goto('/noenssubdomain.com')
    await login.connect()

    await page.getByTestId('dnssec-check-button').click()
    await expect(page.getByText('Subdomain not set')).toBeVisible()
  })

  test('should not allow the use to proceed if they have not set the correct subdomain with the correct info', async ({
    page,
    login,
  }) => {
    await page.goto('/invalidensrecord.com')
    await login.connect()

    await page.getByTestId('dnssec-check-button').click()
    await expect(page.getByText('Record Invalid')).toBeVisible()
  })

  test('should allow user to import a domain that they are not the owner of', async ({
    page,
    login,
    accounts,
    makePageObject,
  }) => {
    const transactionModal = makePageObject('TransactionModal')

    await page.goto('/leontalbert.xyz/import')
    await login.connect()

    const address = accounts.getAddress('user')
    await expect(page.getByText(`a=${address}`)).toBeVisible({
      timeout: 25000,
    })
    await page.getByTestId('dnssec-check-button').click()
    await expect(
      page.getByText(
        "You don't appear to be the DNS Owner of this domain, but you can still add this name to ENS Registry.",
      ),
    ).toBeVisible({ timeout: 25000 })
    await page.getByText('Continue').click()
    await expect(
      page.getByText('You are importing a DNS name that you appear to not own.'),
    ).toBeVisible({ timeout: 25000 })
    await page.getByRole('button', { name: 'Claim' }).click()
    await transactionModal.confirm()
    await transactionModal.complete()
    await expect(page.getByText('Congratulations!')).toBeVisible({ timeout: 25000 })
  })

  test('should allow user to import a name that they are the owner of', async ({
    page,
    login,
    accounts,
    makePageObject,
  }) => {
    const transactionModal = makePageObject('TransactionModal')

    await page.goto('/leontalbert.com/import')
    await login.connect()

    const address = accounts.getAddress('user')
    await expect(page.getByText(`a=${address}`)).toBeVisible({
      timeout: 25000,
    })
    await page.getByTestId('dnssec-check-button').click()
    await expect(
      page.getByText('You have verified your ownership and can claim this domain.'),
    ).toBeVisible({ timeout: 25000 })
    await page.getByRole('button', { name: 'Claim' }).click()
    await transactionModal.confirm()
    await transactionModal.complete()
    await expect(page.getByText('Congratulations!')).toBeVisible({ timeout: 25000 })

    await page.getByRole('button', { name: 'View Name' }).click()
    await expect(page.getByText('manager')).toBeVisible({ timeout: 25000 })
  })

  test('should not show the success message again once acknowledged', async ({ page, login }) => {
    await page.goto('/leontalbert.com')
    await login.connect()
    await page.reload()
    await expect(page.getByText('manager')).toBeVisible({ timeout: 25000 })
  })
})
