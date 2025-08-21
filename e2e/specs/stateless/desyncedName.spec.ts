import { expect } from '@playwright/test'

import { dateToDateInput, roundDurationWithDay, secondsToDateInput } from '@app/utils/date'

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
      const homePage = makePageObject('HomePage')

      await homePage.goto()

      await test.step('should search name and check label is "Out of sync" before repair', async () => {
        await homePage.searchInput.fill(name)
        await page.locator('[data-testid="search-result-name"]', { hasText: name }).waitFor()
        await page.waitForTimeout(2000)
        await expect(
          page.locator('[data-testid="search-result-name"]', { hasText: 'Out of sync' }),
        ).toBeVisible()
      })

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

      await test.step('should check owner is showing as 0x000...', async () => {
        const ownerProfileButton = page.locator('[data-testid="owner-profile-button-name.manager"]')
        await expect(ownerProfileButton).toBeVisible()
        await expect(ownerProfileButton).toContainText('0x000...00000')
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

      await test.step('should check owner is updated to connected wallet', async () => {
        const ownerProfileButton = page.locator('[data-testid="owner-profile-button-name.owner"]')
        await expect(ownerProfileButton).toBeVisible()
        await expect(ownerProfileButton).toContainText('0x709...c79C8')
      })

      await test.step('should search name and check label is "Registered" after repair', async () => {
        await homePage.searchInput.fill(name)
        await page.locator('[data-testid="search-result-name"]', { hasText: name }).waitFor()
        await page.waitForTimeout(2000)
        await expect(
          page.locator('[data-testid="search-result-name"]', { hasText: 'Registered' }),
        ).toBeVisible()
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
      const homePage = makePageObject('HomePage')

      await homePage.goto()

      await test.step('should search name and check label is "Out of sync" before repair', async () => {
        await homePage.searchInput.fill(name)
        await page.locator('[data-testid="search-result-name"]', { hasText: name }).waitFor()
        await page.waitForTimeout(2000)
        await expect(
          page.locator('[data-testid="search-result-name"]', { hasText: 'Out of sync' }),
        ).toBeVisible()
      })

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

      await test.step('should search name and check label is "Registered" after repair', async () => {
        await homePage.searchInput.fill(name)
        await page.locator('[data-testid="search-result-name"]', { hasText: name }).waitFor()
        await page.waitForTimeout(2000)
        await expect(
          page.locator('[data-testid="search-result-name"]', { hasText: 'Registered' }),
        ).toBeVisible()
      })
    })
  })

  test.describe('Regular Desynced Name Extend Button', () => {
    test('should repair desynced-normal-test.eth using the extend modal', async ({
      page,
      login,
      makePageObject,
    }) => {
      const name = 'desynced-normal-test.eth'
      const profilePage = makePageObject('ProfilePage')
      const transactionModal = makePageObject('TransactionModal')
      const homePage = makePageObject('HomePage')
      const extendButton = page.locator('[data-testid="extend-button"]')

      await homePage.goto()

      await test.step('should search name and check label is "Out of sync" before repair', async () => {
        await homePage.searchInput.fill(name)
        await page.locator('[data-testid="search-result-name"]', { hasText: name }).waitFor()
        await page.waitForTimeout(2000)
        await expect(
          page.locator('[data-testid="search-result-name"]', { hasText: 'Out of sync' }),
        ).toBeVisible()
      })

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

      await test.step('check for extend button on the profile page', async () => {
        await expect(extendButton).toBeVisible()
        await expect(extendButton).toHaveText('Extend')
      })

      await test.step('click the Extend button', async () => {
        await extendButton.click()
      })

      await test.step('acknowledge ownership warning', async () => {
        await expect(page.getByText(`You do not own ${name}`)).toBeVisible()
        await page.locator('[data-testid="extend-names-confirm"]').click()
      })

      await test.step('verify 1 year extension is auto set', async () => {
        await expect(page.locator('[data-testid="date-selection-info"]')).toHaveText(
          '1 year extension. Pick by date',
        )
        await expect(page.locator('[data-testid="invoice-item-0"]')).toContainText(
          '1 year extension',
        )
      })

      await test.step('click confirm to start transaction flow', async () => {
        await page.locator('[data-testid="extend-names-confirm"]').click()
      })

      await test.step('complete transaction flow', async () => {
        // Complete transaction flow
        await transactionModal.autoComplete()

        // Check if success modal appears
        await expect(page.getByText('Your "Extend names" transaction was successful')).toBeVisible({
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

      await test.step('should search name and check label is "Registered" after repair', async () => {
        await homePage.searchInput.fill(name)
        await page.locator('[data-testid="search-result-name"]', { hasText: name }).waitFor()
        await page.waitForTimeout(2000)
        await expect(
          page.locator('[data-testid="search-result-name"]', { hasText: 'Registered' }),
        ).toBeVisible()
      })
    })
  })

  test.describe('Grace Period Desynced Name Extend Button', () => {
    test('should repair desynced-normal-test.eth using the extend modal', async ({
      page,
      login,
      makePageObject,
    }) => {
      const name = 'desynced-grace-test.eth'
      const profilePage = makePageObject('ProfilePage')
      const transactionModal = makePageObject('TransactionModal')
      const homePage = makePageObject('HomePage')
      const extendButton = page.locator('[data-testid="extend-button"]')

      await homePage.goto()

      await test.step('should search name and check label is "Out of sync" before repair', async () => {
        await homePage.searchInput.fill(name)
        await page.locator('[data-testid="search-result-name"]', { hasText: name }).waitFor()
        await page.waitForTimeout(2000)
        await expect(
          page.locator('[data-testid="search-result-name"]', { hasText: 'Out of sync' }),
        ).toBeVisible()
      })

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

      await test.step('check for extend button on the profile page', async () => {
        await expect(extendButton).toBeVisible()
        await expect(extendButton).toHaveText('Extend')
      })

      await test.step('click the Extend button', async () => {
        await extendButton.click()
      })

      await test.step('acknowledge ownership warning', async () => {
        await expect(page.getByText(`You do not own ${name}`)).toBeVisible()
        await page.locator('[data-testid="extend-names-confirm"]').click()
      })

      await test.step('verify 1 year extension is auto set', async () => {
        await expect(page.locator('[data-testid="date-selection-info"]')).toHaveText(
          '1 year extension. Pick by date',
        )
        await expect(page.locator('[data-testid="invoice-item-0"]')).toContainText(
          '1 year extension',
        )
      })

      await test.step('click confirm to start transaction flow', async () => {
        await page.locator('[data-testid="extend-names-confirm"]').click()
      })

      await test.step('complete transaction flow', async () => {
        // Complete transaction flow
        await transactionModal.autoComplete()

        // Check if success modal appears
        await expect(page.getByText('Your "Extend names" transaction was successful')).toBeVisible({
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

      await test.step('should search name and check label is "Registered" after repair', async () => {
        await homePage.searchInput.fill(name)
        await page.locator('[data-testid="search-result-name"]', { hasText: name }).waitFor()
        await page.waitForTimeout(2000)
        await expect(
          page.locator('[data-testid="search-result-name"]', { hasText: 'Registered' }),
        ).toBeVisible()
      })
    })
  })

  test.describe('Regular Desynced Name Extend Button 1 day', () => {
    test('should repair desynced-normal-1-day-test.eth using the extend modal', async ({
      page,
      login,
      makePageObject,
    }) => {
      const name = 'desynced-normal-1-day-test.eth'
      const profilePage = makePageObject('ProfilePage')
      const transactionModal = makePageObject('TransactionModal')
      const homePage = makePageObject('HomePage')
      const extendButton = page.locator('[data-testid="extend-button"]')

      await homePage.goto()

      await test.step('should search name and check label is "Out of sync" before repair', async () => {
        await homePage.searchInput.fill(name)
        await page.locator('[data-testid="search-result-name"]', { hasText: name }).waitFor()
        await page.waitForTimeout(2000)
        await expect(
          page.locator('[data-testid="search-result-name"]', { hasText: 'Out of sync' }),
        ).toBeVisible()
      })

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

      await test.step('check for extend button on the profile page', async () => {
        await expect(extendButton).toBeVisible()
        await expect(extendButton).toHaveText('Extend')
      })

      await test.step('click the Extend button', async () => {
        await extendButton.click()
      })

      await test.step('acknowledge ownership warning', async () => {
        await expect(page.getByText(`You do not own ${name}`)).toBeVisible()
        await page.locator('[data-testid="extend-names-confirm"]').click()
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

      await test.step('verify 1 day extension is set', async () => {
        await expect(page.locator('[data-testid="date-selection-info"]')).toHaveText(
          '1 day extension. Pick by years',
        )
        await expect(page.locator('[data-testid="invoice-item-0"]')).toContainText(
          '1 day extension',
        )
      })

      await test.step('click confirm to start transaction flow', async () => {
        await page.locator('[data-testid="extend-names-confirm"]').click()
      })

      await test.step('complete transaction flow', async () => {
        // Complete transaction flow
        await transactionModal.autoComplete()

        // Check if success modal appears
        await expect(page.getByText('Your "Extend names" transaction was successful')).toBeVisible({
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

      await test.step('should search name and check label is "Registered" after repair', async () => {
        await homePage.searchInput.fill(name)
        await page.locator('[data-testid="search-result-name"]', { hasText: name }).waitFor()
        await page.waitForTimeout(2000)
        await expect(
          page.locator('[data-testid="search-result-name"]', { hasText: 'Registered' }),
        ).toBeVisible()
      })
    })
  })
})
