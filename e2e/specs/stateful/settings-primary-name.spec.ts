import { expect } from '@playwright/test'

import { test } from '../../../playwright/index.js'

test.describe('Settings Tab Primary Names', () => {
  test(`should enter settings tab and check network specific primary names @mainnet`, async ({
    page,
    login,
  }) => {
    const mainSection = page.locator(
      '.NetworkSpecificPrimaryNamesSection__NetworkSpecificSection-sc-f0f1211a-0.iaIaKv',
    )
    const parentTitle = mainSection.locator(
      'div.NetworkSpecificPrimaryNamesSection__NetworkSectionHeader-sc-f0f1211a-2 >> text="Network-specific primary names"',
    )
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
    await expect(page.getByText('Settings')).toBeVisible()

    // Check network specific primary names are showing
    await expect(parentTitle).toHaveText('Network-specific primary names')

    // Check all names are visible
    for (const name of ensNames) {
      await expect(mainSection.getByText(name)).toBeVisible()
    }
  })
})
