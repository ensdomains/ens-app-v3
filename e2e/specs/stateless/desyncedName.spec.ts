import { expect } from '@playwright/test'

import { test } from '../../../playwright'

test.describe('Desynced Name Repair', () => {
  test.describe('Regular Desynced Name', () => {
    test('should repair desynced-wrapped.eth successfully', async ({
      page,
      login,
      makePageObject,
    }) => {
      const name = 'desynced-wrapped.eth'
      const profilePage = makePageObject('ProfilePage')
      const transactionModal = makePageObject('TransactionModal')

      await test.step('should navigate to profile and connect', async () => {
        await profilePage.goto(name)
        await login.connect()
      })

      await page.pause()

      await test.step('should show desynced banner with repair button', async () => {
        // Look for the desynced banner with repair functionality
        await expect(page.getByText('Name misconfigured')).toBeVisible()
        await expect(
          page.getByText(
            'Extending the expiry – even by a single day – will restore accurate ownership information.',
          ),
        ).toBeVisible()
        await expect(page.getByRole('button', { name: 'Repair' })).toBeVisible()
      })

      await test.step('should complete repair transaction', async () => {
        // Click the repair button
        await page.getByRole('button', { name: 'Repair' }).click()

        // Wait for transaction modal and complete it
        await transactionModal.autoComplete()

        // Verify transaction success
        await expect(page.getByText('Your "Repair name" transaction was successful')).toBeVisible({
          timeout: 15000,
        })
      })

      await test.step('should hide desynced banner after successful repair', async () => {
        // Wait for the banner to disappear
        await expect(page.getByText('Name misconfigured')).not.toBeVisible({
          timeout: 10000,
        })
        await expect(page.getByRole('button', { name: 'Repair' })).not.toBeVisible({
          timeout: 10000,
        })
      })
    })
  })

  test.describe('Grace Period Desynced Name', () => {
    test('should repair desynced-wrapped-grace-period.eth via extend dialog', async ({
      page,
      login,
      makePageObject,
    }) => {
      const name = 'desynced-wrapped-grace-period.eth'
      const profilePage = makePageObject('ProfilePage')
      const transactionModal = makePageObject('TransactionModal')

      await test.step('should navigate to profile and connect', async () => {
        await profilePage.goto(name)
        await login.connect()
      })

      await page.pause()

      await test.step('should show desynced banner with repair button', async () => {
        // Look for the desynced banner with repair functionality
        await expect(page.getByText('Name misconfigured')).toBeVisible()
        await expect(
          page.getByText(
            'Extending the name past the grace period will restore accurate ownership information.',
          ),
        ).toBeVisible()
        await expect(page.getByRole('button', { name: 'Repair' })).toBeVisible()
      })

      await test.step('should open extend names dialog when repair is clicked', async () => {
        // Click the repair button
        await page.getByRole('button', { name: 'Repair' }).click()

        // Should show extend names dialog instead of direct repair
        await expect(page.getByText(`Extend ${name}`)).toBeVisible()
        await expect(page.getByTestId('extend-names-confirm')).toBeVisible()
      })

      await test.step('should complete extend transaction', async () => {
        // Confirm the extension
        await page.getByTestId('extend-names-confirm').click()

        // Wait for transaction modal and complete it
        await transactionModal.autoComplete()

        // Verify transaction success
        await expect(page.getByText('Your "Extend names" transaction was successful')).toBeVisible({
          timeout: 15000,
        })
      })

      await test.step('should hide desynced banner after successful extension', async () => {
        // Wait for the banner to disappear
        await expect(page.getByText('Name misconfigured')).not.toBeVisible({
          timeout: 10000,
        })
        await expect(page.getByRole('button', { name: 'Repair' })).not.toBeVisible({
          timeout: 10000,
        })
      })
    })
  })
})
