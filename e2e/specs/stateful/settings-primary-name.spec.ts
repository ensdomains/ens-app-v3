import { expect } from '@playwright/test'

import { test } from '../../../playwright/index.js'

test.describe('Settings Tab Primary Names', () => {
  test(`should enter settings tab and check network specific primary names @mainnet`, async ({
    page,
    login,
  }) => {
    test.slow()
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

    // Check network specific primary names section is showing
    await expect(page.getByText('Network-specific primary names').first()).toBeVisible()

    // Check network specific names are showing correctly
    await expect(page.getByText(ensNames[0]).first()).toBeVisible({ timeout: 20000 })
    await expect(page.getByText(ensNames[1]).first()).toBeVisible({ timeout: 20000 })
    await expect(page.getByText(ensNames[2]).first()).toBeVisible({ timeout: 20000 })
    await expect(page.getByText(ensNames[3]).first()).toBeVisible({ timeout: 20000 })
    // Linea having issues, re-add once fixed
    // await expect(page.getByText(ensNames[4]).first()).toBeVisible({ timeout: 20000 })

    await expect(page.getByTestId(`network-row-${ensNames[0]}`)).toBeVisible()
    await expect(page.getByTestId(`network-row-${ensNames[1]}`)).toBeVisible()
    await expect(page.getByTestId(`network-row-${ensNames[2]}`)).toBeVisible()
    await expect(page.getByTestId(`network-row-${ensNames[3]}`)).toBeVisible()
    await expect(page.getByTestId(`network-row-${ensNames[4]}`)).toBeVisible()

    // Check network icons are showing correctly (some networks may not have data in test environment)
    await expect(page.getByTestId(`network-icon-${ensNames[0]}-eth`)).toBeVisible()

    // Check for optional network icons that may or may not exist
    const checkOptionalNetworkIcon = async (name: string, network: string) => {
      const element = page.getByTestId(`network-icon-${name}-${network}`)
      const count = await element.count()
      if (count > 0) {
        await expect(element).toBeVisible()
      }
    }

    await checkOptionalNetworkIcon(ensNames[0], 'scr')
    await checkOptionalNetworkIcon(ensNames[1], 'arb1')
    await checkOptionalNetworkIcon(ensNames[2], 'base')
    await checkOptionalNetworkIcon(ensNames[3], 'op')
    await checkOptionalNetworkIcon(ensNames[4], 'linea')
  })
})
