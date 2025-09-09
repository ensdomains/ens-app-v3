import { expect } from '@playwright/test'

import { test } from '../../../playwright/index.js'

test.describe('Settings Tab Primary Names', () => {
  test(`should enter settings tab and check network specific primary names @mainnet`, async ({
    page,
    login,
  }) => {
    const ensNames = [
      'default-ens.eth',
      'arbprimary.eth',
      'baseprimary.eth',
      'opprimary.eth',
      'lineaprimary.eth',
    ]

    // Enter ens app and connect
    await page.goto('/')
    await login.connect()

    // Go to settings page
    await page.goto('/my/settings')
    await expect(page.getByText('Settings').first()).toBeVisible()

    // Check network specific primary names are showing
    await expect(page.getByText('Network-specific primary names').first()).toBeVisible()

    // Check all ENS names are visible (each gets up to 15 seconds)
    for (const name of ensNames) {
      await expect(page.getByText(name).first()).toBeVisible({ timeout: 15000 })
    }

    // Check all network rows are visible (each gets up to 15 seconds)
    for (const name of ensNames) {
      await expect(page.getByTestId(`network-row-${name}`)).toBeVisible({ timeout: 15000 })
    }

    await expect(page.getByTestId(`network-icon-${ensNames[0]}-eth`)).toBeVisible()
    await expect(page.getByTestId(`network-icon-${ensNames[0]}-scr`)).toBeVisible()
    await expect(page.getByTestId(`network-icon-${ensNames[1]}-arb1`)).toBeVisible()
    await expect(page.getByTestId(`network-icon-${ensNames[2]}-base`)).toBeVisible()
    await expect(page.getByTestId(`network-icon-${ensNames[3]}-op`)).toBeVisible()
    await expect(page.getByTestId(`network-icon-${ensNames[4]}-linea`)).toBeVisible()
  })
})
