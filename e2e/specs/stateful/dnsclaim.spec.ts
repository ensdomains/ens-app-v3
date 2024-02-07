import { expect } from '@playwright/test'

import { test } from '../../../playwright/index.js'

test.describe('Import DNSSEC name', () => {
  test('should not proceed allow proceeding further than DNSSEC step when DNSSEC is not enabled on that domain', async ({
    page,
    login,
  }) => {
    await page.goto('/notdnssec.com')
    await login.connect()

    await page.getByTestId('onchain-radio').click()
    await page.getByTestId('import-next-button').click()
    await expect(page.getByText('Enable DNSSEC')).toBeVisible()
    await expect(page.getByTestId('status-checker-message')).toContainText('DNSSEC is not enabled')
    await expect(page.getByTestId('import-next-button')).toBeDisabled()
  })

  test('should not allow the user to proceed if they have not set the correct subdomain', async ({
    page,
    login,
  }) => {
    await page.goto('/noenssubdomain.com')
    await login.connect()

    await page.getByTestId('onchain-radio').click()
    await page.getByTestId('import-next-button').click()
    await expect(page.getByText('Verify Ownership')).toBeVisible()
    await expect(page.getByTestId('status-checker-message')).toContainText('No record found')
    await expect(page.getByTestId('import-next-button')).toBeDisabled()
  })

  test('should not allow the use to proceed if they have not set the correct subdomain with the correct info', async ({
    page,
    login,
  }) => {
    await page.goto('/invalidensrecord.com')
    await login.connect()

    await page.getByTestId('onchain-radio').click()
    await page.getByTestId('import-next-button').click()
    await expect(page.getByText('Verify Ownership')).toBeVisible()
    await expect(page.getByTestId('status-checker-message')).toContainText('Invalid record found')
    await expect(page.getByTestId('import-next-button')).toBeDisabled()
  })
})
