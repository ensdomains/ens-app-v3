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

    await expect(page.getByText(ensNames[0]).first()).toBeVisible()
    await expect(page.getByText(ensNames[1]).first()).toBeVisible()
    await expect(page.getByText(ensNames[2]).first()).toBeVisible()
    await expect(page.getByText(ensNames[3]).first()).toBeVisible()
    await expect(page.getByText(ensNames[4]).first()).toBeVisible()

    await expect(page.getByTestId(`network-row-${ensNames[0]}`)).toBeVisible()
    await expect(page.getByTestId(`network-row-${ensNames[1]}`)).toBeVisible()
    await expect(page.getByTestId(`network-row-${ensNames[2]}`)).toBeVisible()
    await expect(page.getByTestId(`network-row-${ensNames[3]}`)).toBeVisible()
    await expect(page.getByTestId(`network-row-${ensNames[4]}`)).toBeVisible()

    await expect(page.getByTestId(`network-icon-${ensNames[0]}-eth`)).toBeVisible()
    await expect(page.getByTestId(`network-icon-${ensNames[0]}-scr`)).toBeVisible()
    await expect(page.getByTestId(`network-icon-${ensNames[1]}-arb1`)).toBeVisible()
    await expect(page.getByTestId(`network-icon-${ensNames[2]}-base`)).toBeVisible()
    await expect(page.getByTestId(`network-icon-${ensNames[3]}-op`)).toBeVisible()
    await expect(page.getByTestId(`network-icon-${ensNames[4]}-linea`)).toBeVisible()
  })
})
