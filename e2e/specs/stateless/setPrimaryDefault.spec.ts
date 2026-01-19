import { expect } from '@playwright/test'

import { test } from '../../../playwright'
import { createAccounts } from '../../../playwright/fixtures/accounts'

test.describe('Primary Name with Default Registry', () => {
  test.describe('Setting Primary Name', () => {
    test('should set primary to default registry when user has no L1 primary', async ({
      page,
      login,
      makeName,
      makePageObject,
      primaryName,
    }) => {
      test.slow()

      const name = await makeName({
        label: 'set-default-primary',
        type: 'legacy',
        owner: 'user',
        addr: 'user',
      })

      // Clear all primary names - user has NO L1 primary
      await primaryName.clearAll('user')

      const profilePage = makePageObject('ProfilePage')
      const transactionModal = makePageObject('TransactionModal')

      const accounts = createAccounts()

      await profilePage.goto(name)
      await login.connect()

      // Wait for profile to load with ETH address visible
      await expect(page.getByTestId('address-profile-button-eth')).toContainText(
        accounts.getAddress('user', 5),
      )

      await page.getByText('Set as primary name').click()

      // Should show "Set the default primary name" (not regular primary)
      await expect(page.getByTestId('display-item-info-normal')).toContainText(
        'Set the default primary name for your address',
      )

      await transactionModal.autoComplete()

      // Verify the primary name is set
      await expect(page.getByTestId('profile-title')).toHaveText(name)

      // Verify the state via utility
      const state = await primaryName.getState('user')
      expect(state.default).toBe(name)
      expect(state.l1).toBeFalsy()
    })

    test('should set primary to L1 registry when user already has L1 primary', async ({
      page,
      login,
      makeName,
      makePageObject,
      primaryName,
    }) => {
      test.slow()

      const [existingPrimary, newPrimary] = await makeName([
        {
          label: 'existing-l1-primary',
          type: 'legacy',
          owner: 'user',
          addr: 'user',
        },
        {
          label: 'new-l1-primary',
          type: 'legacy',
          owner: 'user',
          addr: 'user',
        },
      ])

      // Set existing L1 primary (user HAS L1 primary)
      await primaryName.setState({
        user: 'user',
        state: { l1: existingPrimary, default: '' },
      })

      const profilePage = makePageObject('ProfilePage')
      const transactionModal = makePageObject('TransactionModal')

      const accounts = createAccounts()

      await profilePage.goto(newPrimary)
      await login.connect()

      // Wait for profile to load with ETH address visible
      await expect(page.getByTestId('address-profile-button-eth')).toContainText(
        accounts.getAddress('user', 5),
      )

      await page.getByText('Set as primary name').click()

      // Should show regular "Set the primary name" (not default)
      await expect(page.getByTestId('display-item-info-normal')).toContainText(
        'Set the primary name for your address',
      )

      await transactionModal.autoComplete()

      // Verify the primary name is updated
      await expect(page.getByTestId('profile-title')).toHaveText(newPrimary)

      // Verify the state - L1 should be updated
      const state = await primaryName.getState('user')
      expect(state.l1).toBe(newPrimary)
    })
  })

  test.describe('Resetting Primary Name', () => {
    test('should reset only L1 when no default exists', async ({
      page,
      login,
      makeName,
      makePageObject,
      primaryName,
    }) => {
      test.slow()

      const name = await makeName({
        label: 'reset-l1-only',
        type: 'legacy',
        owner: 'user',
        addr: 'user',
      })

      // Set only L1 primary
      await primaryName.setState({
        user: 'user',
        state: { l1: name, default: '' },
      })

      const settingsPage = makePageObject('SettingsPage')
      const transactionModal = makePageObject('TransactionModal')

      await settingsPage.goto()
      await login.connect()

      await expect(settingsPage.getPrimaryNameLabel()).toHaveText(name, { timeout: 15000 })

      await page.getByTestId('reset-primary-name-button').click()
      await page.getByTestId('primary-next').click()

      // Should NOT show intro with steps (single transaction)
      await expect(page.getByTestId('display-item-Step 1-normal')).toHaveCount(0)

      await transactionModal.autoComplete()

      // Verify both are cleared
      const state = await primaryName.getState('user')
      expect(state.l1).toBeFalsy()
      expect(state.default).toBeFalsy()
    })

    test('should reset only default when no L1 exists', async ({
      page,
      login,
      makeName,
      makePageObject,
      primaryName,
    }) => {
      test.slow()

      const name = await makeName({
        label: 'reset-default-only',
        type: 'legacy',
        owner: 'user',
        addr: 'user',
      })

      // Set only default primary (no L1)
      await primaryName.setState({
        user: 'user',
        state: { l1: '', default: name },
      })

      const settingsPage = makePageObject('SettingsPage')
      const transactionModal = makePageObject('TransactionModal')

      await settingsPage.goto()
      await login.connect()

      await expect(settingsPage.getPrimaryNameLabel()).toHaveText(name, { timeout: 15000 })

      await page.getByTestId('reset-primary-name-button').click()
      await page.getByTestId('primary-next').click()

      // Should NOT show intro with steps (single transaction)
      await expect(page.getByTestId('display-item-Step 1-normal')).toHaveCount(0)

      await transactionModal.autoComplete()

      // Verify both are cleared
      const state = await primaryName.getState('user')
      expect(state.l1).toBeFalsy()
      expect(state.default).toBeFalsy()
    })

    test('should show intro and reset both when L1 and default exist', async ({
      page,
      login,
      makeName,
      makePageObject,
      primaryName,
    }) => {
      test.slow()

      const name = await makeName({
        label: 'reset-both',
        type: 'legacy',
        owner: 'user',
        addr: 'user',
      })

      // Set BOTH L1 and default primary
      await primaryName.setState({
        user: 'user',
        state: { l1: name, default: name },
      })

      const settingsPage = makePageObject('SettingsPage')
      const transactionModal = makePageObject('TransactionModal')

      await settingsPage.goto()
      await login.connect()

      await expect(settingsPage.getPrimaryNameLabel()).toHaveText(name, { timeout: 15000 })

      await page.getByTestId('reset-primary-name-button').click()
      await page.getByTestId('primary-next').click()

      // SHOULD show intro with steps (multiple transactions)
      await expect(page.getByTestId('display-item-Step 1-normal')).toBeVisible()
      await expect(page.getByTestId('display-item-Step 2-normal')).toBeVisible()

      await transactionModal.autoComplete()

      // Verify both are cleared
      const state = await primaryName.getState('user')
      expect(state.l1).toBeFalsy()
      expect(state.default).toBeFalsy()
    })
  })

  test.describe('UI Behavior', () => {
    test('should show remove button when primary comes from default registry', async ({
      page,
      login,
      makeName,
      makePageObject,
      primaryName,
    }) => {
      test.slow()

      const name = await makeName({
        label: 'default-source-ui',
        type: 'legacy',
        owner: 'user',
        addr: 'user',
      })

      // Set only default (inherited/fallback)
      await primaryName.setState({
        user: 'user',
        state: { l1: '', default: name },
      })

      const settingsPage = makePageObject('SettingsPage')

      await settingsPage.goto()
      await login.connect()

      await expect(settingsPage.getPrimaryNameLabel()).toHaveText(name, { timeout: 15000 })

      // Remove button SHOULD be visible (was previously hidden for inherited names)
      await expect(page.getByTestId('reset-primary-name-button')).toBeVisible()
    })

    test('should filter current primary from selection list', async ({
      page,
      login,
      makeName,
      makePageObject,
      primaryName,
    }) => {
      test.slow()

      const [currentPrimary, otherName] = await makeName([
        { label: 'current-primary', type: 'legacy', owner: 'user', addr: 'user' },
        { label: 'other-name', type: 'legacy', owner: 'user', addr: 'user' },
      ])

      await primaryName.setState({
        user: 'user',
        state: { l1: currentPrimary, default: '' },
      })

      const settingsPage = makePageObject('SettingsPage')
      const selectPrimaryNameModal = makePageObject('SelectPrimaryNameModal')

      await settingsPage.goto()
      await login.connect()

      await settingsPage.changePrimaryNameButton.click()
      await selectPrimaryNameModal.waitForPageLoad()

      // Current primary should NOT be in the list
      const currentLabel = currentPrimary.slice(0, -4)
      await selectPrimaryNameModal.searchInput.fill(currentLabel)
      await selectPrimaryNameModal.searchInput.press('Enter')
      await selectPrimaryNameModal.waitForPageLoad()
      await expect(page.getByText('No names found')).toBeVisible({ timeout: 30000 })

      // Other name SHOULD be in the list
      const otherLabel = otherName.slice(0, -4)
      await selectPrimaryNameModal.searchInput.fill(otherLabel)
      await selectPrimaryNameModal.searchInput.press('Enter')
      await selectPrimaryNameModal.waitForPageLoad()
      await expect(await selectPrimaryNameModal.getPrimaryNameItem(otherLabel)).toBeVisible()
    })
  })
})
