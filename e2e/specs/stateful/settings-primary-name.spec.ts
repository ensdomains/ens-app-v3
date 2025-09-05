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
    await expect(page.getByText('Settings')).toBeVisible()

    // Check network specific primary names are showing
    await expect(page.getByText('Network-specific primary names').first()).toBeVisible()

    // Check all names are visible
    // for (const name of ensNames) {
    //   expect(page.getByText(name).first()).toBeVisible()
    // }
    await expect(page.getByText(ensNames[0]).first()).toBeVisible()
    await expect(page.getByText(ensNames[1]).first()).toBeVisible()
    await expect(page.getByText(ensNames[2]).first()).toBeVisible()
    await expect(page.getByText(ensNames[3]).first()).toBeVisible()
    await expect(page.getByText(ensNames[4]).first()).toBeVisible()
  })
})
